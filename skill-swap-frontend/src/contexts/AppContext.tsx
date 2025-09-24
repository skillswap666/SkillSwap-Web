import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Workshop, CreditTransaction } from '../types';
import { mockUser, mockWorkshops, mockTransactions } from '../lib/mock-data';
import { authAPI, userAPI, workshopAPI, transactionAPI } from '../lib/api';
import { toast } from 'sonner@2.0.3';

interface AppContextType {
  user: User | null;
  workshops: Workshop[];
  transactions: CreditTransaction[];
  currentPage: string;
  isDarkMode: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  setCurrentPage: (page: string) => void;
  toggleDarkMode: () => void;
  attendWorkshop: (workshopId: string) => Promise<void>;
  cancelWorkshopAttendance: (workshopId: string) => Promise<void>;
  createWorkshop: (workshopData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('skill-swap-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (savedTheme === null && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Check for existing session on load
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const session = await authAPI.getSession();
      if (session) {
        await loadUserData();
      } else {
        // Load workshops even for unauthenticated users
        await loadWorkshops();
        // Use mock user for demo purposes
        setUser(mockUser);
        setTransactions(mockTransactions);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Fallback to mock data for demo
      setUser(mockUser);
      setWorkshops(mockWorkshops);
      setTransactions(mockTransactions);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const [profileRes, transactionsRes] = await Promise.all([
        userAPI.getProfile(),
        transactionAPI.getAll()
      ]);
      
      setUser(profileRes.user);
      setTransactions(transactionsRes.transactions);
      setIsAuthenticated(true);
      
      await loadWorkshops();
    } catch (error) {
      console.error('Load user data error:', error);
      toast.error('Failed to load user data');
    }
  };

  const loadWorkshops = async () => {
    try {
      const { workshops: workshopData } = await workshopAPI.getAll();
      setWorkshops(workshopData);
    } catch (error) {
      console.error('Load workshops error:', error);
      // Fallback to mock data
      setWorkshops(mockWorkshops);
    }
  };

  const refreshData = async () => {
    if (isAuthenticated) {
      await loadUserData();
    } else {
      await loadWorkshops();
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('skill-swap-theme', newDarkMode ? 'dark' : 'light');
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authAPI.signIn(email, password);
      if (result.success) {
        await loadUserData();
        setCurrentPage('dashboard');
        toast.success('Signed in successfully!');
      } else {
        throw new Error(result.message || 'Sign in failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const result = await authAPI.signUp(name, email, password);
      if (result.success) {
        await loadUserData();
        setCurrentPage('dashboard');
        toast.success('Account created successfully!');
      } else {
        throw new Error(result.message || 'Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authAPI.signOut();
      setUser(null);
      setWorkshops([]);
      setTransactions([]);
      setIsAuthenticated(false);
      setCurrentPage('home');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const attendWorkshop = async (workshopId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to attend workshops');
      setCurrentPage('auth');
      return;
    }

    try {
      const result = await workshopAPI.attend(workshopId);
      
      // Update local state
      setWorkshops(prev => prev.map(w => 
        w.id === workshopId 
          ? { ...w, currentParticipants: w.currentParticipants + 1, participants: [...w.participants, user!] }
          : w
      ));
      
      // Update user credits
      if (user) {
        const workshop = workshops.find(w => w.id === workshopId);
        if (workshop) {
          setUser(prev => prev ? { ...prev, credits: prev.credits - workshop.creditCost } : null);
        }
      }
      
      toast.success('Successfully joined workshop!');
    } catch (error) {
      console.error('Attend workshop error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to join workshop');
    }
  };

  const cancelWorkshopAttendance = async (workshopId: string) => {
    try {
      await workshopAPI.cancelAttendance(workshopId);
      
      // Update local state
      setWorkshops(prev => prev.map(w => 
        w.id === workshopId 
          ? { ...w, currentParticipants: w.currentParticipants - 1, participants: w.participants.filter(p => p.id !== user?.id) }
          : w
      ));
      
      // Update user credits
      if (user) {
        const workshop = workshops.find(w => w.id === workshopId);
        if (workshop) {
          setUser(prev => prev ? { ...prev, credits: prev.credits + workshop.creditCost } : null);
        }
      }
      
      toast.success('Workshop attendance cancelled');
    } catch (error) {
      console.error('Cancel attendance error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to cancel workshop');
    }
  };

  const createWorkshop = async (workshopData: any) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to create workshops');
      setCurrentPage('auth');
      return;
    }

    try {
      const result = await workshopAPI.create(workshopData);
      
      // Add to local state
      setWorkshops(prev => [result.workshop, ...prev]);
      
      toast.success('Workshop created successfully!');
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Create workshop error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create workshop');
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      workshops,
      transactions,
      currentPage,
      isDarkMode,
      isAuthenticated,
      isLoading,
      setCurrentPage,
      toggleDarkMode,
      attendWorkshop,
      cancelWorkshopAttendance,
      createWorkshop,
      signIn,
      signUp,
      signOut,
      refreshData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
