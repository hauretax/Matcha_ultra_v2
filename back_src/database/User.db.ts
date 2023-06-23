import db from "./db";
import { UniqueConstraintError, DatabaseError } from "./errors";
import { FullUser, UserReqRegister } from "../../comon_src/type/user.type";

interface InsertedUser {
	id: number,
	email: string,
	accessCode: number
}

const UserDb = {
	initializeUserTable() {
		const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        username TEXT UNIQUE,
        lastName TEXT,
        firstName TEXT,
        password TEXT,
        gender TEXT,
        age INTEGER,
        sexualPreferences TEXT,
        emailVerified INTEGER,
        accessCode INTEGER,
		token TEXT
      )`;
		return db.run(sql);
	},

	findPicturesByUserId(userId: number): Promise<{picture_path: string}[]> {
		const sql = "SELECT picture_path FROM pictures WHERE user_id = ?";
		return db.all(sql, [userId]);
	},
	
	async findUser(username: string): Promise<FullUser> {
		const sql = "SELECT * FROM users WHERE username = ?";
		const user = await db.get(sql, [username]);
		if (user) {
			return this.findPicturesByUserId(user.id)
				.then((pictures: {picture_path: string}[]) => {
					user.pictures = pictures;
					return user;
				});
		}
		else {
			return null;
		}
	},
	
	async findUserById(id: number): Promise<FullUser> {
		const sql = "SELECT * FROM users WHERE id = ?";
		const user = await db.get(sql, [id]);
		if (user) {
			return this.findPicturesByUserId(user.id)
				.then((pictures: {picture_path: string}[]) => {
					user.pictures = pictures;
					return user;
				});
		}
		else {
			return null;
		}
	},

	async insertUser(user: UserReqRegister): Promise<InsertedUser> {
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
        VALUES (?, ?, ?, ?, ?, ?, ?)
      	`;
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
			const result = await db.run(query, params);
			return { id: result.lastID, accessCode, email: user.email };
		} catch (err) {
			if (err.message.includes("UNIQUE constraint failed")) {
				throw new UniqueConstraintError(err.message);
			} else {
				throw new DatabaseError("A database error occurred");
			}
		}
	},

	deleteUser(userId: number) {
		const sql = "DELETE FROM users WHERE id = ?";
		return db.run(sql, [userId]);
	}
};

export default UserDb;
