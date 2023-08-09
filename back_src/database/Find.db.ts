import db from "./db";
import { FullUser, userInDb } from "../../comon_src/type/user.type";
import { OrderBy, findTenUsersParams } from "../../comon_src/type/utils.type";
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
		user.customLocation = Boolean(user.customLocation);
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
				user.interests = interests;
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
	async tenUsers(params: findTenUsersParams): Promise<userInDb[]> {

		const interestConditions = generateInterestConditions(params.interestWanted);
		const orderByClause = generateOrderByClause(params.orderBy);

		const completTab = [
			...params.interestWanted,
			params.latitude, params.longitude, params.latitude,
			params.userId,
			params.distanceMax,
			params.ageMax,
			params.ageMin,
			...params.orientation,
			...params.interestWanted.map(interest => `%${interest}%`),
			params.userId,
			params.index
		];

		//TODO: prevent homosexual men to be queried by heterosexual women
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
			(
				SELECT COUNT(*) FROM user_interests ui
				WHERE ui.user_id = u.id AND ui.interest_id IN (SELECT id FROM interests WHERE interest IN (${params.interestWanted.map(() => "?").join(",")}))
			) AS interestCount,
			interests,
			picture_ids,
			image_srcs,
			un.note AS user_note
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
					GROUP_CONCAT(id, ',') AS picture_ids,
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
							cos(radians( ? )) * cos(radians(latitude)) * cos(radians(longitude) - radians( ? )) + sin(radians( ? )) * sin(radians(latitude))
						)
					) AS distance
				FROM
					users
			) AS d ON u.id = d.id
			LEFT JOIN user_notes AS un ON un.from_id = ? AND un.to_id = u.id
		WHERE
			d.distance < ?
			AND u.age <= ?
			AND u.age >= ?
			AND u.gender IN (${params.orientation.map(() => "?").join(",")})
			AND ${interestConditions}
			AND u.id <> ?
		ORDER BY
			${orderByClause}
		LIMIT
			10
		OFFSET
			?;
		`;
		const users = await db.all(sql, completTab);
		return users;
	},

	async isLikedBy(likerId: number, likeeId: number): Promise<boolean> {
		const sql = "SELECT COUNT(*) AS count FROM user_likes WHERE liker_id = ? AND likee_id = ?";
		const result = await db.get(sql, [likerId, likeeId]);
		return result.count > 0;
	},
};

function generateInterestConditions(interestWanted: string[]): string {
	return interestWanted.map(() => "interests LIKE ?").join(" OR ");
}

function generateOrderByClause(orderBy: OrderBy): string {
	switch (orderBy) {
	case "distance":
		return "d.distance ASC";
	case "age":
		return "u.age ASC";
	case "popularity":
		return "u.popularity DESC";
	case "tag":
		return "interestCount DESC";
	default:
		throw new Error("Invalid order by");
	}
}

export default FindDb;