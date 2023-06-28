import db from "./db";
import { UniqueConstraintError, DatabaseError } from "./errors";
import { FullUser, UserReqRegister } from "../../comon_src/type/user.type";

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
        birthDate TEXT,
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
            src TEXT,
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

	async findPicturesByUserId(userId: number): Promise<{ id: number; src: string }[]> {
		const sql = "SELECT id, src FROM pictures WHERE user_id = ?";
		const res: ({ id: number; src: string }[]) = await db.all(sql, [userId]);
		return res;
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

	async findUser(username: string): Promise<FullUser | null> {
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

	async insertUser(user: UserReqRegister): Promise<number> {
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

	updateProfile(profile: {firstName: string, lastName: string, birthDate: string, gender: string, orientation: string, email: string, emailVerified: number}, userId: number) {
		const sql = `
			UPDATE users 
			SET firstName=?, lastName=?, birthDate=?, gender=?, orientation=?, email=?, emailVerified=?
			WHERE id=?`;
		const params = [profile.firstName, profile.lastName, profile.birthDate, profile.gender, profile.orientation, profile.email, profile.emailVerified, userId];
		return db.run(sql, params);
	},

	updateBio(biography: string, userId: number) {
		const sql = `
			UPDATE users 
			SET biography=?
			WHERE id=?`;
		const params = [biography, userId];
		return db.run(sql, params);
	},

	getUserbyMail(email: string) {
		const sql = `
		 SELECT * 
		 FROM users
		 WHERE email = ?
		`;
		return db.get(sql, [email]);
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
		const ret = res.map((interestObj: { interest: string }) => interestObj.interest);
		return ret;
	},

	deleteUser(userId: number) {
		const sql = "DELETE FROM users WHERE id = ?";
		return db.run(sql, [userId]);
	},

	valideUser(email: string) {
		const sql = `
      UPDATE users 
      SET emailVerified = 1
			WHERE email = ?`;
		return db.get(sql, [email]);
	},

	async findPictureByIdAndDelete(pictureId: number) {
		const selectSql = "SELECT * FROM pictures WHERE id = ?";
		const picture = await db.get(selectSql, [pictureId]);

		const deleteSql = "DELETE FROM pictures WHERE id = ?";
		const res = await db.run(deleteSql, [pictureId]);

		return res.changes === 1 ? picture : null;
	},

	async insertPicture(userId: number, src: string) {
		const sql = "INSERT INTO pictures(user_id, src) VALUES(?, ?)";
		const result = await db.run(sql, [userId, src]);
		return result.lastID;
	},

	// TODO: Harmonize what's returned by functions in this file
	async updatePicture(userId: number, src: string) {
		const sql = `
      UPDATE pictures
      SET src = ?
      WHERE user_id = ?`;
		return db.run(sql, [src, userId]);
	},
};

export default UserDb;
