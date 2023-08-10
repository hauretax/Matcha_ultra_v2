
import GetDb from "./back_src/database/Get.db";
import InitializeDb from "./back_src/database/Initialize.db";
import db from "./back_src/database/db";
import bcrypt from "bcrypt";
// Plage de latitudes et de longitudes
const latitudeRange = { minLatitude: 47.99959319232476, maxLatitude: 49.58583960767524 };
const longitudeRange = { minLongitude: 0.1447927459551262, maxLongitude: 6.395843454044868 };
const orientationTab = ["Heterosexual", "Bisexual", "Homosexual"];
const genderTab = ["Male", "Female"];
const randomInterest = ["video-game", "outfit", "sex", "netflix", "sport", "bonbon", "chiffre", "money", "aaaaaa", "bbbbbb"];
const randomPictureMale = ["profileMan1.webp", "profileMan2.jpg", "profileMan3.webp", "profileMan4.jpeg"];
const randomPictureFemale = ["profileWoman1.webp", "profileWoman2.webp", "profileWoman3.jpeg"];

/*
* use for first instantiation .depend of randomInterest tab
*/
async function insertInterests() {
	const values = randomInterest.map((interest) => `('${interest}')`).join(",");

	const query = `INSERT OR IGNORE INTO interests (interest) VALUES ${values}`;

	await db.run(query);
}

function generateRandomPoint(latitudeRange: { minLatitude: number, maxLatitude: number }, longitudeRange: { minLongitude: number, maxLongitude: number }): { latitude: number, longitude: number } {
	const randomLatitude = Math.random() * (latitudeRange.maxLatitude - latitudeRange.minLatitude) + latitudeRange.minLatitude;
	const randomLongitude = Math.random() * (longitudeRange.maxLongitude - longitudeRange.minLongitude) + longitudeRange.minLongitude;

	return { latitude: randomLatitude, longitude: randomLongitude };
}

function generateRandomDateOfBirth(): string {
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const maxBirthYear = currentYear - 18;
	const minBirthYear = currentYear - 55;
	const randomBirthYear = Math.floor(Math.random() * (maxBirthYear - minBirthYear + 1)) + minBirthYear;
	const randomMonth = Math.floor(Math.random() * 12) + 1;
	const randomDay = Math.floor(Math.random() * 28) + 1;

	return randomBirthYear.toString() + "-" + randomMonth.toString().padStart(2, "0") + "-" + randomDay.toString().padStart(2, "0");
}

export default async function insertDataInDb() {


	const initFunctions = [
		InitializeDb.userTable,
		InitializeDb.pictureTable,
		InitializeDb.interestsTable,
		InitializeDb.userInterestsTable,
		InitializeDb.userNoteTable
	// ... add any additional table initializers here
	];
	await Promise.all(initFunctions.map(initFunc => initFunc()));

	if ((await GetDb.allInterests()).length === 0) {
		insertInterests();
	}
	const password = "test@test.com1A";
	const encryptedPassword = await bcrypt.hash(password, 10);

	const test1 = `
	INSERT OR IGNORE INTO users (
		email,
		username,
		firstName,
		gender,
		orientation,
		birthDate,
		age,
		latitude,
		longitude,
		emailVerified,
		biography,
		password

	)
	VALUES ("test@test.com", 
	"test1", "oui", "Male", "Heterosexual", "1999-12-12","23"
	, "48.259207", "3.174191", "1", "1",?);
	`;
	const test2 = `
	INSERT OR IGNORE INTO users (
		email,
		username,
		firstName,
		gender,
		orientation,
		birthDate,
		age,
		latitude,
		longitude,
		emailVerified,
		biography,
		password
	)
	VALUES ("test@test2.com", "test2", "oui", "Female", "Heterosexual", "1999-12-12","23"
	, "48.259207", "3.174191", "1", "1",?)
	`;

	const link1=`
	INSERT OR IGNORE  INTO user_likes (
		fromId,
		toId
	)
	VALUES ("1","2")
	`;

	const link2=`
	INSERT OR IGNORE  INTO user_likes (
		fromId,
		toId
	)
	VALUES ("2","1")
	`;


	await db.run(test1, [encryptedPassword]);
	await db.run(test2, [encryptedPassword]);
	await db.run(link1);
	await db.run(link2);
	await db.run(`
	INSERT OR IGNORE INTO  user_interests (user_id, interest_id)
	VALUES ("1","1")
	`);
	await db.run(`
	INSERT OR IGNORE INTO pictures (user_id, src)
	VALUES ("1", "profileMan2.jpg")
	 `);

	for (let i = 1; i < 500; i++) {

		const sql = `
        INSERT OR IGNORE INTO users (
			email,
        	username,
			firstName,
			gender,
			orientation,
			birthDate,
			age,
			latitude,
			longitude
		)
        VALUES (?, ?, ?, ?, ?, ?,
		STRFTIME('%Y', 'now') - STRFTIME('%Y', ?) - (STRFTIME('%m-%d', 'now') < STRFTIME('%m-%d', ?))
		, ?, ?)
      `;
		const name = (Math.random() * 65536).toString();
		const gender = genderTab[i % 2];
		const orientation = orientationTab[i % 3];
		const birthDate = generateRandomDateOfBirth();
		const { latitude, longitude } = generateRandomPoint(latitudeRange, longitudeRange);

		try {
			await db.run(sql, [
				name, i, "1", gender, orientation, birthDate, birthDate, birthDate, latitude, longitude
			]);
			const userId = await db.get("SELECT last_insert_rowid() as id");
			// console.log(userId)

			const randomInterestsCount = Math.floor(Math.random() * 5) + 1; // Nombre aléatoire d'intérêts (entre 1 et 5)
			const interests = await db.all("SELECT id FROM interests ORDER BY RANDOM() LIMIT ?", [randomInterestsCount]);

			// console.log('interests id:', interests)
			interests.forEach((interest) => {
				db.run(`INSERT OR IGNORE INTO  user_interests (user_id, interest_id)
				VALUES (?,?)`, [userId.id, interest.id]);
			});
			const randomCount = Math.floor(Math.random() * 5) + 1;

			// Récupérer les éléments aléatoires du tableau
			const Pictures: string[] = [];
			for (let j = 0; j < randomCount; j++) {
				const randomPicture = i % 2 === 0 ? randomPictureMale : randomPictureFemale;
				const randomIndex = Math.floor(Math.random() * randomPicture.length);
				Pictures.push(randomPicture[randomIndex]);
			}
			const values = [...new Set(Pictures)]
				.map(url => `SELECT '${userId.id}', '${url}'`)
				.join(" UNION ALL ");
			const insertQuery = `INSERT OR IGNORE INTO pictures (user_id, src) ${values}`;
			await db.run(insertQuery);

		} catch (error) {
			console.error("Erreur lors de l'insertion des données :", error);
		}
		console.warn(i, ", added");
	}
}




insertDataInDb();

// SELECT id, username, biography, gender, birthDate, orientation, latitude, longitude,
// (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) AS distance,
// strftime('%Y', 'now') - strftime('%Y', birthdate) AS age
// FROM users
// AND age >= ${ageMin}
// AND age <= ${ageMax}	
// AND distance < ${distanceMax}
// AND gender IN (${interest.map(() => "?").join(",")})
// ORDER BY distance ASC
// LIMIT 10 OFFSET 0;