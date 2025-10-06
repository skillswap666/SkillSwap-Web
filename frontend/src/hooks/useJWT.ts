import { useState, useEffect, useCallback } from 'react';
import { JWTUtils, SessionManager } from '../utils/jwt';

export interface TokenStatus {
  isValid: boolean;
  isExpired: boolean;
  timeUntilExpiry: number;
  needsRefresh: boolean;
  userId: string | null;
  email: string | null;
}

export const useJWT = () => {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>(() => {
    const token = SessionManager.getToken();
    if (!token) {
      return {
        isValid: false,
        isExpired: true,
        timeUntilExpiry: 0,
        needsRefresh: false,
        userId: null,
        email: null,
      };
    }

    return {
      isValid: !JWTUtils.isTokenExpired(token),
      isExpired: JWTUtils.isTokenExpired(token),
      timeUntilExpiry: JWTUtils.getTimeUntilExpiry(token),
      needsRefresh: JWTUtils.needsRefresh(token),
      userId: JWTUtils.getUserId(token),
      email: JWTUtils.getEmail(token),
    };
  });

  const updateTokenStatus = useCallback(() => {
    const token = SessionManager.getToken();
    if (!token) {
      setTokenStatus({
        isValid: false,
        isExpired: true,
        timeUntilExpiry: 0,
        needsRefresh: false,
        userId: null,
        email: null,
      });
      return;
    }

    setTokenStatus({
      isValid: !JWTUtils.isTokenExpired(token),
      isExpired: JWTUtils.isTokenExpired(token),
      timeUntilExpiry: JWTUtils.getTimeUntilExpiry(token),
      needsRefresh: JWTUtils.needsRefresh(token),
      userId: JWTUtils.getUserId(token),
      email: JWTUtils.getEmail(token),
    });
  }, []);

  // Update token status when localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        updateTokenStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [updateTokenStatus]);

  // Update token status every minute
  useEffect(() => {
    const interval = setInterval(updateTokenStatus, 60000); // 1 minute
    return () => clearInterval(interval);
  }, [updateTokenStatus]);

  const getToken = useCallback(() => {
    return SessionManager.getToken();
  }, []);

  const isAuthenticated = useCallback(() => {
    return SessionManager.isAuthenticated();
  }, []);

  const clearToken = useCallback(() => {
    SessionManager.clearAuthData();
    updateTokenStatus();
  }, [updateTokenStatus]);

  const setToken = useCallback((token: string, userData?: any) => {
    SessionManager.setAuthData(token, userData);
    updateTokenStatus();
  }, [updateTokenStatus]);

  return {
    tokenStatus,
    getToken,
    isAuthenticated,
    clearToken,
    setToken,
    updateTokenStatus,
  };
};
