import db from "./db";


const JwtDb = {

	async insertToken(token: string, userId: number): Promise<void> {
		const sql = `
		UPDATE users 
		SET token = ?
			WHERE id = ?
    	`;
		await db.run(sql, [token, userId]);
	},

	async getToken(userId: number): Promise<{token:string}> {
		const sql = `
			SELECT token 
			FROM users
			WHERE id = ?
    	`;
		return db.get(sql, [userId]);
	}

};

export default JwtDb;