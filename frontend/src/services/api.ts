import axios from 'axios';
import { ApiResponse, Memory, Reminder, Stats } from '../types';

const API_BASE = '/api';

// Add auth token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses (unauthorized)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const chatApi = {
  sendMessage: async (message: string): Promise<ApiResponse> => {
    const { data } = await axios.post(`${API_BASE}/chat`, { message });
    return data;
  },

  getChatHistory: async (limit = 50): Promise<any[]> => {
    const { data } = await axios.get(`${API_BASE}/chat/history?limit=${limit}`);
    return data.data || [];
  },

  getRecentMemories: async (limit = 10): Promise<Memory[]> => {
    const { data } = await axios.get(`${API_BASE}/memories?limit=${limit}`);
    return data.data || [];
  },

  getStats: async (): Promise<Stats | null> => {
    const { data } = await axios.get(`${API_BASE}/stats`);
    return data.data;
  },

  deleteMemory: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/memories/${id}`);
  }
};

export const reminderApi = {
  getPending: async (): Promise<Reminder[]> => {
    const { data } = await axios.get(`${API_BASE}/reminders/pending`);
    return data.data || [];
  },

  getTriggered: async (): Promise<Reminder[]> => {
    const { data } = await axios.get(`${API_BASE}/reminders/triggered`);
    return data.data || [];
  },

  dismiss: async (id: string): Promise<void> => {
    await axios.post(`${API_BASE}/reminders/${id}/dismiss`);
  },

  cancel: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/reminders/${id}`);
  }
};
