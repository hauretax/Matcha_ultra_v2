import { Profile } from "../../comon_src/type/utils.type";
import db from "./db";

const GetDb = {
	userbyMail(email: string) {
		const sql = `
		 SELECT * 
		 FROM users
		 WHERE email = ?
		`;
		return db.get(sql, [email]);
	},

	code(email: string) {
		const sql = "SELECT accessCode FROM users WHERE email = ?";
		return db.get(sql, [email]);
	},

	async allInterests(): Promise<string[]> {
		const sql = "SELECT interest FROM interests";
		const res = await db.all(sql);
		const ret = res.map((interestObj: { interest: string }) => interestObj.interest);
		return ret;
	},

	async userRelation(toId:number, fromId:number): Promise<{fromId:number, toId:number}[]>{
		const sql = "SELECT * FROM user_likes WHERE fromId = ? AND toId = ? OR fromId = ? AND toId = ?";
		return db.all(sql, [fromId, toId, toId, fromId]);	
	},
		
	async userLocalisation(id: number): Promise<{ latitude: number, longitude: number }> {
		const sql = `SELECT latitude, longitude 
		FROM "users"
		WHERE id = ?`;
		return db.get(sql, [id]);
	},

	async jwtToken(userId: number): Promise<{ token: string }> {
		const sql = `
			SELECT token 
			FROM users
			WHERE id = ?
    	`;
		return db.get(sql, [userId]);
	},

	async allConversation(userId: number): Promise<Profile[]> {
		const sql = `
		SELECT
		u.username,
		u.id,
		c.msg AS lastMessage,
		c.sendDate AS messageDate,
		p.src AS profilePicture
	FROM users u
	LEFT JOIN (
		SELECT
			MAX(id) AS maxId,
			userIdFrom,
			userIdTo
		FROM chats
	) latest_chats ON (u.id = latest_chats.userIdFrom OR u.id = latest_chats.userIdTo)
	LEFT JOIN chats c ON (c.id = latest_chats.maxId)
	LEFT JOIN (
		SELECT
			user_id,
			MIN(id) AS minId
		FROM pictures
		GROUP BY user_id
	) first_pictures ON u.id = first_pictures.user_id
	LEFT JOIN pictures p ON p.id = first_pictures.minId
	WHERE 
	NOT EXISTS (
    SELECT 1
    FROM user_blocks ub
    WHERE (ub.toId = u.id AND ub.fromId = ?) 
       OR (ub.fromId = u.id AND ub.toId = ?)
)
	 AND EXISTS (
		SELECT 1
		FROM user_likes  n1
        JOIN user_likes n2 ON n1.toId = n2.fromId AND n2.toId = n1.fromId
        WHERE n1.fromId = ? AND n1.toId = u.id
		);

		`;
		return db.all(sql, [userId, userId, userId]);
	},

	async chat(idFrom: number, idTo: number): Promise<Profile[]> {
		const sql = `
		SELECT *
		FROM chats
		WHERE userIdFrom = ? AND userIdTo = ? OR userIdFrom = ? AND userIdTo = ?
		ORDER BY sendDate
		`;
		return db.all(sql, [idFrom, idTo, idTo, idFrom]);
	},

	async getUserPreferences(userId: number): Promise<{user_id: number; name: string}[]> {
		const sql = `
			SELECT user_id, name
			FROM user_preferences
			WHERE user_id = ?
		`;
		return db.all(sql, [userId]);
	},

	async checkUserLikesSymmetry(idFrom: number, idTo: number) {
		const query = `
			SELECT
			CASE
				WHEN EXISTS (
					SELECT 1
					FROM user_likes
					WHERE (fromId = ? AND toId = ?)
				) AND EXISTS (
					SELECT 1
					FROM user_likes
					WHERE (fromId = ? AND toId = ?)
				) THEN 1
				ELSE 0
			END AS result;
		`;
		return db.get(query, [idFrom, idTo, idTo, idFrom]);
	},

	notification(id: number) {
		const query = `
		SELECT n.id, n.fromId, n.toId, n.type, n.seen as read, n.date, u.username as fromUsername, p.first_src as profilePicture
		FROM notifications n
		LEFT JOIN users u ON n.fromId = u.id
		LEFT JOIN (
			SELECT 
				user_id, 
				MIN(id) as min_id, -- This gets the ID of the first picture of each user
				src as first_src
			FROM pictures
			GROUP BY user_id
		) p ON u.id = p.user_id
		WHERE toId = ?
		ORDER BY n.date DESC
		`;
		return db.all(query, [id]);
	},

	isbloqued(idFrom:number, idTo:number){
		const query = `		
		SELECT
		CASE
			WHEN EXISTS (
				SELECT 1
					FROM user_blocks
					WHERE (toId = ? AND fromId = ?) 
					OR (toId = ? AND fromId  = ?)
				) THEN 1
			ELSE 0
		END AS result;`;
		return db.get(query, [idFrom, idTo, idTo, idFrom]);
	}

};

export default GetDb;