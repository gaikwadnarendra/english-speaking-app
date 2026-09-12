import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Deployed Render backend URL + Local fallback option
export const API_BASE_URL = 'https://english-speaking-app-ul3o.onrender.com/api';
export const LOCAL_DEV_API_URL = 'http://10.0.2.2:5000/api'; // Android Emulator alias

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token automatically from AsyncStorage
api.interceptors.request.use(async (config) => {
  try {
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
