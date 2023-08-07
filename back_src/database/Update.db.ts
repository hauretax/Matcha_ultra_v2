import db from "./db";

const UpdateDb = {
	// TODO #2

	noteUserTo(userFrom: string, userTo: string, note: number) {
		const sql = `
			INSERT OR REPLACE INTO user_notes (from_id, to_id, note)
			VALUES (?, ?, ?);
		`;
		return db.get(sql, [userFrom, userTo,note]); // get ?
	},

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	update(table: string, columns: string[], values: any[], whereColumns: string[], whereValues: any[]) {
		let sql = `UPDATE ${table} SET `;
		for (let i = 0; i < columns.length; i++) {
			sql += `${columns[i]} = ?`;
			if (i < columns.length - 1) {
				sql += ", ";
			}
		}
		sql += " WHERE ";
		for (let i = 0; i < whereColumns.length; i++) {
			sql += `${whereColumns[i]} = ?`;
			if (i < whereColumns.length - 1) {
				sql += " AND ";
			}
		}
		return db.run(sql, [...values, ...whereValues]);
	}

};

export default UpdateDb;