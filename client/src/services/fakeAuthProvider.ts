import { UserPayload } from "../../../comon_src/type/user.type"

interface UserResponse {
  data: UserPayload;
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
              jwtToken: 'i am a token',
              profile: {
                username: 'tonio',
                email: 'tonio@gmail.com',
                lastName: 'Labalette',
                firstName: 'Antoine',
                emailVerified: false,
                profilePicture: process.env.PUBLIC_URL + '/images/profilePicture.png'
              }
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