import db from "./db";

const PictureDb = {
    initializePictureTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS pictures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            picture_path TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`;
        return db.run(sql);
    },
};

export default PictureDb;
