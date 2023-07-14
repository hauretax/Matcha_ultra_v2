import db from "./db";

const UpdateDb = {
	//TODO #5 
	profile(profile: { firstName: string, lastName: string, birthDate: string, gender: string, orientation: string, email: string, emailVerified: number }, userId: number) {
		const sql = `
			UPDATE users 
			SET firstName=?, lastName=?, birthDate=?, gender=?, orientation=?, email=?, emailVerified=?,
			age=STRFTIME('%Y', 'now') - STRFTIME('%Y', ?) - (STRFTIME('%m-%d', 'now') < STRFTIME('%m-%d', ?))
			WHERE id=?`;
		const params = [profile.firstName, profile.lastName, profile.birthDate, profile.gender, profile.orientation, profile.email, profile.emailVerified, profile.birthDate, profile.birthDate, userId];
		return db.run(sql, params);
	},

	setUserlocalisation(latitude: string, longitude: string, userId: number) {
		const sql = `
			UPDATE users 
			SET latitude=?, longitude=?
			WHERE id=?`;
		const params = [latitude, longitude, userId];
		return db.run(sql, params);
	},

	bio(biography: string, userId: number) {
		const sql = `
			UPDATE users 
			SET biography=?
			WHERE id=?`;
		const params = [biography, userId];
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
		return db.get(sql, [userFrom, userTo, note]);
	}

};

export default UpdateDb;