import axios from 'axios';

const defaultApiUrl = import.meta.env.DEV
  ? `http://${window.location.hostname}:5000/api`
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export function getApiErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (!error.response) return 'Could not reach the server. Check your connection and try again.';
  return 'Something went wrong. Please try again.';
}

export default api;