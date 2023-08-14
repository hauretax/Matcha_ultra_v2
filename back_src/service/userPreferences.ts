import DeletDb from "../database/Delet.db";
import GetDb from "../database/Get.db";
import InsertDb from "../database/Insert.db";

export async function getUserPreferences(userId: number): Promise<string[]>{
	// ORM call
	const res = await GetDb.getUserPreferences(userId);

	// data processing
	return res.map(preference => preference.name);
}

export async function updateUserPreferences(userId: number, preferences: string[]): Promise<void>{
	// ORM calls
	await DeletDb.removePreferences(userId);
	await InsertDb.addUserPreferences(userId, preferences);
}