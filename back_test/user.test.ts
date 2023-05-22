import request from 'supertest'
import http from 'http';
import app from '../back_src/app';
import ProfileController from '../back_src/controllers/profileCtrl';

const port = 3001

describe('user actions', () => {
    let server: http.Server;

    const goodReq = {
        body: {
            userName: 'gens',
            email: 'heud@hotmail.fr',
            firstName: 'eude',
            lastName: 'marcel',
            password: 'opPsw1@',
        },
    };

    const badReq = {
        body: {
            name: 'John Doe',
            email: 'johndoe@example.com',
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    it('should exec profileCtrl', async () => {
        const profileCtrl = new ProfileController
        await profileCtrl.createProfile(goodReq as any, res as any);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Profile created' });
    })
    it('without all param', async () => {
        const profileCtrl = new ProfileController
        await profileCtrl.createProfile(badReq as any, res as any);
        expect(res.status).toHaveBeenCalledWith(405);
    })

    it('with bad password', async () => {
        const profileCtrl = new ProfileController
        const modifiedReq = {
            body: {
                ...goodReq.body,
                password: "abcd"
            },
        };
        await profileCtrl.createProfile(modifiedReq as any, res as any);
        expect(res.status).toHaveBeenCalledWith(406);
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