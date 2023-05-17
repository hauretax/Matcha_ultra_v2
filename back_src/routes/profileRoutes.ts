import express, { Request, Response } from 'express';
// import ProfileController from '../controllers/ProfileController';

const router = express.Router();
// const profileController = new ProfileController();

router.post('/profile/create', (req: Request, res: Response) => {
    console.log('call profile create')
    res.status(200).send('ok');
//   profileController.createProfile(req, res);
});

export default router;