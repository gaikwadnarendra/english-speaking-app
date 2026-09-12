import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authentication API
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (data) => api.post('/auth/register', data);
export const fetchMe = () => api.get('/auth/me');

// Gemini AI Speaking Conversation API
export const fetchScenarios = () => api.get('/speaking/scenarios');
export const sendAIConversationMessage = (data) => api.post('/speaking/ai-conversation', data);

// Vocabulary API
export const fetchVocab = (params) => api.get('/vocab', { params });
export const fetchCategories = () => api.get('/vocab/categories');
export const toggleFavoriteWord = (id) => api.post(`/vocab/${id}/toggle-favorite`);

// Verbs API
export const fetchVerbs = (params) => api.get('/verbs', { params });

// Lessons API
export const fetchLessons = (params) => api.get('/lessons', { params });
export const markLessonComplete = (id) => api.post(`/lessons/${id}/complete`);

// Practice & Quiz API
export const fetchQuizzes = (params) => api.get('/practice/quiz', { params });
export const submitQuiz = (data) => api.post('/practice/submit', data);

// SRS Spaced Repetition API
export const fetchDueSRS = () => api.get('/srs/due');
export const fetchSRSStats = () => api.get('/srs/stats');
export const updateSRSWord = (data) => api.post('/srs/answer', data);

// Progress & Settings API
export const fetchProgress = () => api.get('/progress');
export const incrementDailyStreak = () => api.post('/progress/streak');
export const updateUserSettings = (data) => api.post('/progress/settings', data);
export const resetUserProgress = () => api.post('/progress/reset');

export default api;
