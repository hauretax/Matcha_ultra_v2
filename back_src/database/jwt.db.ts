import { validToken } from "../../comon_src/type/jwt.type";
import Dbhandler from "./DbHandler";
//TODO changer toutes les promesse en try catch
export default class JwtDb extends Dbhandler {

	insertToken(token: string, date: Date): Promise<string> {
		const query = `
			INSERT INTO rjwt (token,endDate, isValide )
			VALUES (?, ?, 1 )
    	`;
		const params = [token, date.toString()];

		return new Promise<string>((resolve, reject) => {
			this.db.run(query, params, function (err: Error) {
				if (err) {
					console.log("error:", err);
					reject(500);
					return;
				} else {
					resolve("ok");
				}
			});
		});
	}

	invalidateToken(token: string): Promise<void> {
		const query = `
			UPDATE rjwt 
			SET isValide = 0
			WHERE token = ?
		`;

		const params = [token];
		return new Promise<void>((resolve, reject) => {
			this.db.run(query, params, function (err: Error) {
				if (err) {
					console.log("error:", err);
					reject(500);
					return;
				} else {
					resolve();
				}
			});
		});
	}

	tokenIsValide(token: string): Promise<boolean> {
		const query = `
			SELECT endDate, isValide
			FROM rjwt
			WHERE token = ?
		`;
		const params = [token];
		return new Promise<boolean>((resolve, reject) => {
			this.db.all(query, params, function (err: Error, rows: validToken[]) {
				if (err) {
					console.log(err);
					reject(500);
					return;
				} else {
					//veut on presiser les raison de l echeque du toke ?
					if (rows && rows.length > 0) {
						if (!rows[0].isValide)
							resolve(false);

						if (new Date(rows[0].endDate) < new Date())
							resolve(false);
						resolve(true);
					}
					else {
						resolve(false);
					}
				}
			});
		});
	}

	//TODO clean all token behind actuall date
	cleanToken() {
		console.log("work in progress");
	}

}