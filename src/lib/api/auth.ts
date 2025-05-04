// src/lib/api/auth.ts
import api from './api';

interface RegisterInput {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterInput) {
  const res = await api.post('/api/v/auth/register', data);
  return res.data; // Puedes devolver directamente {token, user, etc.} si viene del backend
}
