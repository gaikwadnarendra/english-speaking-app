import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // 3-Day Guest Trial Tracker
  const [trialStart, setTrialStart] = useState(null);
  const [daysElapsed, setDaysElapsed] = useState(0);

  const trialDaysTotal = 3;
  const currentTrialDay = Math.min(3, daysElapsed + 1);
  const trialDaysLeft = Math.max(0, trialDaysTotal - daysElapsed);
  const isTrialActive = !Boolean(user) && daysElapsed < trialDaysTotal;
  const isTrialExpired = !Boolean(user) && daysElapsed >= trialDaysTotal;

  // Load user token and trial info on startup
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('user_token');
        const storedUser = await AsyncStorage.getItem('user_data');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }

        let storedTrialStart = await AsyncStorage.getItem('trial_start_time');
        if (!storedTrialStart) {
          storedTrialStart = Date.now().toString();
          await AsyncStorage.setItem('trial_start_time', storedTrialStart);
        }
        const startTimestamp = parseInt(storedTrialStart, 10);
        setTrialStart(startTimestamp);
        const elapsed = Math.floor((Date.now() - startTimestamp) / (1000 * 60 * 60 * 24));
        setDaysElapsed(elapsed);

        // If token exists, verify with /api/auth/me in background
        if (storedToken) {
          try {
            const res = await api.get('/auth/me');
            if (res.data?.user) {
              setUser(res.data.user);
              await AsyncStorage.setItem('user_data', JSON.stringify(res.data.user));
            }
          } catch (e) {
            console.log('Background auth verify notice:', e.message);
          }
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.token) {
        await AsyncStorage.setItem('user_token', res.data.token);
        await AsyncStorage.setItem('user_data', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthModalOpen(false);
        return { success: true, data: res.data };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'लॉगिन अयशस्वी झाले.';
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, ui_language = 'mr') => {
    try {
      const res = await api.post('/auth/register', { name, email, password, ui_language });
      if (res.data?.token) {
        await AsyncStorage.setItem('user_token', res.data.token);
        await AsyncStorage.setItem('user_data', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthModalOpen(false);
        return { success: true, data: res.data };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'नोंदणी अयशस्वी झाली.';
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user_token');
      await AsyncStorage.removeItem('user_data');
      setToken(null);
      setUser(null);
    } catch (err) {
      console.warn('Logout error:', err);
    }
  };

  const simulateTrialExpiry = async () => {
    const fourDaysAgo = Date.now() - (4 * 24 * 60 * 60 * 1000);
    await AsyncStorage.setItem('trial_start_time', fourDaysAgo.toString());
    setTrialStart(fourDaysAgo);
    setDaysElapsed(4);
  };

  const resetTrial = async () => {
    const now = Date.now();
    await AsyncStorage.setItem('trial_start_time', now.toString());
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
