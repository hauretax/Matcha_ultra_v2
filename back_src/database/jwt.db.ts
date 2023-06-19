import Dbhandler from "./DbHandler";

const db = new Dbhandler;

export async function insertToken(token: string, date: Date) {
    const query = `
        INSERT INTO rjwt (token,endDate, isValide )
        VALUES (?, ?, true )
    `;
    const params = [token, date.toString()]

    return new Promise<any>((resolve, reject) => {
        db.run(query, params, function (err: Error) {
            if (err) {
                console.log(err);
                reject(500);
                return;
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
}