import { apiClient } from './api';
import { User, RegisterData, LoginFormData } from '../types';

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message: string;
}

export const authService = {
  // Register a new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<{ success: boolean; user: User; message: string }> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<{ success: boolean; user: User; message: string }> => {
    const response = await apiClient.put('/auth/profile', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (resetData: {
    token: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/reset-password', resetData);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  },

  // Resend verification email
  resendVerification: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/resend-verification');
    return response.data;
  },
};

export default authService;