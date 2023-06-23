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

	async getToken(userId: number): Promise<string> {
		const sql = `
			SELECT token 
			FROM users
			WHERE id = ?
    	`;
		const row = await db.get(sql, [userId]);
		if (row === undefined)
			return "404";
		if (!row.token)
			return "404";
		return row.token;
	}

};

export default JwtDb;