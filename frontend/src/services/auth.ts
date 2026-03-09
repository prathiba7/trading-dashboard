const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
  username: string;
  token: string;
}

export const authApi = {
  async login(username: string, password: string): Promise<User> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  async signup(username: string, password: string): Promise<User> {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    return response.json();
  },

  async logout(token: string): Promise<void> {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};

export const getStoredAuth = (): User | null => {
  const stored = localStorage.getItem('auth');
  return stored ? JSON.parse(stored) : null;
};

export const setStoredAuth = (user: User): void => {
  localStorage.setItem('auth', JSON.stringify(user));
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem('auth');
};
