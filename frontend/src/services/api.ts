import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  credits: number;
  skills?: string[];
  rating?: number | null;
  profilePicture?: string | null;
  hostedWorkshops?: any[];
  attendedWorkshops?: any[];
}

class ApiService {
  // -------------------------------
  // 🔐 Helper: get auth headers
  // -------------------------------
  private async getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      console.warn('⚠️ No Supabase session found. User may not be logged in.');
    } else {
      console.log('✅ Supabase access token:', session.access_token.substring(0, 15) + '...');
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
    };

    return headers;
  }

  // -------------------------------
  // 🌐 Helper: fetch wrapper
  // -------------------------------
  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ API ${res.status} Error:`, text);
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  // -------------------------------
  // 👤 GET user profile
  // -------------------------------
  async getUserProfile(): Promise<User> {
    return this.fetchWithAuth<User>('/users/profile');
  }

  // -------------------------------
  // ✏️ UPDATE user profile
  // -------------------------------
  async updateUserProfile(data: {
    name?: string;
    bio?: string;
    skills?: string[];
    profilePicture?: string;
  }): Promise<User> {
    return this.fetchWithAuth<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
