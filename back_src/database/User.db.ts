import { FullUser, UserReqRegister } from "../../comon_src/type/user.type";
import Dbhandler from "./DbHandler";
interface test { 
    id: number,
    email: string,
    accessCode: number
  }
export default class UserDb extends Dbhandler {
//TODO trouver un nom a test
    async insertUser(user: UserReqRegister): Promise<test> {
        //peu etre plus de sens de le mettre dans profileCtrl ?
        const accessCode = Math.floor(Math.random() * 90000 + 10000)
        const query = `
            INSERT INTO users (email, username, lastName, firstName, password, accessCode, emailVerified)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          const params = [user.email, user.username, user.lastName, user.firstName, user.password, accessCode, 0];
      //TODO rename test
          return new Promise<test>((resolve, reject) => {
              this.db.run(query, params, function (err) {
                if (err) {
                  if (err.message.includes('UNIQUE constraint failed') ) {
                    reject(409);
                    return 
                    } else {
                      console.error(err);
                    reject(500);
                    return 
  
                    }
                } else {
                  resolve({id:this.lastID, accessCode, email:user.email});
                }
              });
            });
        }
  
      deletUser(id) {
          this.db.run('DELETE FROM users WHERE id = ?', [id]);
      }


    findUser(login: string): Promise<FullUser | null> {
        const query = `
        SELECT *
        FROM users
        WHERE email = ? OR username = ?
      `;
        
        return new Promise((resolve, reject) => {
            this.db.all(query,
                [login, login],
                (err: any, rows: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    //4 eme niveaux de complexiter on s en soucie ?
                    if (rows && rows.length > 0) {
                        const user: FullUser = rows[0];
                        user.emailVerified = user.emailVerified? true : false
                        resolve(user);
                    } else {
                        resolve(null);
                    }
                }
            );

        })
    }

}