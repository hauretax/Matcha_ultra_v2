import db from "./db";

const DeletDb = {

	user(userId: number) {
		const sql = "DELETE FROM users WHERE id = ?";
		return db.run(sql, [userId]);
	},

	async PictureById(pictureId: number) {
		const selectSql = "SELECT * FROM pictures WHERE id = ?";
		const picture = await db.get(selectSql, [pictureId]);

		const deleteSql = "DELETE FROM pictures WHERE id = ?";
		const res = await db.run(deleteSql, [pictureId]);

		return res.changes === 1 ? picture : null;
	},

	async dislike(likerId: number, likeeId: number): Promise<void> {
		const sql = `
      DELETE FROM user_likes
      WHERE liker_id = ? AND likee_id = ?;
    `;
		await db.run(sql, [likerId, likeeId]);
	},
};

export default DeletDb;