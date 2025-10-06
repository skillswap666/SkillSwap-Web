import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  credits: number;
}

class ApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    return headers;
  }

  async getUserProfile(): Promise<User> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_URL}/users/profile`, { headers });
    
    if (!res.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return res.json();
  }

  async updateUserProfile(data: { name?: string; bio?: string }): Promise<User> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error('Failed to update profile');
    }
    
    return res.json();
  }
}

export const apiService = new ApiService();
