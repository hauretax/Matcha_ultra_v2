import db from "./db";

const GetDb = {
	userbyMail(email: string) {
		const sql = `
		 SELECT * 
		 FROM users
		 WHERE email = ?
		`;
		return db.get(sql, [email]);
	},

	code(email: string) {
		const sql = "SELECT accessCode FROM users WHERE email = ?";
		return db.get(sql, [email]);
	},
	// TODO: Harmonize what's returned by functions in this file

	async allInterests(): Promise<string[]> {
		const sql = "SELECT interest FROM interests";
		const res = await db.all(sql);
		const ret = res.map((interestObj: { interest: string }) => interestObj.interest);
		return ret;
	},

	async userLocalisation(id:number): Promise<{ latitude: number, longitude: number }>{
		const sql = `SELECT latitude, longitude 
		FROM "users"
		WHERE id = ?`
		return db.get(sql, [id]);
	},

	async jwtToken(userId: number): Promise<{ token: string }> {
		const sql = `
			SELECT token 
			FROM users
			WHERE id = ?
    	`;
		return db.get(sql, [userId]);
	}

};

export default GetDb;