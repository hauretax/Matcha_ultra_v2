const fakeAuthProvider = {
    isAuthenticated: false,
    signin(username: string, password: string, callback: VoidFunction) {
        fakeAuthProvider.isAuthenticated = true;
        if (username === 'tonio' && password === 'antoine') {
            setTimeout(callback, 100); // fake async
            return {
                data: {
                    token: 'i am a token',
                    user: {
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
    signout(callback: VoidFunction) {
        fakeAuthProvider.isAuthenticated = false;
        setTimeout(callback, 100);
    },
};

export { fakeAuthProvider };