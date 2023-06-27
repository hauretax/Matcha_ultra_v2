import db from "./db";
import { UniqueConstraintError, DatabaseError } from "./errors";
import { FullUser, UserReqRegister } from "../../comon_src/type/user.type";
import { generateRandomString } from "../utils/random";

interface InsertedUser {
	id: number,
	email: string,
	accessCode: string
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
        biography TEXT,
        age INTEGER,
        orientation TEXT,
        emailVerified INTEGER,
        accessCode TEXT,
		    token TEXT
      )`;
		return db.run(sql);
	},

	initializePictureTable() {
		const sql = `
        CREATE TABLE IF NOT EXISTS pictures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            picture_path TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`;
		return db.run(sql);
	},

	initializeInterestsTable() {
		const sql = `
            CREATE TABLE IF NOT EXISTS interests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                interest TEXT UNIQUE
            )`;
		return db.run(sql);
	},

	initializeUserInterestsTable() {
		const sql = `
            CREATE TABLE IF NOT EXISTS user_interests (
                user_id INTEGER,
                interest_id INTEGER,
                PRIMARY KEY (user_id, interest_id),
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(interest_id) REFERENCES interests(id)
            )`;
		return db.run(sql);
	},

	async findPicturesByUserId(userId: number): Promise<string[]> {
		const sql = "SELECT picture_path FROM pictures WHERE user_id = ?";
		const res: ({ picture_path: string }[]) = await db.all(sql, [userId]);
		const ret: string[] = res.map((pictureObj: { picture_path: string }) => pictureObj.picture_path);
		return ret;
	},

	async findInterestsByUserId(userId: number): Promise<string[]> {
		const sql = `
			SELECT interests.interest 
			FROM interests
			INNER JOIN user_interests ON interests.id = user_interests.interest_id
			WHERE user_interests.user_id = ?`;
		const res: ({ interest: string }[]) = await db.all(sql, [userId]);
		const ret: string[] = res.map((interestObj: { interest: string }) => interestObj.interest);
		return ret;
	},

	async findUser(username: string): Promise<FullUser> {
		const sql = "SELECT * FROM users WHERE username = ?";
		const user = await db.get(sql, [username]);
		if (user) {
			return Promise.all([
				this.findPicturesByUserId(user.id),
				this.findInterestsByUserId(user.id)
			]).then(([pictures, interests]) => {
				user.pictures = pictures;
				user.interests = interests;
				return user;
			});
		} else {
			return null;
		}
	},

	async findUserById(id: number): Promise<FullUser> {
		const sql = "SELECT * FROM users WHERE id = ?";
		const user = await db.get(sql, [id]);
		if (user) {
			return Promise.all([
				this.findPicturesByUserId(user.id),
				this.findInterestsByUserId(user.id)
			]).then(([pictures, interests]) => {
				user.pictures = pictures;
				user.interests = interests.map(interestObj => interestObj.interest);
				return user;
			});
		} else {
			return null;
		}
	},

	async insertUser(user: UserReqRegister): Promise<InsertedUser> {
		const accessCode = generateRandomString(16);
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

	updateProfile(firstName: string, lastName: string, age: number, gender: string, orientation: string, email: string, emailVerified: number, userId: number) {
		const sql = `
			UPDATE users 
			SET firstName=?, lastName=?, age=?, gender=?, orientation=?, email=?, emailVerified=?
			WHERE id=?`;
		const params = [firstName, lastName, age, gender, orientation, email, emailVerified, userId]
		return db.run(sql, params);
	},

	updateBio(biography: string, userId: number) {
		const sql = `
			UPDATE users 
			SET biography=?
			WHERE id=?`;
		const params = [biography, userId]
		return db.run(sql, params);
	},

	async findOrCreateInterest(interest: string): Promise<number> {
		const findSql = "SELECT id FROM interests WHERE interest = ?";
		const interestObj = await db.get(findSql, [interest]);
		if (interestObj) {
			return interestObj.id;
		} else {
			const insertSql = "INSERT INTO interests(interest) VALUES(?)";
			return db.run(insertSql, [interest])
				.then((result) => result.lastID);
		}
	},

	async updateUserInterests(userId: number, interests: string[]): Promise<void> {
		// First, remove all current interests of this user
		const deleteSql = "DELETE FROM user_interests WHERE user_id = ?";
		await db.run(deleteSql, [userId]);
		// Then, add each new interest to the database (if it's not there already)
		// and link it to the user
		const addInterestPromises = interests.map((interest) => this.findOrCreateInterest(interest)
			.then((interestId) => {
				const insertSql = "INSERT INTO user_interests(user_id, interest_id) VALUES(?, ?)";
				return db.run(insertSql, [userId, interestId]);
			})
		);
		await Promise.all(addInterestPromises);
	},

	async getAllInterests(): Promise<string[]> {
		const sql = "SELECT interest FROM interests";
		const res = await db.all(sql);
		const ret = res.map((interestObj: { interest: string }) => interestObj.interest)
		return ret
	},

	deleteUser(userId: number) {
		const sql = "DELETE FROM users WHERE id = ?";
		return db.run(sql, [userId]);
	},

	getUserbyMail(email: string) {
		const sql = `
		 SELECT * 
		 FROM users
		 WHERE email = ?
		`;
		return db.get(sql, [email])
	},

	getCode(email: string) {
		const sql = "SELECT accessCode FROM users WHERE email = ?";
		return db.get(sql, [email]);
	},

	changePassword(password: string, email: string) {
		const sql = `
		UPDATE users 
		SET password = ?
			WHERE email = ?
    	`;
		return db.get(sql, [password,email]);
	},
	valideUser(email: string) {
		const sql = `
		UPDATE users 
		SET emailVerified = 1
			WHERE email = ?
    	`;
		return db.get(sql, [email]);
	}
};

export default UserDb;
