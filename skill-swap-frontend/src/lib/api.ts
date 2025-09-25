// lib/api.ts

import { supabase } from '../utils/supabase';
import { mockUser, mockUsers, mockWorkshops, mockTransactions } from './mock-data';

// ----------------------
// AUTH API
// ----------------------
export const authAPI = {
  // Real Google OAuth (works as sign-in & sign-up automatically)
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/home` },
    });
    if (error) throw error;
    return data;
  },

  // Mock sign-in (just return the first mock user)
  signInMock: async () => {
    return mockUsers[0]; // ✅ always use the first mock user
  },

  // Mock sign-up (local only, creates a fake user object)
  signUpMock: async (email: string, name: string) => {
    const newUser = {
      id: 'mock-user-' + Date.now(),
      email,
      name,
      avatar: 'https://placehold.co/150x150',
      credits: 50,
      bio: '',
      skills: [],
      totalWorkshopsHosted: 0,
      totalWorkshopsAttended: 0,
      rating: 0,
      joinedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser); // add to in-memory list
    return newUser;
  },

  // Sign out (real Supabase)
  signOut: async () => {
    await supabase.auth.signOut();
  },

  // Get current Supabase session + JWT
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    const session = data.session;
    return {
      session, // full session object
      accessToken: session?.access_token ?? null, // 🔑 JWT token
      user: session?.user ?? null, // basic user info
    };
  },

  // Always return a user (Supabase user if logged in, otherwise first mock user)
  getUser: async () => {
    const { session } = await supabase.auth.getSession();
    if (session?.user) {
      return session.user;
    }
    return mockUsers[0]; // fallback mock user
  },
};

// ----------------------
// USER API
// ----------------------
export const userAPI = {
  // Mock profile (pretend current user is mockUser)
  getProfile: async () => mockUser,

  // Update profile locally
  updateProfile: async (updates: any) => {
    Object.assign(mockUser, updates);
    return { ...mockUser };
  },
};

// ----------------------
// WORKSHOP API
// ----------------------
export const workshopAPI = {
  getAll: async () => mockWorkshops,

  getById: async (id: string) =>
    mockWorkshops.find((w) => w.id === id) || null,

  create: async (data: any) => {
    const newWorkshop = {
      id: 'workshop-' + Date.now(),
      status: 'upcoming',
      participants: [],
      ...data,
    };
    mockWorkshops.push(newWorkshop);
    return newWorkshop;
  },

  join: async (workshopId: string, userId: string) => {
    const workshop = mockWorkshops.find((w) => w.id === workshopId);
    if (workshop) {
      if (!workshop.participants.some((p) => p.id === userId)) {
        workshop.participants.push({ id: userId });
      }
    }
    return workshop;
  },
};

// ----------------------
// TRANSACTION API
// ----------------------
export const transactionAPI = {
  getAll: async () => mockTransactions,

  add: async (tx: any) => {
    const newTx = {
      id: 'tx-' + Date.now(),
      timestamp: new Date().toISOString(),
      ...tx,
    };
    mockTransactions.push(newTx);
    return newTx;
  },
};
S