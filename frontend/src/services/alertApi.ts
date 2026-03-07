import { getStoredAuth } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getAuthHeaders(): HeadersInit {
  const auth = getStoredAuth();
  return auth ? { 'Authorization': `Bearer ${auth.token}` } : {};
}

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  threshold: number;
  active: boolean;
  createdAt: number;
}

export const alertApi = {
  async createAlert(symbol: string, condition: 'above' | 'below', threshold: number): Promise<PriceAlert> {
    try {
      const auth = getStoredAuth();
      console.log('Auth token:', auth?.token ? 'Present' : 'Missing');
      
      const headers = {
        'Content-Type': 'application/json',
        ...(auth ? { 'Authorization': `Bearer ${auth.token}` } : {})
      };
      
      console.log('Creating alert with headers:', headers);
      
      const response = await fetch(`${API_URL}/alerts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ symbol, condition, threshold })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      
      return response.json();
    } catch (err: any) {
      console.error('Alert API error:', err);
      throw err;
    }
  },

  async getAlerts(): Promise<PriceAlert[]> {
    const response = await fetch(`${API_URL}/alerts`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },

  async deleteAlert(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/alerts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete alert');
  }
};
