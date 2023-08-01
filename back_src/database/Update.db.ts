import db from "./db";

const UpdateDb = {
	// TODO #2
	valideUser(email: string) {
		const sql = `
      UPDATE users 
      SET emailVerified = 1
			WHERE email = ?`;
		return db.get(sql, [email]);
	},

	changePassword(password: string, email: string) {
		const sql = `
		UPDATE users 
		SET password = ?
			WHERE email = ?
    	`;
		return db.get(sql, [password, email]);
	},

	noteUserTo(userFrom: string, userTo: string, note: number) {
		const sql = `
			INSERT OR REPLACE INTO user_notes (from_id, to_id, note)
			VALUES (?, ?, ?);
		`;
		return db.get(sql, [userFrom, userTo,note]);
	},

  update(table: string, columns: string[], values: any[], whereColumns: string[], whereValues: any[]) {
    let sql = `UPDATE ${table} SET `;
    for (let i = 0; i < columns.length; i++) {
      sql += `${columns[i]} = ?`;
      if (i < columns.length - 1) {
        sql += ', ';
      }
    }
    sql += ' WHERE ';
    for (let i = 0; i < whereColumns.length; i++) {
      sql += `${whereColumns[i]} = ?`;
      if (i < whereColumns.length - 1) {
        sql += ' AND ';
      }
    }
    return db.run(sql, [...values, ...whereValues]);
  }

};

export default UpdateDb;