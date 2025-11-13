import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store auth state callbacks
let authState = {
  accessToken: null,
  setTokens: null,
  clearTokens: null,
  getRefreshToken: null,
};

// Register auth state callbacks (called from AuthProvider setup)
export const registerAuthState = (state) => {
  authState = { ...authState, ...state };
};

// Request interceptor: Attach access token to every request
apiClient.interceptors.request.use(
  (config) => {
    if (authState.accessToken) {
      config.headers.Authorization = `Bearer ${authState.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Do not attempt refresh/redirect for auth endpoints (login/register/refresh-token)
      const url = originalRequest.url || originalRequest?.baseURL || '';
      if (typeof url === 'string' && (
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/refresh-token')
      )) {
        // Let the error propagate so callers (e.g. login mutation) can handle it
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        const refreshToken = authState.getRefreshToken?.();
        
        if (!refreshToken) {
          // No refresh token available, logout user
          authState.clearTokens?.();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Try to refresh the token using axios directly (not apiClient to avoid interceptor loop)
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens
        authState.setTokens?.(accessToken, newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        authState.clearTokens?.();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
