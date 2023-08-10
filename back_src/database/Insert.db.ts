import { UserReqRegister } from "../../comon_src/type/user.type";
import FindDb from "./Find.db";
import db from "./db";
import { DatabaseError, UniqueConstraintError } from "./errors";

const InsertDb = {

	async user(user: UserReqRegister): Promise<number> {
		const accessCode = Math.floor(Math.random() * 90000 + 10000);
		const query = `
      INSERT INTO users (
        email,
        username,
        lastName,
        firstName,
        password,
        accessCode,
        emailVerified
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
		const params = [
			user.email,
			user.username,
			user.lastName,
			user.firstName,
			user.password,
			accessCode,
			0
		];

		try {
			await db.run(query, params);
			return accessCode;
		} catch (err) {
			if (err.message.includes("UNIQUE constraint failed")) {
				throw new UniqueConstraintError(err.message);
			} else {
				throw new DatabaseError("A database error occurred");
			}
		}
	},


	async userInterests(userId: number, interests: string[]): Promise<void> {
		// First, remove all current interests of this user
		const deleteSql = "DELETE FROM user_interests WHERE user_id = ?";
		await db.run(deleteSql, [userId]);
		// Then, add each new interest to the database (if it's not there already)
		// and link it to the user
		const addInterestPromises = interests.map((interest) => FindDb.orCreateInterest(interest)
			.then((interestId) => {
				const insertSql = "INSERT INTO user_interests(user_id, interest_id) VALUES(?, ?)";
				return db.run(insertSql, [userId, interestId]);
			})
		);
		await Promise.all(addInterestPromises);
	},

	async message(message: string, idFrom: number, idTo: number) {
		const sql = "INSERT INTO chats(userIdFrom, userIdTo, msg, sendDate) VALUES(?, ?, ?, datetime('now'))";
		const result = await db.run(sql, [idFrom, idTo, message]);
		return result.lastID;
	},

	async picture(userId: number, src: string) {
		const sql = "INSERT INTO pictures(user_id, src) VALUES(?, ?)";
		const result = await db.run(sql, [userId, src]);
		return result.lastID;
	},

	async jwtToken(token: string, userId: number): Promise<void> {
		const sql = `
		UPDATE users 
		SET token = ?
			WHERE id = ?
    	`;
		await db.run(sql, [token, userId]);
	},

	async like(likerId: number, likeeId: number): Promise<void> {
		const sql = `
      INSERT INTO user_likes(fromId, toId)
      VALUES (?, ?)
    `;
		await db.run(sql, [likerId, likeeId]);
	},

	async notification(fromId: number, toId: number, type: string): Promise<void> {
		const sql = `
      INSERT INTO notifications(fromId, toId, type)
      VALUES (?, ?, ?)
    `;
		await db.run(sql, [fromId, toId, type]);
		return await db.get("SELECT * FROM notifications WHERE id = last_insert_rowid()");
	}

};

export default InsertDb;