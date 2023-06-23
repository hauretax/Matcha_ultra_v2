import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  config.headers['Authorization'] =  token ? `Bearer ${token}` : '';
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;
      
      const response = await axios.post('/api/refresh', {
        'refreshToken': localStorage.getItem('refreshToken'),
      });

      if (response.status === 201) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return axiosInstance(originalRequest);
      }

    }

    return Promise.reject(error);
  }
);

export default axiosInstance;