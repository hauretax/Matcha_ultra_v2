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

    addUsers({ email,firstName,lastName,password,userName}:CreateProfileModel) { 

        this.db.run(`INSERT INTO items (email) (firstName)
            (lastName)(password)(userName)
         VALUES(?)`, [email, firstName, lastName, password, userName], function(err) {
            if (err) {
              console.error(err);
              return;
            }
          
            console.log(`Inserted item with ID: ${this.lastID}`);
          });
    }
}