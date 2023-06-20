import { FullUser, UserReqRegister } from "../../comon_src/type/user.type";
import Dbhandler from "./DbHandler";
interface UserCredentials {
	id: number,
	email: string,
	accessCode: number
}

export default class UserDb extends Dbhandler {
	async insertUser(user: UserReqRegister): Promise<UserCredentials> {
		//peu etre plus de sens de le mettre dans profileCtrl ?
		const accessCode = Math.floor(Math.random() * 90000 + 10000);
		const query = `
            INSERT INTO users (email, username, lastName, firstName, password, accessCode, emailVerified)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
		const params = [user.email, user.username, user.lastName, user.firstName, user.password, accessCode, 0];
		return new Promise<UserCredentials>((resolve, reject) => {
			this.db.run(query, params, function (err) {
				if (err) {
					if (err.message.includes("UNIQUE constraint failed")) {
						reject(409);
						return;
					} else {
						console.log(err);
						reject(500);
						return;

          }
        } else {
          resolve({ id: this.lastID, accessCode, email: user.email });
        }
      });
    });
  }

  deleteUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

  }


  findUser(login: string): Promise<FullUser | null> {
    const query = `
        SELECT *
        FROM users
        WHERE username = ?
      `;

		return new Promise((resolve, reject) => {
			this.db.all(query,
				[login],
				(err: Error, rows: FullUser[]) => {
					if (err) {
						reject(err);
						return;
					}
					//4 eme niveaux de complexiter on s en soucie ?
					if (rows && rows.length > 0) {
						const user = rows[0];
						user.emailVerified = user.emailVerified ? true : false;
						resolve(user);
					}
				}
			);

    });
  }

}