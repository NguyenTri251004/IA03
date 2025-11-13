import { createContext, useState, useCallback, useEffect } from 'react';
import { registerAuthState } from '../api/axiosClient';

const AuthContext = createContext(null);

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize token from memory on mount
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const setTokens = useCallback((access, refresh) => {
    setAccessToken(access);
    // Store refresh token in localStorage for persistence
    if (refresh) {
      localStorage.setItem('refreshToken', refresh);
    }
  }, []);

  const clearTokens = useCallback(() => {
    setAccessToken(null);
    localStorage.removeItem('refreshToken');
  }, []);

  const getRefreshToken = useCallback(() => {
    return localStorage.getItem('refreshToken');
  }, []);

  const value = {
    accessToken,
    isLoading,
    setTokens,
    clearTokens,
    getRefreshToken,
    isAuthenticated: !!accessToken,
  };

  // Register auth state with Axios interceptors
  useEffect(() => {
    registerAuthState({
      accessToken,
      setTokens,
      clearTokens,
      getRefreshToken,
    });
  }, [accessToken, setTokens, clearTokens, getRefreshToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
