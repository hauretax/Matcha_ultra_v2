import axios from 'axios';

const api = {
  signup: (username: string, email: string, firstName: string, lastName: string, password: string) => {
    return axios.post('http://localhost:8080/api/register', {
      email,
      username,
      lastName,
      firstName,
      password,
    })
  },

  verifyEmail: (code: string, email: string) => {
    return axios.get(`http://localhost:8080/api/verify_email?code=${code}&email=${email}`);
  },

  signin: (username: string, password: string) => {
    return axios.post('http://localhost:8080/api/login', {
      username,
      password,
    })
  },

  resetPasswordRequest: (email: string) => {
    return axios.post('http://localhost:8080/api/request_password_reset', {
      email,
    });
  },

  resetPassword: (code: string, newPassword: string, email: string) => {
    return axios.post('http://localhost:8080/api/reset_password', {
      code,
      newPassword,
      email
    });
  },

  signout: () => {
    return axios.post('http://localhost:8080/api/logout');
  }
}

export default api;
