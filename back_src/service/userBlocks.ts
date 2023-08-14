import InsertDb from "../database/Insert.db";
import DeleteDb from "../database/Delet.db";
import FindDb from "../database/Find.db";

// If User was already liked, no need to tell
export async function blockUser(fromId: number, toId: number): Promise<void> {
	// ORM call
	try {
		await InsertDb.block(fromId, toId);
	} catch (error) {
		if (error.message.includes("UNIQUE constraint failed"))
			return;
		throw error;
	}
}

export async function unblockUser(fromId: number, toId: number): Promise<void> {
	// ORM call
	await DeleteDb.unblock(fromId, toId);
}

export async function isUserBlocked(fromId: number, toId: number): Promise<boolean> {
	// ORM call
	const res = await FindDb.isBlockedBy(fromId, toId);

	console.log(res)
	// data processing
	return res.count > 0;
}