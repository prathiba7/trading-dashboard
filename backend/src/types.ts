export interface Ticker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface HistoricalDataPoint {
  timestamp: number;
  price: number;
  volume: number;
}

export interface TickerInfo {
  symbol: string;
  name: string;
}
