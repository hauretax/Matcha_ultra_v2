import db from "./db";
import { FullUser, userInDb1, userInDb2 } from "../../comon_src/type/user.type";
import { OrderBy, findTenUsersParams } from "../../comon_src/type/utils.type";
import GetDb from "./Get.db";
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
				user.customLocation = Boolean(user.customLocation);
				return user;
			});
		} else {
			return null;
		}
	},

	async userById(id: number): Promise<userInDb1> {
		const sql = "SELECT * FROM users WHERE id = ?";
		const user = await db.get(sql, [id]);
		if (user) {
			return Promise.all([
				this.picturesByUserId(user.id),
				this.interestsByUserId(user.id),
				GetDb.getUserPreferences(user.id)
			]).then(([pictures, interests, preferences]) => {
				user.pictures = pictures;
				user.interests = interests;
				user.preferences = preferences.map(preference => preference.name);
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
	async tenUsers(params: findTenUsersParams): Promise<userInDb2[]> {


		const interestConditions = generateInterestConditions(params.interestWanted);
		const orderByClause = generateOrderByClause(params.orderBy, params.interest.length);

		const completTab = [
			...params.interest,
			params.latitude, params.longitude, params.latitude,
			params.userId,
			params.distanceMax,
			params.ageMax,
			params.ageMin,
			...params.preferences,
			...params.interestWanted.map(interest => `%${interest}%`),
			params.userId,
			params.gender,
			params.fameMin, params.fameMin, params.fameMax,
			params.index
		];

		const sql = `
		SELECT
			u.id,
			u.username,
			u.biography,
			u.gender,
			u.birthDate,
			u.latitude,
			u.longitude,
			u.age,
			u.views,
			u.likes,
			d.distance,
			(
				SELECT COUNT(*) FROM user_interests ui
				WHERE ui.user_id = u.id AND ui.interest_id IN (SELECT id FROM interests WHERE interest IN (${params.interest.map(() => "?").join(",")}))
			) AS interestCount,
			interests,
			picture_ids,
			image_srcs,
			(1 - d.distance / 500) AS distance_value,
			CASE WHEN u.views = 0 THEN 0 ELSE (u.likes * 1.0) / u.views END AS fame_rating_value
		FROM
			users AS u
			INNER JOIN user_preferences AS u_p ON u.id = u_p.user_id
			LEFT JOIN user_blocks AS ub ON u.id = ub.toId
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
		WHERE
			(ub.fromId IS NULL OR ub.fromId <> ?)
			AND d.distance < ?
			AND u.age <= ?
			AND u.age >= ?
			AND u.gender IN (${params.preferences.map(() => "?").join(",")})
			AND ${interestConditions}
			AND u.id <> ?
			AND u_p.name = ?
			AND (? = 0 OR (u.views > 0 AND u.likes / u.views >= ? AND u.likes / u.views <= ?))
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
		const sql = "SELECT COUNT(*) AS count FROM user_likes WHERE fromId = ? AND toId = ?";
		const result = await db.get(sql, [likerId, likeeId]);
		return result.count > 0;
	},

	isBlockedBy(fromId: number, toId: number) {
		const sql = "SELECT COUNT(*) AS count FROM user_blocks WHERE fromId = ? AND toId = ?";
		return db.get(sql, [fromId, toId]);
	},


	async hasBeenVisitedBy(visitorId: number, visiteeId: number): Promise<boolean> {
		const sql = "SELECT COUNT(*) AS count FROM notifications WHERE fromId = ? AND toId = ? AND type = 'visit'";
		const result = await db.get(sql, [visitorId, visiteeId]);
		return result.count > 0;
	},

	async getProfileLikes(userId: number) {
		const sql = `
			SELECT
				users.id,
				users.username,
				users.birthdate,
				users.firstname,
				users.lastname,
				picture_ids,
				picture_srcs,
				interest_list,
				users.longitude,
				users.latitude
			FROM users 
			JOIN user_likes ON users.id = user_likes.fromId
			LEFT JOIN (
				SELECT
					user_id,
					GROUP_CONCAT(id, ',') AS picture_ids,
					GROUP_CONCAT(src, ',') AS picture_srcs
				FROM
					pictures
				GROUP BY
					user_id
			) AS p ON users.id = p.user_id
			LEFT JOIN (
				SELECT
					user_id,
					GROUP_CONCAT(interest, ',') AS interest_list
				FROM
					user_interests
					JOIN interests ON user_interests.interest_id = interests.id
				GROUP BY
					user_id
			) AS u_i ON users.id = u_i.user_id
			WHERE user_likes.toId = ?
		`;
		return db.all(sql, [userId]);
	},

	async getProfileVisits(userId: number) {
		const sql = `
			SELECT
				users.id,
				users.username,
				users.birthdate,
				users.firstname,
				users.lastname,
				picture_ids,
				picture_srcs,
				interest_list,
				users.longitude,
				users.latitude
			FROM users 
			JOIN notifications ON users.id = notifications.fromId
			LEFT JOIN (
				SELECT
					user_id,
					GROUP_CONCAT(id, ',') AS picture_ids,
					GROUP_CONCAT(src, ',') AS picture_srcs
				FROM
					pictures
				GROUP BY
					user_id
			) AS p ON users.id = p.user_id
			LEFT JOIN (
				SELECT
					user_id,
					GROUP_CONCAT(interest, ',') AS interest_list
				FROM
					user_interests
					JOIN interests ON user_interests.interest_id = interests.id
				GROUP BY
					user_id
			) AS u_i ON users.id = u_i.user_id
			WHERE notifications.toId = ? AND notifications.type = 'visit'
		`;
		return db.all(sql, [userId]);
	},

};

function generateInterestConditions(interestWanted: string[]): string {
	return interestWanted.map(() => "interests LIKE ?").join(" AND ");
}

function generateOrderByClause(orderBy: OrderBy, interestCount: number): string {
	switch (orderBy) {
	case "distance":
		return "(distance_value * 1000 +  (interestCount / " + interestCount + ") + fame_rating_value) DESC";
	case "age":
		return "(distance_value + (interestCount / " + interestCount + ") + fame_rating_value + 100 - u.age * 10) DESC";
	case "popularity":
		return "(distance_value +  (interestCount / " + interestCount + ") + fame_rating_value * 10) DESC";
	case "tag":
		return "interestCount DESC";
	default:
		throw new Error("Invalid order by");
	}
}

export default FindDb;