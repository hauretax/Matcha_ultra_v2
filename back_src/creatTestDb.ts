
import db from "./database/db";
// Plage de latitudes et de longitudes
const latitudeRange = { minLatitude: 47.99959319232476, maxLatitude: 49.58583960767524 };
const longitudeRange = { minLongitude: 0.1447927459551262, maxLongitude: 6.395843454044868 };
const orientationTab = ["Heterosexual", "Bisexual", "Homosexual"];
const genderTab = ["Male", "Female", "Other"];



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
	const randomMonth = Math.floor(Math.random() * 12);
	const randomDay = Math.floor(Math.random() * 28) + 1;

	return randomMonth.toString().padStart(2, "0") + "/" + randomDay.toString().padStart(2, "0") + "/" + randomBirthYear.toString();
}

export default async function insertDataInDb() {

	for (let i = 0; i < 10000; i++) {

		const sql = `
        INSERT INTO users (
			email,
        	username,
			firstName,
			gender,
			orientation,
			birthDate,
			latitude,
			longitude
		)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
		const name = (Math.random() * 65536).toString();
		const gender = genderTab[i % 3];
		const orientation = orientationTab[i % 3];
		const birthDate = generateRandomDateOfBirth();
		const { latitude, longitude } = generateRandomPoint(latitudeRange, longitudeRange);
		
		try {
			db.run(sql, [
				name, name, "1", gender, orientation, birthDate, latitude, longitude
			]);
		} catch (error) {
			console.error("Erreur lors de l'insertion des données :", error);
		}
		console.log(name, ", added");

	}
}






// SELECT id, username, biography, gender, birthDate, orientation, latitude, longitude,
// (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) AS distance,
// strftime('%Y', 'now') - strftime('%Y', birthdate) AS age
// FROM users
// WHERE strftime('%Y', birthdate) >= strftime('%Y', 'now', '-${ageMax} years')
//   AND strftime('%Y', birthdate) <= strftime('%Y', 'now', '-${ageMin} years')		
// AND distance < ${distanceMax}
// AND gender IN (${interest.map(() => "?").join(",")})
// ORDER BY distance ASC
// LIMIT 10 OFFSET 0;