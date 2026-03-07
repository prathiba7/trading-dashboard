import { Ticker, TickerInfo, HistoricalDataPoint } from '../types';

export class MarketDataService {
  private tickers: Map<string, Ticker> = new Map();
  private cache: Map<string, { data: HistoricalDataPoint[], timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds
  private readonly tickerInfos: TickerInfo[] = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'BTC-USD', name: 'Bitcoin USD' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' }
  ];

  constructor() {
    this.initializeTickers();
  }

  private initializeTickers(): void {
    const basePrices: Record<string, number> = {
      'AAPL': 175.50,
      'TSLA': 242.80,
      'BTC-USD': 43250.00,
      'GOOGL': 140.30,
      'MSFT': 378.90
    };

    this.tickerInfos.forEach(info => {
      this.tickers.set(info.symbol, {
        symbol: info.symbol,
        name: info.name,
        price: basePrices[info.symbol],
        change: 0,
        changePercent: 0,
        timestamp: Date.now()
      });
    });
  }

  getTickerList(): TickerInfo[] {
    return this.tickerInfos;
  }

  getCurrentPrices(): Ticker[] {
    return Array.from(this.tickers.values());
  }

  updatePrices(): Ticker[] {
    const updated: Ticker[] = [];
    
    this.tickers.forEach((ticker, symbol) => {
      const volatility = symbol === 'BTC-USD' ? 0.002 : 0.001;
      const change = (Math.random() - 0.5) * 2 * volatility;
      const oldPrice = ticker.price;
      const newPrice = oldPrice * (1 + change);
      const priceChange = newPrice - oldPrice;
      const changePercent = (priceChange / oldPrice) * 100;

      const updatedTicker: Ticker = {
        ...ticker,
        price: parseFloat(newPrice.toFixed(2)),
        change: parseFloat(priceChange.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        timestamp: Date.now()
      };

      this.tickers.set(symbol, updatedTicker);
      updated.push(updatedTicker);
    });

    return updated;
  }

  getHistoricalData(symbol: string, minutes: number = 60): HistoricalDataPoint[] {
    const cacheKey = `${symbol}_${minutes}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const ticker = this.tickers.get(symbol);
    if (!ticker) return [];

    const data: HistoricalDataPoint[] = [];
    const now = Date.now();
    const interval = (minutes * 60000) / 50; // 50 data points
    let price = ticker.price * 0.95;

    for (let i = 49; i >= 0; i--) {
      const volatility = symbol === 'BTC-USD' ? 0.01 : 0.005;
      price = price * (1 + (Math.random() - 0.5) * volatility);
      
      data.push({
        timestamp: now - (i * interval),
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }

    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }
}
