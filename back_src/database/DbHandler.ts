import { Database } from 'sqlite3';
import { CreateProfileModel } from '../models/profileModel';


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
        verified INTEGER
        )
        `)
    }

    async insertUser(user: CreateProfileModel): Promise<number> {
        const query = `
          INSERT INTO users (email, userName, lastName, firstName, password)
          VALUES (?, ?, ?, ?, ?)
        `;
    
        const params = [user.email, user.userName, user.lastName, user.firstName, user.password];
    
        return new Promise<number>((resolve, reject) => {
            this.db.run(query, params, function (err) {
              if (err) {
                if (err.message.includes('UNIQUE constraint failed') ) {
                    reject(409);
                  } else {
                    console.error(err);
                    reject(500);
                  }
              } else {
                resolve(this.lastID);
              }
            });
          });
      }


    deletUser(id) {
        this.db.run('DELETE FROM users WHERE id = ?', [id]);
    }
}