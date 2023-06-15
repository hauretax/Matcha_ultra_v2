import { Database } from 'sqlite3';
import { CreateProfileModel } from '../models/profileModel';
import { FullUser } from '../../comon_src/type/user.type';


interface test { 
  id: number,
  email: string,
  accessCode: number
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
        accessCode INTEGER
        )
        `)
    }
  
//TODO moov this in correct file (find #1)
  async insertUser(user: CreateProfileModel): Promise<test> {
      //peu etre plus de sens de le mettre dans profileCtrl ?
      const accessCode = Math.floor(Math.random() * 90000 + 10000)
      const query = `
          INSERT INTO users (email, userName, lastName, firstName, password, accessCode, verified)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [user.email, user.userName, user.lastName, user.firstName, user.password, accessCode, 0];
    //TODO rename test
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
                resolve({id:this.lastID, accessCode, email:user.email});
              }
            });
          });
      }

    deletUser(id) {
        this.db.run('DELETE FROM users WHERE id = ?', [id]);
    }
}