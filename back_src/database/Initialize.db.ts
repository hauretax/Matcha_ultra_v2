import db from "./db";

const InitializeDb = {

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
        customLocation BIT DEFAULT 0,
				views INTEGER DEFAULT 0,
				likes INTEGER DEFAULT 0
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
            UNIQUE(userIdFrom, userIdTo),
            FOREIGN KEY(userIdFrom) REFERENCES users(id),
            FOREIGN KEY(userIdTo) REFERENCES users(id)
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

	userLikesTable() {
		const sql = `
			CREATE TABLE IF NOT EXISTS user_likes (
				fromId INTEGER,
				toId INTEGER,
				PRIMARY KEY (fromId, toId),
				FOREIGN KEY(fromId) REFERENCES users(id),
				FOREIGN KEY(toId) REFERENCES users(id)
			)`;
		return db.run(sql);
	},

	async notification() {
		const sql = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fromId INT,
        toId INT,
        type TEXT,
        seen BIT DEFAULT 0,
        date DATE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (toId) REFERENCES users(user_id),
        FOREIGN KEY (fromId) REFERENCES users(user_id)
      )`;
		await db.run(sql);

		const indexSql = `
			CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_notifications 
			ON notifications(fromId, toId, type) 
			WHERE type = 'visit';
			`;
		return db.run(indexSql);
	}

};


export default InitializeDb;