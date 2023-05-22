import { Request, Response } from 'express';
import { validateRequestData } from '../utils/validateReqData';
import { CreateProfileModel } from '../models/profileModel'

class ProfileController {
    public createProfile(req: Request, res: Response): void {
        try {
            // get data of body
            const { userName, firstName, email } = req.body;

            const profileModel: CreateProfileModel = {
                userName: '',
                email: '',
                firstName: '',
                lastName: '',
                password: '',
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

            //probablement pas la bonne mannierre de proceder
            if (validateRequestData(req.body, profileModel)) {
                res.status(405).json({ message: 'do not eat cat (you didn t send the correct amount of data)' })
                return;
            }
            // Envoyer une réponse réussie
            res.status(201).json({ message: 'Profile created' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Ajoutez d'autres méthodes pour les autres actions liées au profil
}

export default ProfileController;