import { Database } from 'sqlite3';
import { CreateProfileModel } from '../models/profileModel';


interface test { 
  id: number,
  email: string,
  nbV: number
}

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
        nbVerified INTEGER
        )
        `)
    }

  async insertUser(user: CreateProfileModel): Promise<test> {
      //peu etre plus de sens de le mettre dans profileCtrl ?
      const nbV = Math.floor(Math.random() * 90000 + 10000)
      const query = `
          INSERT INTO users (email, userName, lastName, firstName, password, nbVerified, verified)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [user.email, user.userName, user.lastName, user.firstName, user.password, nbV, 0];
    
        return new Promise<test>((resolve, reject) => {
            this.db.run(query, params, function (err) {
              if (err) {
                if (err.message.includes('UNIQUE constraint failed') ) {
                  reject(409);
                  return 
                  } else {
                    console.error(err);
                  reject(500);
                  return 

                  }
              } else {
                resolve({id:this.lastID, nbV, email:user.email});
              }
            });
          });
      }

    
  

    deletUser(id) {
        this.db.run('DELETE FROM users WHERE id = ?', [id]);
    }
}