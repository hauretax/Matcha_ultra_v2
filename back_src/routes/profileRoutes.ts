import express, { Request, Response } from 'express';
// import ProfileController from '../controllers/ProfileController';
import { createProfile, login } from '../controllers/profileCtrl'

const router = express.Router();

router.post('/profile/create', (req: Request, res: Response) => {
    console.log('call profile create');
    createProfile(req, res)
});
    
router.post('/profile/login', (req: Request, res: Response) => {
    console.log('call profile create')
    login(req,res)
});


export default router;  