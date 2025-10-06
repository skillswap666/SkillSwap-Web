const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function fetchUserProfile() {
  const session = await getCurrentSession();
  if (!session?.access_token) {
    throw new Error('No valid session found');
  }

  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { 
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  return res.json();
}

async function getCurrentSession() {
  const { supabase } = await import('../services/supabaseClient');
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return session;
}
