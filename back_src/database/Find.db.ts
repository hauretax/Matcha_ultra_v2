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
		const ageMax = 55;
		const orientation = ["Male", "Female"];
		const interestWanted = ["video-game"];


		const interestConditions = interestWanted.map(() => "interests LIKE ?").join(" OR ");


		const completTab = [
			//line 2
			latitude, longitude, latitude,
			// line 7 
			distanceMax,
			//line 8
			ageMax,
			//line 9 
			ageMin,
			//line 10 
			...orientation
			//line 12

		];

		// TODO find url picture in request
		// TODO make a big tab with all params actually in ${blabla} toa void sql insertion
		// TODO link all to request get
		// TODO protect route
		// TODO make a nice design for it on client .
		// TODO test who many request we can make befor it crash


		const sql = `
		SELECT
			u.id,
			u.username,
			u.biography,
			u.gender,
			u.birthDate,
			u.orientation,
			u.latitude,
			u.longitude,
			u.age,
			d.distance,
			interests,
			image_srcs
		FROM
			users AS u
			LEFT JOIN (
				SELECT
					user_id,
					GROUP_CONCAT(interest, ',') AS interests
				FROM
					user_interests
					JOIN interests ON user_interests.interest_id = interests.id
				GROUP BY
					user_id
			) AS u_i ON u.id = u_i.user_id
			LEFT JOIN (
				SELECT
					user_id,
					GROUP_CONCAT(src, ',') AS image_srcs
				FROM
					pictures
				GROUP BY
					user_id
			) AS p ON u.id = p.user_id
			INNER JOIN (
				SELECT
					id,
					(
						6371 * acos(
							cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude))
						)
					) AS distance
				FROM
					users
			) AS d ON u.id = d.id
		WHERE
			d.distance < ${distanceMax}
			AND u.age <= ${ageMax}
			AND u.age >= ${ageMin}
			AND u.gender IN (${orientation.map(() => "?").join(",")})
			AND ${interestConditions}
		ORDER BY
			d.distance ASC
		LIMIT
			10
		OFFSET
			0;
		`;
		console.log(sql)
		const users = await db.all(sql, [...orientation, ...interestWanted.map(interest => `%${interest}%`)]);
		const publicUsers = users.reduce((result: UserPublic[], user: any) => {
			 console.log('user', user.interests);
			
			const newUser: UserPublic = {
				distance: Math.floor(user.distance) ? Math.floor(user.distance) : 1,
				pictures: user.image_srcs ? user.image_srcs.split(",") : [],
				interests: user.interests ? user.interests.split(",") : [],
				username: user.username,
				gender: user.gender,
				orientation: user.orientation,
				age: user.age,
				biography: user.biography,
			};
			result.push(newUser);
			return result;
		}, []);
		console.log(publicUsers);
		return publicUsers;
	},
};

export default FindDb;