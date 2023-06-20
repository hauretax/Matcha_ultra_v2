import { Request, Response } from "express";
import UserDb from "../database/User.db";
import sendEmail from "../utils/sendMail";
import bcrypt from "bcrypt";
import { UserReqRegister } from "../../comon_src/type/user.type";
import { checkDataProfilCreate } from "./dataVerifiers/assertedUserData";
import { UserPayload } from "../../comon_src/type/user.type"
import { generateJwt } from "../utils/jwt"

const userDB = new UserDb;

export async function createProfile(req: Request, res: Response) {
  const profile: UserReqRegister = req.body;
  const dataError = checkDataProfilCreate(profile);
  if (dataError) {
    res.status(dataError.code).json({ error: dataError.message });
    return;
  }
  try {
    profile.password = await bcrypt.hash(req.body.password, 10);
    const { id, accessCode, email } = await userDB.insertUser(profile);
    //TODO: faire un lien en front pour pouvoir verifier le mail (url est pas bon)
    // sendEmail(email, "click on this link to activate account :http://" + "localhost:" + "8080/" + accessCode);
    res.status(201).json({ message: "Profile created", usrId: id });
    return;
  } catch (error) {
    if (error === 409) {
      res.status(409).json({ error: "user or email already taken" });
      return;
    }
    throw new Error(error)
  }
}

export async function login(req: Request, res: Response) {
  if (!req.body) {
    res.status(400).json({ error: "no credentials provided" })
    return;
  }

  const { username, password } = req.body;
  if (!username || !password) {
    res.status(422).json({ error: "username and/or password missing" });
    return;
  }

  const fulluser = await userDB.findUser(username);
  if (fulluser === null) {
    res.status(404).json({ error: "account not found" });
    return;
  }

  const isAutorized = await bcrypt.compare(password, fulluser.password);
  if (isAutorized) {
    const { id, email, username, firstName, lastName, emailVerified } = fulluser;
    const payload: UserPayload = {
      jwtToken: generateJwt(id),
      profile: {
        email,
        username,
        lastName,
        firstName,
        emailVerified
      }
    };
    res.status(200).json(payload);
  } else {
    res.status(401).json({ error: "username and/or password incorrect" });
  }

}



// const res = {
//     status: jest.fn().mockReturnThis(),
//     json: jest.fn(),
//     send: jest.fn()
// }  as unknown as Response<any, Record<string, any>>;