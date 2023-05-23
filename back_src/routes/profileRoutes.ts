import express, { Request, Response } from 'express';
// import ProfileController from '../controllers/ProfileController';
import {checkDataProfilCreate } from '../middlewares/profileMid'
const router = express.Router();
// const profileController = new ProfileController();
router.post('/profile/create' , checkDataProfilCreate,(req: Request, res: Response) => {
    console.log('call profile create')
    res.status(200).send('ok');
//   profileController.createProfile(req, res);
});


export default router;