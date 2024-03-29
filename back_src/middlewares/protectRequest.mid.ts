import { NextFunction, Request, Response } from "express";
import { PersonalProfile, UserProfile } from "../../comon_src/type/user.type";
import { getUserPreferences } from "../service/userPreferences";
import GetDb from "../database/Get.db";

export async function isPictureOwner(req: Request, res: Response, next: NextFunction) {
	const user: UserProfile = res.locals.fulluser; // from validsecurRequest
	const { pictureId } = req.params;
	if (!pictureId || !Number.isInteger(parseInt(pictureId))) {
		res.status(400).json({ error: "invalid picture id" });
		return;
	}
	const picture = user.pictures.find((picture) => picture.id === parseInt(pictureId));
	if (!picture) {
		res.status(404).json({ error: "picture not found" });
		return;
	}
	res.locals.picture = picture;
	next();
}

export async function isProfileCompleted(req: Request, res: Response, next: NextFunction) {
	const user: PersonalProfile = res.locals.fulluser; // from validsecurRequest

	if (!user.emailVerified) {
		res.status(422).json({ error: "unverified email" });
		return;
	}

	if (await isProfileInfoMissing(user)) {
		res.status(400).json({ error: "profile information missing" });
		return;
	}

	next();
}

const isProfileInfoMissing = async (user: PersonalProfile) => {
	return (
		!user.gender ||
		!(await getUserPreferences(user.id)).length ||
    !user.biography ||
    !user.birthDate ||
    !user.pictures.length ||
    !user.interests.length
	);
};

export async function isConnectedTo(idFrom: number, idTo: number): Promise<boolean> {
	
	const isConnectedTo = await GetDb.checkUserLikesSymmetry(idFrom, idTo);
	return (!!isConnectedTo.result);
}