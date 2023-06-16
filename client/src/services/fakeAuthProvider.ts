import { UserPayload } from "../../../comon_src/type/user.type"

interface UserResponse {
  data: UserPayload;
}

const fakeAuthProvider = {
  isAuthenticated: false,
  signin(username: string, password: string, callback: VoidFunction): UserResponse {
    fakeAuthProvider.isAuthenticated = true;
    console.log("Signing in with", "Username: " + username, "Password: " + password)
    if (username === 'tonio' && password === 'antoine') {
      setTimeout(callback, 100); // fake async
      return {
        data: {
          jwtToken: 'i am a token',
          profile: {
            username: 'tonio',
            email: 'tonio@gmail.com',
            lastName: 'Labalette',
            firstName: 'Antoine',
            emailVerified: false
          }
        }
      }
    } else {
      throw new Error('wrong credentials');
    }
  },
  signup(username: string, email: string, firstName: string, lastName: string, password: string, callback: VoidFunction): void {
    console.log("Signing in with", "Username: " + username, "Email: " + email, "First name: " + firstName, "Last name: " + lastName, "Password: " + password)
    if (username !== 'tonio') {
      setTimeout(callback, 100); // fake async
    } else {
      throw new Error('user already exists');
    }
  },
  resetPasswordRequest(email: string, callback: VoidFunction): void {
    console.log("Requesting password reset with", "Email: " + email)
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    console.log("Signing out")
    fakeAuthProvider.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};

export { fakeAuthProvider };