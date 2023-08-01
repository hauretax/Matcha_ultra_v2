import db from "./db";

const UpdateDb = {
	//TODO #5 
	profile(profile: { firstName: string, lastName: string, birthDate: string, gender: string, orientation: string, email: string, emailVerified: number, customLocation: number, latitude?: string, longitude?: string}, userId: number) {
		let sql = `
			UPDATE users 
			SET firstName=?, lastName=?, birthDate=?, gender=?, orientation=?, email=?, emailVerified=?,
			age=STRFTIME('%Y', 'now') - STRFTIME('%Y', ?) - (STRFTIME('%m-%d', 'now') < STRFTIME('%m-%d', ?)),
      customLocation=?`;
    let params = [profile.firstName, profile.lastName, profile.birthDate, profile.gender, profile.orientation, profile.email, profile.emailVerified, profile.birthDate, profile.birthDate, profile.customLocation]
    if (!profile.customLocation) {
      sql += '\nWHERE id=?'
      params.push(userId)
    } else {
      sql += ', latitude=?, longitude=?'
      sql += '\nWHERE id=?'
      params.push(profile.latitude, profile.longitude, userId)
    }
		return db.run(sql, params);
	},

	// TODO #2
	picture(userId: number, src: string) {
		const sql = `
      UPDATE pictures
      SET src = ?
      WHERE user_id = ?`;
		return db.run(sql, [src, userId]);
	},

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