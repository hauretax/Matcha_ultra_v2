import { NextFunction, Request, Response } from "express";
import UserDb from "../database/User.db";
import { validateJwt } from "../utils/jwt";

const userDB = new UserDb;

export async function validsecurRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.body) {
        res.status(400).json({ error: "no credentials provided" })
        return;
    }

    const { username } = req.body;
    if (!username) {
        res.status(422).json({ error: "username and/or password missing" });
        return;
    }


    //TODO opti faire une variable avec une cle usrname et une variable mail valider ?
    try {
        const fulluser = await userDB.findUser(username);
        if (!fulluser?.emailVerified) {
            res.status(422).json({ error: "unverified email" });
            return;
        }
        const authHeader = req.headers.Authorization as string;
        if (!authHeader) {
            res.status(422).json({ error: "header missing" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(422).json({ error: "header missing" });
            return;
        }
        const jwtIsValidate = validateJwt(token, fulluser.id)
        if (jwtIsValidate === 401) {
            res.status(401).json({ error: "token expired" });
            return;
        }
        if (jwtIsValidate) {
            res.locals.fulluser = fulluser;
            next();
            return;
        }
        res.status(422).json({ error: "wrong token" });
        return;

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'server error' });
        return;
    }

}