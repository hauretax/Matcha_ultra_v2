import { UserPayload } from '../../../comon_src/type/jwt.type'

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
                        emailVerified: false
                    }
                }
            }
        } else {
            throw new Error('wrong credentials');
        }
    },
    signup(username: string, email: string, firstName: string, lastName: string, password: string, callback: VoidFunction): void {
        fakeAuthProvider.isAuthenticated = true;
        if (username !== 'tonio') {
            setTimeout(callback, 100); // fake async
        } else {
            throw new Error('user already exists');
        }
    },
    signout(callback: VoidFunction) {
        fakeAuthProvider.isAuthenticated = false;
        setTimeout(callback, 100);
    },
};

export { fakeAuthProvider };