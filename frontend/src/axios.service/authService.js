import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1`,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                await axios.post(
                    `${import.meta.env.VITE_API_URL || "http://localhost:9000"}/api/v1/users/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                console.warn("Session expired. Redirecting to login...");
                // If refresh fails, clear any client-side auth state if managed there
                if (window.location.pathname !== "/login" && !window.location.pathname.startsWith("/admin/login")) {
                    // Determine where to redirect based on if it was likely an admin action
                    const isAdminRoute = window.location.pathname.startsWith("/admin");
                    window.location.href = isAdminRoute ? "/admin/login" : "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
