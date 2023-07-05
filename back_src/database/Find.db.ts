import db from "./db";
import { FullUser, UserProfile, UserPublic } from "../../comon_src/type/user.type";
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

	async tenUsers(): Promise<UserPublic[]> {
		const latitude = 48.8566;
		const longitude = 2.3522;
		const distanceMax = 500;
		const ageMin = 18;
		const ageMax = 35;
		const interest = ["Male"];

		const sql = `
		SELECT id, username, biography, gender, birthDate, orientation, latitude, longitude,age,
		(6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) AS distance
		FROM users
		WHERE distance < ${distanceMax}
		AND age <= ${ageMax}
		AND age >= ${ageMin}
		AND gender IN (${interest.map(() => "?").join(",")})
		ORDER BY distance ASC
		LIMIT 10 OFFSET 0;
		`;
		const users = await db.all(sql, interest);
		console.log('--------------------users----------------------')
		users.map((row) => console.log(row.id, ':', row.age, row.distance, row.gender, row.orientation));
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