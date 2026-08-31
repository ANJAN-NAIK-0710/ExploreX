import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserPreferences } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'forgot';
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (prefs: UserPreferences) => Promise<void>;
  toggleSaveDestination: (destinationId: string) => Promise<void>;
  toggleSavePackage: (packageId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const { success, error } = useToast();

  const refreshProfile = useCallback(async () => {
    try {
      const data = await api.getProfile();
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.login(email, pass);
      setUser(res.user);
      closeAuthModal();
      success('Welcome back!', `Logged in as ${res.user.name}`);
      return true;
    } catch (err: any) {
      error('Login Failed', err.message || 'Invalid credentials');
      return false;
    }
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.signup(name, email, pass);
      setUser(res.user);
      closeAuthModal();
      success('Account Created!', `Welcome to WanderAI, ${name}!`);
      return true;
    } catch (err: any) {
      error('Signup Failed', err.message || 'Could not create account');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      success('Logged out', 'You have been safely logged out.');
      // Refresh dummy user profile
      refreshProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updated = await api.updateProfile(updates);
      setUser(updated);
      success('Profile Updated', 'Your profile details were saved successfully.');
    } catch (err: any) {
      error('Update Failed', err.message || 'Failed to update profile');
    }
  };

  const updatePreferences = async (prefs: UserPreferences) => {
    try {
      const updated = await api.updatePreferences(prefs);
      setUser(updated);
      success('Preferences Saved', 'AI personalized recommendations updated.');
    } catch (err: any) {
      error('Update Failed', err.message);
    }
  };

  const toggleSaveDestination = async (destinationId: string) => {
    try {
      const updated = await api.toggleSaveDestination(destinationId);
      const isSaved = updated.savedDestinations.includes(destinationId);
      setUser(updated);
      success(isSaved ? 'Destination Saved' : 'Removed from Saved', isSaved ? 'Added to your travel wishlist' : 'Removed from wishlist');
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  const toggleSavePackage = async (packageId: string) => {
    try {
      const updated = await api.toggleSavePackage(packageId);
      const isSaved = updated.savedPackages.includes(packageId);
      setUser(updated);
      success(isSaved ? 'Package Saved' : 'Removed from Saved', isSaved ? 'Added to saved packages' : 'Removed from saved');
    } catch (err: any) {
      error('Error', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        updateProfile,
        updatePreferences,
        toggleSaveDestination,
        toggleSavePackage,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
