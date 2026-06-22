import React, { createContext, useCallback, useEffect, useState } from 'react';
import { apiGet, getToken, removeToken, setToken } from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load user data from token on app start
   */
  const loadUser = useCallback(async () => {
    try {
      const savedToken = await getToken();
      if (savedToken) {
        setTokenState(savedToken);
        // Fetch user profile with the token
        const profile = await apiGet('/api/profile');
        setUser(profile.user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      // Token might be invalid, clear it
      await removeToken();
      setTokenState(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login user and store token
   */
  const login = useCallback(async (userData, authToken) => {
    setUser(userData);
    setTokenState(authToken);
    await setToken(authToken);
  }, []);

  /**
   * Logout user and clear data
   */
  const logout = useCallback(async () => {
    setUser(null);
    setTokenState(null);
    await removeToken();
  }, []);

  /**
   * Load user on app start
   */
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    loadUser,
    isLoggedIn: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
