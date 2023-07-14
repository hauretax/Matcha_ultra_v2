import { Request, Response } from "express";
import UpdateDb from "../database/Update.db";

export async function noteUserTo(req: Request, res: Response) {
    console.log(
        "userFrom:", res.locals.fulluser.id,
        "note:", req.body.note,
        "userTo:", req.body.userTo,
    );
    UpdateDb.noteUserTo(res.locals.fulluser.id, req.body.note, req.body.userTo);
}