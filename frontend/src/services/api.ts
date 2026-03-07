import { HistoricalDataPoint } from '../types';
import { getStoredAuth } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getAuthHeaders(): HeadersInit {
  const auth = getStoredAuth();
  return auth ? { 'Authorization': `Bearer ${auth.token}` } : {};
}

export async function fetchHistoricalData(symbol: string, points: number = 50): Promise<HistoricalDataPoint[]> {
  const response = await fetch(`${API_URL}/historical/${symbol}?points=${points}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch historical data');
  }
  return response.json();
}
