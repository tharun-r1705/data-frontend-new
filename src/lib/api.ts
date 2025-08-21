import axios from 'axios';
import { config } from '@/config';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data: { email: string; password: string; role: 'student' | 'teacher' }) =>
    api.post('/auth/signup', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: () => api.post('/auth/logout'),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
};

// Student API
export const studentAPI = {
  getProfile: () => api.get('/students/me', { params: { t: Date.now() } }),

  // Backend supports POST or PUT for upsert
  updateProfile: (data: any) => api.post('/students/me', data),

  unflagField: (data: { fieldName: string }) =>
    api.put('/students/me/unflag-field', data),
};

// Teacher API
export const teacherAPI = {
  flagStudentField: (studentId: string, data: { fieldName: string }) =>
    api.put(`/students/${studentId}/flag-field`, data),
};

// Chat API (AI-assisted querying)
export const chatAPI = {
  query: (data: { sessionId?: string | null; prompt: string }) =>
    api.post('/chat/query', data),
  recent: () => api.get('/chat/recent'),
};

// Export API
export const exportAPI = {
  exportCsv: (filter: Record<string, any> = {}) =>
    api.post('/export/csv', { filter }),
  download: (filename: string) =>
    api.get(`/export/download/${encodeURIComponent(filename)}`, { responseType: 'blob' }),
};

export default api;
