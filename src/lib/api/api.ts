// src/lib/api/client.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://noit.com.co', // sin / al final
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
