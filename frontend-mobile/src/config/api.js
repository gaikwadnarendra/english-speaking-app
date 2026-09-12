import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Deployed Render backend URL
export const API_BASE_URL = 'https://english-speaking-app-ul3o.onrender.com/api';
export const LOCAL_DEV_API_URL = 'http://10.0.2.2:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Normalize request URLs so that both '/vocab' and '/api/vocab' work seamlessly
api.interceptors.request.use(async (config) => {
  try {
    if (config.url && config.url.startsWith('/api/')) {
      config.url = config.url.replace('/api/', '/');
    }
    const token = await AsyncStorage.getItem('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.warn('Token read error:', e);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

