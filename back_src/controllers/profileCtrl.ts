import { Request, Response } from 'express';
import { validateRequestData } from '../utils/validateReqData';

class ProfileController {
  public createProfile(req: Request, res: Response): void {
    try {
      // Récupérer les données du corps de la requête
      const { name, age, email } = req.body;

      const profileModel = {
        name: '',
        age: 0,
        email: ''
      } 

      const isValidData = validateRequestData(req.body, profileModel)
      console.log(isValidData)
      // Envoyer une réponse réussie
      res.status(201).json({ message: 'Profile created' });
    } catch (error) {
      // Gérer les erreurs
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Ajoutez d'autres méthodes pour les autres actions liées au profil
}

export default ProfileController;