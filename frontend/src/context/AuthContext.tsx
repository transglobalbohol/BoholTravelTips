import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

// Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// Action Types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

// Initial State
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Create Context
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user data
      validateToken(token);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Set the token in localStorage so authService can use it
      localStorage.setItem('token', token);
      
      const response = await authService.getProfile();
      
      if (response.success) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.user, token },
        });
      } else {
        localStorage.removeItem('token');
        dispatch({ type: 'AUTH_FAILURE' });
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_FAILURE' });
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await authService.login({ email, password });

      if (response.success) {
        localStorage.setItem('token', response.token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.user, token: response.token },
        });
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await authService.register(userData);

      if (response.success) {
        localStorage.setItem('token', response.token);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.user, token: response.token },
        });
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      const response = await authService.updateProfile(userData);

      if (response.success) {
        dispatch({ type: 'UPDATE_USER', payload: response.user });
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Profile update failed');
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};