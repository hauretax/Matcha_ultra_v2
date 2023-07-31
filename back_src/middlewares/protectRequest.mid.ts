import { NextFunction, Request, Response } from "express";
import { UserProfile } from "../../comon_src/type/user.type";

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
  const user: UserProfile = res.locals.fulluser; // from validsecurRequest

  if (!user.emailVerified) {
    res.status(422).json({ error: "unverified email" });
    return;
  }

  if (isProfileInfoMissing(user)) {
    res.status(422).json({ error: "unverified email" });
    return;
  }
  next();
}

const isProfileInfoMissing = (user: UserProfile) => {
  return (
    !user.gender ||
    !user.orientation ||
    !user.biography ||
    !user.birthDate ||
    !user.pictures.length ||
    !user.interests.length
  )
}