import { getAuthToken } from './login';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:3000/api/v1';

export const getMyProfile = async () => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};
