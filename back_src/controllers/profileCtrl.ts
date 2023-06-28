import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import fs from 'fs';
import { MulterError } from "multer";
import path from "path";

import sendEmail from "../utils/sendMail";
import { generateRefreshJwt, generateJwt } from "../utils/jwt";
import { validateAge, validateBody, validateInterests, validateMail, validatePictureId } from "../utils/validateDataHelper";

import { UserPayload, UserProfile } from "../../comon_src/type/user.type";
import { UserReqRegister } from "../../comon_src/type/user.type";

import UserDb from "../database/User.db";
import { UniqueConstraintError } from "../database/errors";

export async function createProfile(req: Request, res: Response) {
  if (!validateBody(req, ["username", "email", "firstName", "lastName", "password"], ["string", "string", "string", "string", "string"])) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }
  const { username, email, firstName, lastName, password } = req.body;

  if (!validateMail(email)) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  const passwordRegex = /(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).send({ message: "password must contain at least one lowercase, one uppercase, one digit, one special character (@$!%*?&), and be at least 8 characters long" });
    return;
  }

  try {
    const user: UserReqRegister = {
      username,
      email,
      firstName,
      lastName,
      password: await bcrypt.hash(password, 10),
    }

    const accessCode = await UserDb.insertUser(user);

    await sendEmail(email, "click on this link to activate account :http://" + "localhost:" + "3000/valide_mail?code=" + accessCode + "&email=" + email);

    res.status(201).json({ message: "Profile created" });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res.status(409).json({ error: "user or email already taken" });
    } else {
      throw error;  // propagate the error
    }
  }
}

export async function login(req: Request, res: Response) {
  if (!validateBody(req, ["username", "password"], ["string", "string"])) {
    res.status(422).json({ error: "username and/or password missing" });
    return;
  }
  const { username, password } = req.body;

  const user = await UserDb.findUser(username);
  if (!user) {
    res.status(404).json({ error: "account not found" });
    return;
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    res.status(401).json({ error: "username and/or password incorrect" });
    return;
  }

  const { id, email, firstName, lastName, biography, gender, age, orientation, emailVerified, pictures, interests } = user;
  const payload: UserPayload = {
    jwt: {
      accessToken: generateJwt(id),
      refreshToken: await generateRefreshJwt(id),
    },
    profile: {
      id,
      email,
      username,
      lastName,
      firstName,
      biography,
      gender,
      age,
      orientation,
      emailVerified,
      pictures,
      interests
    }
  };
  res.status(200).json(payload);
}

export function getProfile(req: Request, res: Response) {
  const user: UserProfile = res.locals.fulluser;
  res.json(user);
}

export async function getOptions(req: Request, res: Response) {
  const options = await UserDb.getAllInterests()
  res.json(options);
}

export async function validByEmail(req: Request, res: Response) {
  const requestUrl = req.url;

  const parsedUrl = new URL(requestUrl, `http://${req.headers.host}`);
  const queryParameters = parsedUrl.searchParams;

  const email = queryParameters.get("email");
  const code = queryParameters.get("code");
  if (!email || !code) {
    res.status(400).json({ error: "missing parameters" });
    return;
  }
  const dbCode = await UserDb.getCode(email);
  if (dbCode.accessCode != code) {
    res.status(404).json({ error: "not found" });
    return;
  }

  await UserDb.valideUser(email);
  res.sendStatus(200);
  return;
}

export async function updateProfile(req: Request, res: Response) {
  if (!validateBody(req, ["firstName", "lastName", "age", "gender", "orientation", "email"], ["string", "string", "number", "string", "string", "string"])) {
    res.status(400).json({ error: "missing parameters" });
    return;
  }
  const { firstName, lastName, age, gender, orientation, email } = req.body;

  // Age validation
  if (!validateAge(age)) {
    res.status(400).json({ error: "invalid age" });
    return;
  }

  // Gender validation
  if (!["Male", "Female", "Other"].includes(gender)) {
    res.status(400).json({ error: "invalid gender" });
    return;
  }

  // Orientation validation
  if (!["Homosexual", "Heterosexual", "Bisexual"].includes(orientation)) {
    res.status(400).json({ error: "invalid orientation" });
    return;
  }

  // Email validation
  if (!validateMail(email)) {
    res.status(400).json({ error: "invalid email" });
    return;
  }

  const profileInformation = {
    firstName,
    lastName,
    age,
    gender,
    orientation,
    email,
    emailVerified: Number(email === res.locals.fulluser.email)
  }
  await UserDb.updateProfile(profileInformation, res.locals.fulluser.id);
  res.status(200).json({ message: "Profile updated successfully" });
}

export async function updateBio(req: Request, res: Response) {
  if (!validateBody(req, ["biography"], ["string"])) {
    res.status(400).json({ error: "missing parameters" });
    return;
  }
  const { biography } = req.body;

  await UserDb.updateBio(biography, res.locals.fulluser.id)
  res.status(200).json({ message: 'Profile updated successfully' });
}

export async function updateInterests(req: Request, res: Response) {
  if (!validateBody(req, ["interests"], ["object"])) {
    res.status(400).json({ error: "missing parameters" });
    return;
  }
  const { interests } = req.body;

  // interests validation
  if (!validateInterests(interests)) {
    res.status(400).json({ error: "Invalid interest list. Interests must be an array of non empty strings" });
    return;
  }

  await UserDb.updateUserInterests(res.locals.fulluser.id, interests)
  res.status(200).json({ message: 'Profile updated successfully' });
}

export async function deletePicture(req: Request, res: Response) {
  const { pictureId } = req.params;

  if (!validatePictureId(pictureId)) {
    res.status(400).send({ error: "Invalid picture id" });
    return;
  }

  const picture = await UserDb.findPictureByIdAndDelete(parseInt(pictureId));

  if (!picture) {
    res.status(404).send({ error: "Picture not found" });
    return;
  }

  res.status(200).send({ message: "Picture deleted successfully" });

  // Delete picture from disk
  const filePath = path.join(__dirname, '../../../back_src', 'public/images', picture.src);
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
  return;
}

export async function insertPicture(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    next(new MulterError('LIMIT_FILE_COUNT'));
    return;
  }

  const { filename } = req.file;
  const { id } = res.locals.fulluser;

  const pictureId = await UserDb.insertPicture(id, filename);

  res.status(200).json({ id: pictureId, src: filename });
  return;
}

// No need to check if pictureId is a number or if picture exists. The middleware does it.
export async function updatePicture(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    next(new MulterError('LIMIT_FILE_COUNT'));
    return;
  }

  const { filename } = req.file;
  const { pictureId } = req.params;

  await UserDb.updatePicture(parseInt(pictureId), filename);

  res.status(200).json({ id: pictureId, src: filename });

  // Delete old picture from disk
  const filePath = path.join(__dirname, '../../../back_src', 'public/images', res.locals.picture.src);
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
  return;
}