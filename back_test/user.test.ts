import request from 'supertest'
import http from 'http';
import app from '../back_src/app';
import ProfileController from '../back_src/controllers/profileCtrl';
import { checkDataProfilCreate } from '../back_src/middlewares/profileMid';
import { Request } from 'express';
import Dbhandler from '../back_src/database/DbHandler';
import { Fakexpress } from './FackExpress';

const port = 3001

describe('user actions', () => {
    let server: http.Server;
    const db = new Dbhandler
    let usrId = 0;
    db.creatTables()

    afterAll((done) => {
        db.deletUser(usrId);
        done();
        () => { }
      });

    const goodReq = {
        body: {
            userName: 'ouis',
            email: 'heud@hotmail.fr',
            firstName: 'eude',
            lastName: 'marcel',
            password: 'opPsw1@s',
        },
    } as Request;

    const badReq = {
        body: {
            name: 'John Doe',
            email: 'johndoe@example.com',
        },
    };

    it('myshit', async () => { 
        db.deletUser(22);
        db.deletUser(21);
    })

    const FE = new Fakexpress({
        params: {
          name: 'max'
        }
    });
    
    const next = jest.fn();
    //test on controller
    it('should exec profileCtrl', async () => {



        const profileCtrl = new ProfileController
        await profileCtrl.createProfile(goodReq as any, FE.res as any)
        console.log(FE.responseData.usrId)
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