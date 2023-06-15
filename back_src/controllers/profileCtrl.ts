import { Request, Response } from 'express';
import UserDb from '../database/User.db';
import sendEmail from '../utils/sendMail';
import bcrypt from "bcrypt"
import { UserReqLogin, UserReqRegister } from '../../comon_src/type/user.type';
//cette interface n as pas d importance je verifie juste un truc
interface UsrRequest extends Request { 
    req:{ 
        body: UserReqLogin
    }
}
// ca a du sens de mettre ca dans une classe ?
class ProfileController {
    userDB = new UserDb

    public async createProfile(req: Request, res: Response) {
        const profile: UserReqRegister = req.body
        if (!profile.email || !profile.firstName || !profile.lastName || !profile.password || !profile.userName) {
            res.status(422).json({ error: 'Unprocessable Entity' });
            return;
        }
        try {
            profile.password = await bcrypt.hash(req.body.password, 10)
            const { id, accessCode, email } = await this.userDB.insertUser(profile)
            //TODO: faire un lien en front pour pouvoir verifier le mail (url est pas bon)
            sendEmail(email, 'click on this link to activate account :http://' + 'localhost:' + '8080/' + accessCode);
            res.status(201).json({ message: 'Profile created', usrId: id });

        } catch (error) {
            if (error === 409) {
                res.status(409).json({ error: 'user or email already taken' });
                return;
            }
            console.error('\nregister_error:\n', error)
            res.status(500).json({ error: 'Internal Server Error' });
            return
        }
    }

    public async login(req: UsrRequest, res: Response) {
        const login:string = req.body.login || req.body.email
        const password = req.body.password
        if (!login || !password) {
            res.status(422).json({ error: 'Unprocessable Entity' });
            return;
        }
        try {
            const fulluser = await this.userDB.findUser(login)
            if (fulluser === null) {
                res.status(404).json({ error: 'Not Found' });
                return;
            }
            const isAutorized = await bcrypt.compare(password, fulluser.password)
            if (isAutorized) {
                //TODO add jsonwebtoken
                const { email, userName,firstName, lastName, verified } = fulluser
                res.status(200).json({
                    user: { email, userName, lastName, verified,firstName }
                });
            } else {
                res.status(401).json({ error: 'Unauthorized' });
            }
        } catch (error) {
            console.error('\nlogin_error:\n', error)
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