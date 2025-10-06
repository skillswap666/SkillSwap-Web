// JWT Token utilities for frontend

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export class JWTUtils {
  /**
   * Decode JWT token without verification (client-side only)
   * Note: This is for display purposes only, never trust client-side validation
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): Date | null {
    const payload = this.decodeToken(token);
    if (!payload) return null;

    return new Date(payload.exp * 1000);
  }

  /**
   * Get time until token expires (in minutes)
   */
  static getTimeUntilExpiry(token: string): number {
    const payload = this.decodeToken(token);
    if (!payload) return 0;

    const now = Math.floor(Date.now() / 1000);
    const timeLeft = payload.exp - now;
    return Math.max(0, Math.floor(timeLeft / 60));
  }

  /**
   * Check if token needs refresh (expires within 5 minutes)
   */
  static needsRefresh(token: string): boolean {
    return this.getTimeUntilExpiry(token) <= 5;
  }

  /**
   * Get user ID from token
   */
  static getUserId(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.userId || null;
  }

  /**
   * Get user email from token
   */
  static getEmail(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.email || null;
  }
}

// Session management utilities
export class SessionManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_KEY = 'refresh_token';
  private static readonly USER_KEY = 'user_data';

  /**
   * Store authentication data
   */
  static setAuthData(token: string, userData?: any): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (userData) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    }
  }

  /**
   * Get stored token
   */
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored user data
   */
  static getUserData(): any | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Clear all authentication data
   */
  static clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !JWTUtils.isTokenExpired(token);
  }

  /**
   * Get token status
   */
  static getTokenStatus(): {
    isValid: boolean;
    isExpired: boolean;
    timeUntilExpiry: number;
    needsRefresh: boolean;
  } {
    const token = this.getToken();
    
    if (!token) {
      return {
        isValid: false,
        isExpired: true,
        timeUntilExpiry: 0,
        needsRefresh: false,
      };
    }

    const isExpired = JWTUtils.isTokenExpired(token);
    const timeUntilExpiry = JWTUtils.getTimeUntilExpiry(token);
    const needsRefresh = JWTUtils.needsRefresh(token);

    return {
      isValid: !isExpired,
      isExpired,
      timeUntilExpiry,
      needsRefresh,
    };
  }
}
