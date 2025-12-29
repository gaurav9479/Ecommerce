import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1`,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized — redirecting to login...");
        }
        return Promise.reject(error);
    }
);

export default api;
