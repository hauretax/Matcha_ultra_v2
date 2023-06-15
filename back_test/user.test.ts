import request from 'supertest'
import http from 'http';
import app from '../back_src/app';
import ProfileController from '../back_src/controllers/profileCtrl';
import { checkDataProfilCreate } from '../back_src/middlewares/profileMid';
import { Request } from 'express';
import Dbhandler from '../back_src/database/DbHandler';
import { Fakexpress } from './FackExpress';
import { UserProfile, UserReqLogin } from '../comon_src/type/user.type';
import UserDb from '../back_src/database/User.db';

const port = 3001
const db = new Dbhandler
const userDB = new UserDb
const FE = new Fakexpress({
    params: {
        name: 'max'
    }
});
const name = (Math.random() * 65536).toString;
const email = name+'mail1@oui.non'
const userName = name+'super'
const firstName = 'eude'
const lastName = 'marcel'
const password = 'opPsw1@s'

const goodReq = {
    body: {
        userName,
        email,
        firstName,
        lastName,
        password,
    },
} as Request;

describe('user create Profile', () => {
    let usrId = 0;
    db.creatTables()
    // TODO
    /**
     * verification of usr in db
     */
    afterAll((done) => {
        userDB.deletUser(usrId);
        done();
        () => { }
    });



    const badReq = {
        body: {
            name: 'John Doe',
            email: 'johndoe@example.com',
        },
    };

    const next = jest.fn();
    //test on controller
    it('should exec profileCtrl', async () => {

        const profileCtrl = new ProfileController
        await profileCtrl.createProfile(goodReq as any, FE.res as any)

        usrId = FE.responseData.usrId;
        expect(FE.res.status).toHaveBeenCalledWith(201);

    })
    //test on midelware
    it('should return 405 if data is missing', async () => {
        await checkDataProfilCreate(badReq as any, FE.res as any, next);

        expect(FE.res.status).toHaveBeenCalledWith(405);
        expect(next).not.toHaveBeenCalled();
    });

    it('with bad password', async () => {
        const modifiedReq = {
            body: {
                ...goodReq.body,
                password: "abcd"
            },
        };
        await checkDataProfilCreate(modifiedReq as any, FE.res as any, next);
        expect(FE.res.status).toHaveBeenCalledWith(406);
        expect(next).not.toHaveBeenCalled();
    })
    it('with bad email', async () => {
        const profileCtrl = new ProfileController
        const modifiedReq = {
            body: {
                ...goodReq.body,
                email: "abcd"
            },
        };
        await profileCtrl.createProfile(modifiedReq as any, FE.res as any);
        expect(FE.res.status).toHaveBeenCalledWith(406);
    })
    it('already use userName', async () => {
        const profileCtrl = new ProfileController
        const modifiedReq = {
            body: {
                ...goodReq.body,
                email: "abcd@test.oui"
            },
        };
        await profileCtrl.createProfile(modifiedReq as any, FE.res as any);
        expect(FE.res.status).toHaveBeenCalledWith(409);
    })
    it('already use email', async () => {
        const profileCtrl = new ProfileController
        const modifiedReq = {
            body: {
                ...goodReq.body,
                userName: 'test2'
            },
        };
        await profileCtrl.createProfile(modifiedReq as any, FE.res as any);
        expect(FE.res.status).toHaveBeenCalledWith(409);
    })

})

interface Datalogin {
    body: UserReqLogin
}

const name1 = (Math.random() * 65536).toString;

const email1 = name1+'mail2@oui.non'
const userName1 = name1+'supe2'

const creationReq = {
    body: {
        userName:userName1,
        email: email1,
        firstName,
        lastName,
        password,
    },
} as Request;
describe('user login', () => {

    db.creatTables()
    const profileCtrl = new ProfileController
    let usrId = 0;
    // TODO
    /**
     * verification of usr in db
     */
    beforeAll(async () => {
        await profileCtrl.createProfile(creationReq as any, FE.res as any)
        usrId = FE.responseData.usrId;
    })

    afterAll((done) => {
        userDB.deletUser(usrId);
        done();
        () => { }
    });



    const next = jest.fn();
    //test on controller
    it('should receivd user', async () => {

        const reqLogin = {
            body: {
                email:email1,
                password,
            }, 
        }

        await profileCtrl.login(reqLogin as any, FE.res as any)

        let userData: UserProfile = FE.responseData.user;
        const expectData: UserProfile = {
            email:email1,
            userName:userName1,
            lastName,
            firstName,
            verified: false
        }

        expect(userData).toEqual(expectData)
        expect(FE.res.status).toHaveBeenCalledWith(200);
    })
})