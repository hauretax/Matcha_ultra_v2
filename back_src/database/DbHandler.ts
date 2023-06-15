import { Database } from 'sqlite3';

export default class Dbhandler {
    db: Database

    constructor() {
        this.db = new Database('ma-base-de-donnees.db');
    }

    creatTables()  { 
        this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        userName TEXT UNIQUE,
        lastName TEXT,
        firstName TEXT,
        password TEXT,
        gender TEXT,
        age INTEGER,
        sexualPreferences TEXT,
        verified INTEGER,
        accessCode INTEGER
        )
        `)
    }
  
}