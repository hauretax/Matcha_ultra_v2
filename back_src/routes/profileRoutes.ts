import express, { Request, Response } from 'express';
// import ProfileController from '../controllers/ProfileController';
import { checkDataProfilCreate } from '../middlewares/profileMid'
import ProfileController from '../controllers/profileCtrl'

const router = express.Router();

const profileCtrl = new ProfileController;
router.post('/profile/create', checkDataProfilCreate, (req: Request, res: Response) => {

    console.log('call profile create');
    profileCtrl.createProfile(req, res)
});
router.post('/profile/login', checkDataProfilCreate, (req: Request, res: Response) => {
    console.log('call profile create')
    res.status(200).send('ok');
});


export default router;