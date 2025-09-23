import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-d985f1e8`;

// Helper function to create fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 8000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// Helper function to get authorization headers
const getAuthHeaders = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': session?.access_token ? `Bearer ${session.access_token}` : `Bearer ${publicAnonKey}`,
    };
  } catch (error) {
    console.warn('Auth header error, using anon key:', error);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    };
  }
};

// Auth functions
export const authAPI = {
  signUp: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    
    return response.json();
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// User functions
export const userAPI = {
  getProfile: async () => {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${API_BASE}/user/profile`, {
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get profile');
    }
    
    return response.json();
  },

  updateProfile: async (updates: any) => {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${API_BASE}/user/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }
    
    return response.json();
  },
};

// Workshop functions
export const workshopAPI = {
  getAll: async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/workshops`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get workshops');
      }
      
      return response.json();
    } catch (error) {
      console.warn('Workshop API call failed, this is expected in demo mode:', error);
      throw error;
    }
  },

  create: async (workshopData: any) => {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${API_BASE}/workshops`, {
      method: 'POST',
      headers,
      body: JSON.stringify(workshopData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create workshop');
    }
    
    return response.json();
  },

  attend: async (workshopId: string) => {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${API_BASE}/workshops/${workshopId}/attend`, {
      method: 'POST',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to attend workshop');
    }
    
    return response.json();
  },

  cancel: async (workshopId: string) => {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${API_BASE}/workshops/${workshopId}/attend`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel workshop');
    }
    
    return response.json();
  },
};

// Transaction functions
export const transactionAPI = {
  getAll: async () => {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${API_BASE}/transactions`, {
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get transactions');
    }
    
    return response.json();
  },
};