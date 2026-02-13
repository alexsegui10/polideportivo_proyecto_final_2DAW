import axios from 'axios';

// API SpringBoot (para Dashboard, Shop y gestión general)
export const apiSpring = axios.create({
  baseURL: (import.meta as any).env.VITE_SPRINGBOOT_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiSpring.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('SpringBoot API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
