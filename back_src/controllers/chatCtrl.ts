import { Request, Response } from "express";
import GetDb from "../database/Get.db";

export async function getActualConversation(req: Request, res: Response) {
    //todo tout verifier
    const { id } = res.locals.fulluser;
    const profiles = await GetDb.allConversation(id);
    
    res.status(200).json({ profiles });
}