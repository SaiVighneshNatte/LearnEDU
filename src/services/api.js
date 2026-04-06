import axios from 'react';
import axiosInstance from 'axios';

const api = axiosInstance.create({
  baseURL: 'http://localhost:8080/api', // To be connected to Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
