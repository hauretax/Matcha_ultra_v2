import db from "./db";

const InitializeDb = {

  //TODO: remove age and compute it from birthdate
  userTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        username TEXT UNIQUE,
        lastName TEXT,
        firstName TEXT,
        password TEXT,
        gender TEXT,
        biography TEXT,
        birthDate DATE,
        age INTEGER,
        orientation TEXT,
        emailVerified INTEGER,
        accessCode TEXT,
        resetPasswordCode TEXT,
		    token TEXT, 
        latitude DECIMAL(9, 6),
        longitude DECIMAL(9, 6),
        ip TEXT,
        customLocation BIT DEFAULT 0
      )`;
		return db.run(sql);
	},

	chatsTable() {
		const sql = `
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userIdFrom INTEGER,
            userIdTo INTEGER,
            msg TEXT,
            sendDate DATE,
        )`;
		return db.run(sql);
	},

	pictureTable() {
		const sql = `
        CREATE TABLE IF NOT EXISTS pictures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            src TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`;
		return db.run(sql);
	},

	interestsTable() {
		const sql = `
            CREATE TABLE IF NOT EXISTS interests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                interest TEXT UNIQUE
            )`;
		return db.run(sql);
	},

	userInterestsTable() {
		const sql = `
            CREATE TABLE IF NOT EXISTS user_interests (
                user_id INTEGER,
                interest_id INTEGER,
                PRIMARY KEY (user_id, interest_id),
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(interest_id) REFERENCES interests(id)
            )`;
		return db.run(sql);
	},

	userNoteTable() {
		const sql = `
        CREATE TABLE IF NOT EXISTS user_notes (
            from_id INTEGER,
            to_id INTEGER,
            note INTEGER,
            UNIQUE (from_id, to_id)
        )
        `;
		return db.run(sql);
	}

};


export default InitializeDb;