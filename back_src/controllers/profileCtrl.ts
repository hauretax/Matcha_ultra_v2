import { Request, Response } from 'express';
import { CreateProfileModel } from '../models/profileModel'
import Dbhandler from '../database/DbHandler';

class ProfileController {
    public async createProfile(req: Request, res: Response) {
        try {
            // get data of body
            const profile: CreateProfileModel = {
               ...req.body
            }
            const db = new Dbhandler
            
            // TODO
            /**
             * verification username and email is unique (db can send error for us ?)
             */
            // TODO
            /**
             * rec data in db
             */
            // TODO
            /**
             * send email  of verification
             */
            // Envoyer une réponse réussie
            res.status(201).json({ message: 'Profile created' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default ProfileController;