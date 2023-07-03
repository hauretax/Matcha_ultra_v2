import db from "./db";
import { FullUser, UserProfile } from "../../comon_src/type/user.type";
const FindDb = {

	async picturesByUserId(userId: number): Promise<{ id: number; src: string }[]> {
		const sql = "SELECT id, src FROM pictures WHERE user_id = ?";
		const res: ({ id: number; src: string }[]) = await db.all(sql, [userId]);
		return res;
	},

	async interestsByUserId(userId: number): Promise<string[]> {
		const sql = `
			SELECT interests.interest 
			FROM interests
			INNER JOIN user_interests ON interests.id = user_interests.interest_id
			WHERE user_interests.user_id = ?`;

		const res: ({ interest: string }[]) = await db.all(sql, [userId]);
		const ret: string[] = res.map((interestObj: { interest: string }) => interestObj.interest);
		return ret;
	},

	async user(username: string): Promise<FullUser | null> {
		const sql = "SELECT * FROM users WHERE username = ?";
		const user = await db.get(sql, [username]);
		if (user) {
			return Promise.all([
				this.picturesByUserId(user.id),
				this.interestsByUserId(user.id)
			]).then(([pictures, interests]) => {
				user.pictures = pictures;
				user.interests = interests;
				return user;
			});
		} else {
			return null;
		}
	},

	async userById(id: number): Promise<FullUser> {
		const sql = "SELECT * FROM users WHERE id = ?";
		const user = await db.get(sql, [id]);
		if (user) {
			return Promise.all([
				this.picturesByUserId(user.id),
				this.interestsByUserId(user.id)
			]).then(([pictures, interests]) => {
				user.pictures = pictures;
				user.interests = interests.map(interestObj => interestObj.interest);
				return user;
			});
		} else {
			return null;
		}
	},

	async orCreateInterest(interest: string): Promise<number> {
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

	async allUsers(): Promise<UserProfile[]> {
		const sql = `
      SELECT id, emailVerified, email, username, lastName, firstName, biography, gender, age, orientation
      FROM users
      `;
		const users = await db.all(sql);
		const fullUSers = await Promise.all(users.map(async (user: UserProfile) => {
			const [pictures, interests] = await Promise.all([
				this.picturesByUserId(user.id),
				this.interestsByUserId(user.id)
			]);
			user.pictures = pictures;
			user.interests = interests;
			return user;
		}));
		return fullUSers;
	},
};

export default FindDb;