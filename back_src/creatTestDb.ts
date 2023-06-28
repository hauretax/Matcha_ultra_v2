import sqlite3 from "sqlite3";

// Fonction pour initialiser la table "users"
export default async function initializeUserTable() {
	const db = new sqlite3.Database("testDatabase.db");

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
        age INTEGER,
        orientation TEXT,
        emailVerified INTEGER,
        accessCode INTEGER,
		    token TEXT
      )`;
	await db.run(sql, [], function (err) {
		if (err) {
			console.log(err);
		} else {
			insertDataFromCSV();
		}
	});
}

// Fonction pour insérer les données depuis le fichier CSV
function insertDataFromCSV() {
	const db = new sqlite3.Database("testDatabase.db");

	for (let i; i < 500; i++) {

		const sql = `
        INSERT INTO users (
			email,
        	username,
			lastName,
			firstName,
			password,
			gender,
			biography,
			age,
			orientation,
			emailVerified,
			accessCode,
			token
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
		const name = (Math.random() * 65536).toString();
		const sex = i % 2 ? "h" : "f";
		const randombio = (Math.random() * 65536).toString();
		const age = (Math.random() * 100).toString();
		const orientation = i % 3 ? "straigth" : "gay";
		db.run(sql, [
			name + "oui@non.nop", name + "bot", "1", "oui", "pass", sex, randombio, age, orientation, 0, 0, ""
		], (error) => {
			if (error) {
				console.error("Erreur lors de l'insertion des données :", error.message);
			}
		});
	}
}

// Appel de la fonction pour initialiser la table "users"
initializeUserTable();
