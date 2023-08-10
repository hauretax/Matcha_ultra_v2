import GetDb from "../database/Get.db";

export async function getUserPreferences(userId: number): Promise<string[]>{
	// ORM call
	const res = await GetDb.getUserPreferences(userId);

	// data processing
	return res.map(preference => preference.name);
}