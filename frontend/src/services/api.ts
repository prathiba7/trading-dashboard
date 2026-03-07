import { HistoricalDataPoint } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function fetchHistoricalData(symbol: string, points: number = 50): Promise<HistoricalDataPoint[]> {
  const response = await fetch(`${API_URL}/historical/${symbol}?points=${points}`);
  if (!response.ok) {
    throw new Error('Failed to fetch historical data');
  }
  return response.json();
}
