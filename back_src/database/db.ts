/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database, RunResult } from "sqlite3";

class MyDB {
	db: Database;

	constructor(dbFilePath: string) {
		this.db = new Database(dbFilePath, (err) => {
			if (err) {
				console.error(err.message);
			} else {
				console.warn("Connected to the SQLite database.");
			}
		});
	}

	run(sql: string, params?: any[]): Promise<RunResult> {
		return new Promise((resolve, reject) => {
			this.db.run(sql, params, function (err) {
				if (err) {
					reject(err);
				} else {
					resolve(this);
				}
			});
		});
	}

	get(sql: string, params?: any[]): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.get(sql, params, (err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			});
		});
	}

	all(sql: string, params?: any[]): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.db.all(sql, params, (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	close(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.db.close((err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}

const db = new MyDB("./database.sqlite");

export default db;
