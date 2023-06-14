import { Request, Response } from 'express';
import { CreateProfileModel } from '../models/profileModel'
import Dbhandler from '../database/DbHandler';
import sendEmail from '../utils/sendMail';


// ca a du sens de mettre ca sur une classe ?
class ProfileController {
    public async createProfile(req: Request, res: Response) {
        try {
            const profile: CreateProfileModel = {
               ...req.body
            }
            const db = new Dbhandler
            const { id , nbV, email} = await db.insertUser(profile)

            sendEmail(email,'click on this link to activate account :http://'+'localhost:'+'8080'+nbV );
            res.status(201).json({ message: 'Profile created', usrId: id });
       
         } catch (error) {
            if (error === 409) {
                res.status(409).json({ error: 'user or email already taken' });
                return;
            } 
            console.log(error)
            res.status(500).json({ error: 'Internal Server Error' });
            return 
        }
    }
}

export default ProfileController;


// const res = {
//     status: jest.fn().mockReturnThis(),
//     json: jest.fn(),
//     send: jest.fn()
// }  as unknown as Response<any, Record<string, any>>;