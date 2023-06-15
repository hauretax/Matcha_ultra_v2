import { UserPayload } from '../../../comon_src/type/user.type'

interface UserResponse {
    data : UserPayload;
}

const fakeAuthProvider = {
    isAuthenticated: false,
    signin(username: string, password: string, callback: VoidFunction): UserResponse {
        fakeAuthProvider.isAuthenticated = true;
        if (username === 'tonio' && password === 'antoine') {
            setTimeout(callback, 100); // fake async
            return {
                data: {
                    jwtToken: 'i am a token',
                    profile: {
                        username: 'tonio',
                        email: 'tonio@gmail.com',
                        emailVerified: false,
                        lastName: 'yhaaa',
                        firstName: 'oui'
                    }
                }
            }
        } else {
            throw new Error('wrong credentials');
        }
    },
    signout(callback: VoidFunction) {
        fakeAuthProvider.isAuthenticated = false;
        setTimeout(callback, 100);
    },
};

export { fakeAuthProvider };