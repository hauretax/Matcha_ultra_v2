import request from 'supertest'
import http from 'http';
import app from '../back_src/app';
import ProfileController from '../back_src/controllers/profileCtrl';

const port = 3001

describe('user actions', () => {
    let server: http.Server;

    // Créer un objet mock pour req
    const goodReq = {
        body: {
            name: 'John Doe',
            age: 25,
            email: 'johndoe@example.com',
        },
    };

    const badReq = {
        body: {
            name: 'John Doe',
            email: 'johndoe@example.com',
        },
    };

    // Créer un objet mock pour res
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    it('should exec profileCtrl', async () => {
        const profileCtrl = new ProfileController
        // Exécuter la fonction createProfile avec les objets mock
        await profileCtrl.createProfile(goodReq as any, res as any);

        // Vérifier les résultats
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Profile created' });

    })
    it('shouldn t exec profileCtrl', async () => {
        const profileCtrl = new ProfileController
        // Exécuter la fonction createProfile avec les objets mock
        await profileCtrl.createProfile(badReq as any, res as any);

        // Vérifier les résultats
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Profile created' });

    })

})