import { FullUser } from "../../comon_src/type/user.type";
import Dbhandler from "./DbHandler";

export default class UserDb extends Dbhandler {
    findUser(login: string): Promise<FullUser | null> {
        const query = `
        SELECT *
        FROM users
        WHERE email = ? OR userName = ?
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
                        user.verified = user.verified? true : false
                        resolve(user);
                    } else {
                        resolve(null);
                    }
                }
            );

        })
    }

}