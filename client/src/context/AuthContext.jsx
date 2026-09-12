import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // 3-Day Guest Trial Tracker
  const [trialStart, setTrialStart] = useState(() => {
    let stored = localStorage.getItem('trial_start_time');
    if (!stored) {
      stored = Date.now().toString();
      localStorage.setItem('trial_start_time', stored);
    }
    return parseInt(stored, 10);
  });

  const [daysElapsed, setDaysElapsed] = useState(() => {
    const start = parseInt(localStorage.getItem('trial_start_time') || Date.now().toString(), 10);
    return Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
  });

  // Calculate remaining trial days (3 days total: Day 1, Day 2, Day 3)
  const trialDaysTotal = 3;
  const currentTrialDay = Math.min(3, daysElapsed + 1);
  const trialDaysLeft = Math.max(0, trialDaysTotal - daysElapsed);
  const isTrialActive = !Boolean(user) && daysElapsed < trialDaysTotal;
  const isTrialExpired = !Boolean(user) && daysElapsed >= trialDaysTotal;

  // Load current user profile on boot if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await fetchMe();
          if (res.data?.user) {
            setUser(res.data.user);
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setAuthLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthModalOpen(false);
      return res.data;
    }
  };

  const register = async (name, email, password, ui_language = 'mr') => {
    const res = await registerUser({ name, email, password, ui_language });
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthModalOpen(false);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Helper for manual testing to simulate expired trial
  const simulateTrialExpiry = () => {
    const fourDaysAgo = Date.now() - (4 * 24 * 60 * 60 * 1000);
    localStorage.setItem('trial_start_time', fourDaysAgo.toString());
    setTrialStart(fourDaysAgo);
    setDaysElapsed(4);
  };

  const resetTrial = () => {
    const now = Date.now();
    localStorage.setItem('trial_start_time', now.toString());
    setTrialStart(now);
    setDaysElapsed(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        authLoading,
        // Trial properties
        trialDaysTotal,
        currentTrialDay,
        trialDaysLeft,
        isTrialActive,
        isTrialExpired,
        simulateTrialExpiry,
        resetTrial
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
