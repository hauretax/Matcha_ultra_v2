import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:8080/api",
	headers: {
		"Content-Type": "application/json",
		"accept": "application/json"
	}
});

axiosInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem("accessToken");
	config.headers["Authorization"] = token ? `Bearer ${token}` : "";
	return config;
});

let isRefreshing = false;
let failedQueue: {resolve: (value: unknown) => void; reject: (reason?: unknown) => void}[] = [];

const processQueue = (error: unknown, token = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;

		if (error.response?.status === 403 && !originalRequest._retry) {
			originalRequest._retry = true;

			if (!isRefreshing) {
				isRefreshing = true;

				try {
					const response = await axiosInstance.post("/newToken", {
						"refreshToken": localStorage.getItem("refreshToken"),
					});

					if (response.status === 200) {
						localStorage.setItem("accessToken", response.data.token);
						localStorage.setItem("refreshToken", response.data.refreshToken);
						isRefreshing = false;
						processQueue(null, response.data.token);
						return axiosInstance(originalRequest);
					}
				} catch (err) {
					localStorage.removeItem("accessToken");
					localStorage.removeItem("refreshToken");
					localStorage.removeItem("matcha_user");
					isRefreshing = false;
					processQueue(err, null);
					window.location.href = "/login";
					return Promise.reject(err);
				}
			}

			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject });
			}).then(token => {
				originalRequest.headers["Authorization"] = "Bearer " + token;
				return axiosInstance(originalRequest);
			}).catch(err => {
				return Promise.reject(err);
			});
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;