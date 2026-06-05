import axios from "axios";

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        const res = await axios.post(
          "http://127.0.0.1:8000/api/user/token/refresh/",
          { refresh }
        );

        // Save new access token
        localStorage.setItem("access", res.data.access);

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);

      } catch (err) {
        
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

      }
    }

    return Promise.reject(error);
  }
);

export default api;