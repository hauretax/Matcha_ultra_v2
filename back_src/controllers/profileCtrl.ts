import { Request, Response } from 'express';
import { CreateProfileModel } from '../models/profileModel'
import Dbhandler from '../database/DbHandler';

class ProfileController {
    public async createProfile(req: Request, res: Response) {
        try {
            const profile: CreateProfileModel = {
               ...req.body
            }
            const db = new Dbhandler
            const usrId = await db.insertUser(profile)
            // TODO
            /**
             * send email  of verification
             */

            res.status(201).json({ message: 'Profile created', usrId: usrId });
        } catch (error) {
            if (error === 409) {
                res.status(409).json({ error: 'user or email already taken' });
                return;
              } 
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default ProfileController;


// const res = {
//     status: jest.fn().mockReturnThis(),
//     json: jest.fn(),
//     send: jest.fn()
// }  as unknown as Response<any, Record<string, any>>;