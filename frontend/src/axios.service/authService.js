import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1`,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;


        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {

                await axios.post(
                    `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/users/refresh-token`,
                    {},
                    { withCredentials: true }
                );


                return api(originalRequest);
            } catch (refreshError) {
                console.warn("Session expired or refresh failed.");
                // Remove global redirect: let the frontend React components (PrivateRoutes, event handlers) 
                // manage redirects via react-router to avoid edge cases on public pages.
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
