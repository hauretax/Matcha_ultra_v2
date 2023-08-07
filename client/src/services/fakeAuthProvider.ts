import { UserPayload } from "../../../comon_src/type/user.type"

interface UserResponse {
  data: UserPayload;
}

const profile = {
  id: 1,
  username: 'tonio',
  email: 'tonio@gmail.com',
  lastName: 'Labalette',
  firstName: 'Antoine',
  emailVerified: 0,
  gender: '',
  birthDate: '19/12/1999',
  orientation: 'Heterosexual',
  interests: ['sport', 'philosophy', 'dev', 'techno', 'board games'],
  biography: 'What\'s amazing about life is that you are ALL IN. Whether you want it or not. It WILL kill you at the end. So why not live the most amazing life you can ?',
  pictures: [{id: 1, src: process.env.PUBLIC_URL + '/images/profilePicture.png'}],
  customLocation: false,
  latitude: '0',
  longitude: '0'
}

const fakeAuthProvider = {
  isAuthenticated: false,
  signin(username: string, password: string): Promise<UserResponse> {
    fakeAuthProvider.isAuthenticated = true;
    console.log("Signing in with", "Username: " + username, "Password: " + password)
    return new Promise((resolve, reject) => {
      // Simulating a delay of 1 second before resolving the promise
      setTimeout(() => {
        if (username === 'tonio' && password === 'antoine') {
          // Simulate a successful response
          console.log("Sign out response received")
          const response = {
            data: {
              jwt: {
                refreshToken: 'string',
                accessToken: 'string'
              },
              profile: profile
            }
          };
          resolve(response);
        } else {
          // Simulate an error response
          const errorResponse = {
            response: {
              data: {
                error: "wrong credentials"
              }
            }
          };
          reject(errorResponse);
        }
      }, 1000);
    });
  },
  signup(username: string, email: string, firstName: string, lastName: string, password: string) {
    console.log("Signing un with", "Username: " + username, "Email: " + email, "First name: " + firstName, "Last name: " + lastName, "Password: " + password)
    return new Promise((resolve, reject) => {
      // Simulating a delay of 1 second before resolving the promise
      setTimeout(() => {
        if (username !== 'tonio') {
          // Simulate a successful response
          const response = { data: { message: 'Account created' } };
          resolve(response);
        } else {
          // Simulate an error response
          const errorResponse = {
            response: {
              data: {
                error: "Username already exists"
              }
            }
          };
          reject(errorResponse);
        }

      }, 1000);
    });
  },
  resetPasswordRequest(email: string) {
    console.log("Requesting password reset with", "Email: " + email)
    return new Promise((resolve, reject) => {
      // Simulating a delay of 1 second before resolving the promise
      setTimeout(() => {
        // Simulate a successful response
        const response = { data: { message: 'An email has been sent' } };
        resolve(response);
      }, 1000);
    });
  },
  signout() {
    console.log("Sending sign out request")
    fakeAuthProvider.isAuthenticated = false;
    return new Promise((resolve, reject) => {
      // Simulating a delay of 1 second before resolving the promise
      setTimeout(() => {
        // Simulate a successful response
        const response = { data: {} };
        resolve(response);
      }, 1000);
    });
  },
};

export default fakeAuthProvider;