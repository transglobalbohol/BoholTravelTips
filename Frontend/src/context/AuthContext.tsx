import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { SecureStorage, logSecurityEvent } from '../utils/security';
import SecureApiService from '../services/secureApi';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'partner';
  profileImage?: string;
  isActive: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  isLocked: boolean;
  lockoutExpires: number | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'INCREMENT_LOGIN_ATTEMPTS' }
  | { type: 'RESET_LOGIN_ATTEMPTS' }
  | { type: 'LOCK_ACCOUNT'; payload: number }
  | { type: 'UNLOCK_ACCOUNT' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  loginAttempts: 0,
  isLocked: false,
  lockoutExpires: null
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginAttempts: 0,
        isLocked: false,
        lockoutExpires: null
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };

    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
        loginAttempts: state.loginAttempts, // Preserve login attempts across logout
        isLocked: state.isLocked,
        lockoutExpires: state.lockoutExpires
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };

    case 'INCREMENT_LOGIN_ATTEMPTS':
      const newAttempts = state.loginAttempts + 1;
      return {
        ...state,
        loginAttempts: newAttempts,
        ...(newAttempts >= 5 && {
          isLocked: true,
          lockoutExpires: Date.now() + 15 * 60 * 1000 // 15 minutes lockout
        })
      };

    case 'RESET_LOGIN_ATTEMPTS':
      return {
        ...state,
        loginAttempts: 0,
        isLocked: false,
        lockoutExpires: null
      };

    case 'LOCK_ACCOUNT':
      return {
        ...state,
        isLocked: true,
        lockoutExpires: action.payload
      };

    case 'UNLOCK_ACCOUNT':
      return {
        ...state,
        isLocked: false,
        lockoutExpires: null,
        loginAttempts: 0
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Auth context interface
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<void>;
  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export AuthContext for components that need direct access
export { AuthContext };
export type { AuthContextType, User };

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Auto-unlock account after lockout period
  useEffect(() => {
    if (state.isLocked && state.lockoutExpires) {
      const timeoutId = setTimeout(() => {
        if (Date.now() >= state.lockoutExpires!) {
          dispatch({ type: 'UNLOCK_ACCOUNT' });
        }
      }, state.lockoutExpires - Date.now());

      return () => clearTimeout(timeoutId);
    }
  }, [state.isLocked, state.lockoutExpires]);

  // Auto-logout on token expiration
  useEffect(() => {
    if (state.token) {
      try {
        const payload = JSON.parse(atob(state.token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        
        if (expirationTime <= currentTime) {
          logout();
          logSecurityEvent('token_expired');
        } else {
          // Set timeout to logout when token expires
          const timeoutId = setTimeout(() => {
            logout();
            logSecurityEvent('token_expired');
          }, expirationTime - currentTime);

          return () => clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        logout();
      }
    }
  }, [state.token]);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const token = SecureStorage.getItem('authToken');
      const userProfile = SecureStorage.getItem('userProfile');

      if (token && userProfile) {
        const user = JSON.parse(userProfile);
        
        // Validate token with server
        try {
          const response = await SecureApiService.getProfile();
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: response.user, token }
          });
        } catch (error) {
          // Token invalid, clear local storage
          SecureStorage.clear();
          dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: 'No authentication found' });
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication check failed' });
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    if (state.isLocked) {
      throw new Error(`Account is locked. Please try again after ${Math.ceil((state.lockoutExpires! - Date.now()) / 60000)} minutes.`);
    }

    dispatch({ type: 'AUTH_START' });

    try {
      const response = await SecureApiService.login({ email, password });
      
      if (response.success) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.user, token: response.token }
        });

        logSecurityEvent('login_success', { userId: response.user.id, email });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      dispatch({ type: 'INCREMENT_LOGIN_ATTEMPTS' });
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });

      logSecurityEvent('login_failed', { 
        email, 
        attempts: state.loginAttempts + 1,
        error: errorMessage 
      });

      throw error;
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await SecureApiService.register(userData);
      
      if (response.success) {
        // Don't auto-login after registration for security
        dispatch({ type: 'AUTH_FAILURE', payload: 'Registration successful. Please verify your email and login.' });
        
        logSecurityEvent('registration_success', { email: userData.email });
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });

      logSecurityEvent('registration_failed', { 
        email: userData.email,
        error: errorMessage 
      });

      throw error;
    }
  };

  const logout = (): void => {
    SecureStorage.clear();
    dispatch({ type: 'LOGOUT' });
    
    logSecurityEvent('logout', { userId: state.user?.id });

    // Optional: Call server logout endpoint
    SecureApiService.logout().catch(() => {
      // Ignore logout errors
    });
  };

  const updateProfile = async (profileData: any): Promise<void> => {
    try {
      const response = await SecureApiService.updateProfile(profileData);
      
      if (response.success) {
        dispatch({ type: 'UPDATE_USER', payload: response.user });
        logSecurityEvent('profile_updated', { userId: state.user?.id });
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      
      logSecurityEvent('profile_update_failed', { 
        userId: state.user?.id,
        error: errorMessage 
      });

      throw error;
    }
  };

  const changePassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    try {
      const response = await SecureApiService.changePassword(passwordData);
      
      if (response.success) {
        logSecurityEvent('password_changed', { userId: state.user?.id });
        
        // Force re-authentication after password change
        logout();
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Password change failed';
      
      logSecurityEvent('password_change_failed', { 
        userId: state.user?.id,
        error: errorMessage 
      });

      throw error;
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Higher-order component for protected routes
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'admin' | 'partner';
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return fallback || <div>Please log in to access this page.</div>;
  }

  if (requiredRole && user?.role !== requiredRole) {
    logSecurityEvent('unauthorized_route_access', {
      userId: user?.id,
      requiredRole,
      userRole: user?.role
    });
    
    return fallback || <div>Access denied. Insufficient privileges.</div>;
  }

  return <>{children}</>;
};

// Export as default
export default AuthProvider;
