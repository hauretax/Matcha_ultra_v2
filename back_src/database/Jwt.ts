import { validToken } from "../../comon_src/type/jwt.type";
import db from './db';


const JwtDb = {

	initializeUserTable() {
		const sql = `
        CREATE TABLE IF NOT EXISTS rjwt (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT,
        isValide INTEGER,
        endDate TEXT
        )
        `;
		return db.run(sql);
	},

	async insertToken(token: string, date: Date): Promise<void> {
		const sql = `
			INSERT INTO rjwt (token,endDate, isValide )
			VALUES (?, ?, 1 )
    	`;
		await db.run(sql, [token, date.toString()]);
	},

	async invalidateToken(token: string): Promise<void> {
		const query = `
			UPDATE rjwt 
			SET isValide = 0
			WHERE token = ?
		`;
		db.run(query, [token]);
	},

	async tokenIsValide(token: string): Promise<boolean> {
		const query = `
			SELECT endDate, isValide
			FROM rjwt
			WHERE token = ?
		`;
		const params = [token];
		const row = await db.get(query, params)

		if (!row)
			return false
		if (!row.isValide)
			return false;
		if (new Date(row.endDate) < new Date())
			return false;
		return true;

	},

	//TODO clean all token behind actuall date
	cleanToken() {
		console.log("work in progress");
	}

}

export default JwtDb