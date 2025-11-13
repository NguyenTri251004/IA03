import { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/axiosClient';

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Hook for login mutation
export const useLogin = () => {
  const { setTokens } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Set tokens in auth context
      setTokens(data.accessToken, data.refreshToken);
      
      // Invalidate user query to refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const { clearTokens, getRefreshToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Optional: Call logout endpoint to invalidate refresh token on server
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          await apiClient.post('/auth/logout', { refreshToken });
        }
      } catch (error) {
        console.error('Logout API error:', error);
      }
    },
    onSuccess: () => {
      // Clear tokens
      clearTokens();
      
      // Clear all queries
      queryClient.clear();
    },
    onError: () => {
      // Even if logout request fails, clear tokens locally
      clearTokens();
      queryClient.clear();
    },
  });
};

// Hook for fetching user profile
export const useUser = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/user');
      return response.data.user;
    },
    enabled: isAuthenticated, // Only fetch if authenticated
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for register mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    },
  });
};
