import request from 'supertest'
import http from 'http';
import app from '../back_src/app';
import ProfileController from '../back_src/controllers/profileCtrl';
import { checkDataProfilCreate } from '../back_src/middlewares/profileMid';
import { Request, Response } from 'express';

const port = 3001

describe('user actions', () => {
    let server: http.Server;

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

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
    }  as unknown as Response<any, Record<string, any>>;
    const next = jest.fn();
    //test on controller
    it('should exec profileCtrl', async () => {
        const profileCtrl = new ProfileController
        await profileCtrl.createProfile(goodReq as any, res as any);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Profile created' });
    })
    //test on midelware
    it('should return 405 if data is missing', async () => {
        await checkDataProfilCreate(badReq as any, res as any, next);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(next).not.toHaveBeenCalled();
    });

    it('with bad password', async () => {
        const modifiedReq = {
            body: {
                ...goodReq.body,
                password: "abcd"
            },
        };
        await checkDataProfilCreate(modifiedReq as any, res, next);
        expect(res.status).toHaveBeenCalledWith(406);
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
        await profileCtrl.createProfile(modifiedReq as any, res as any);
        expect(res.status).toHaveBeenCalledWith(406);
    })
    it('already use userName', async () => {
        const profileCtrl = new ProfileController
        const modifiedReq = {
            body: {
                ...goodReq.body,
                email: "abcd@test.oui"
            },
        };
        await profileCtrl.createProfile(modifiedReq as any, res as any);
        expect(res.status).toHaveBeenCalledWith(409);
    })
    it('already use email', async () => {
        const profileCtrl = new ProfileController
        const modifiedReq = {
            body: {
                ...goodReq.body,
                userName: 'test2'
            },
        };
        await profileCtrl.createProfile(modifiedReq as any, res as any);
        expect(res.status).toHaveBeenCalledWith(409);
    })

})