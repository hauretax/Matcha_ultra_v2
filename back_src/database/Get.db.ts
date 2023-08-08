import { Profile } from "../../comon_src/type/utils.type";
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
	// TODO #2

	async allInterests(): Promise<string[]> {
		const sql = "SELECT interest FROM interests";
		const res = await db.all(sql);
		const ret = res.map((interestObj: { interest: string }) => interestObj.interest);
		return ret;
	},

	async userLocalisation(id: number): Promise<{ latitude: number, longitude: number }> {
		const sql = `SELECT latitude, longitude 
		FROM "users"
		WHERE id = ?`;
		return db.get(sql, [id]);
	},

	async jwtToken(userId: number): Promise<{ token: string }> {
		const sql = `
			SELECT token 
			FROM users
			WHERE id = ?
    	`;
		return db.get(sql, [userId]);
	},

	//TODO il faudrais le fair correspondre a profiles
	async allConversation(userId: number): Promise<{ profiles: Profile[] }> {
		const sql = `
			SELECT u.*
			FROM users u
			WHERE EXISTS (
			SELECT ?
			FROM user_notes n1
			JOIN user_notes n2 ON n1.to_id = n2.from_id AND n2.to_id = n1.from_id
			WHERE n1.from_id = ? AND n1.to_id = u.id AND n2.from_id = u.id AND n2.to_id = ?
			);
		`;
		return db.get(sql, [userId, userId, userId]);
	}

};

export default GetDb;