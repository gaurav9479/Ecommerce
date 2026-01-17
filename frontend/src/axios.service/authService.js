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
                console.warn("Session expired. Redirecting to login...");

                if (window.location.pathname !== "/login" && !window.location.pathname.startsWith("/admin/login")) {
                    const isAdminRoute = window.location.pathname.startsWith("/admin");
                    window.location.href = isAdminRoute ? "/admin/login" : "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
