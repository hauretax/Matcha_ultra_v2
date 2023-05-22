import { Request, Response } from 'express';
import { validateRequestData } from '../utils/validateReqData';
import { CreateProfileModel } from '../models/profileModel'

class ProfileController {
    public createProfile(req: Request, res: Response): void {
        try {
            // get data of body
            const profile: CreateProfileModel = {
               ...req.body
            }
            // TODO
            /** check
             * password complexity
             * username, firstname, lastName not void
             *  */
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

    public checkDataProfilCreat(req){
       const {userName, email, firstName,lastName, password} = req.body
       if(!userName || !email || !firstName || !lastName || !password)
            return 0
    }

    // Ajoutez d'autres méthodes pour les autres actions liées au profil
}

export default ProfileController;