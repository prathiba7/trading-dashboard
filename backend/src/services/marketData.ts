import { Ticker, TickerInfo, HistoricalDataPoint } from '../types';

export class MarketDataService {
  private tickers: Map<string, Ticker> = new Map();
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

  getHistoricalData(symbol: string, points: number = 50): HistoricalDataPoint[] {
    const ticker = this.tickers.get(symbol);
    if (!ticker) return [];

    const data: HistoricalDataPoint[] = [];
    const now = Date.now();
    const interval = 60000;
    let price = ticker.price * 0.95;

    for (let i = points - 1; i >= 0; i--) {
      const volatility = symbol === 'BTC-USD' ? 0.01 : 0.005;
      price = price * (1 + (Math.random() - 0.5) * volatility);
      
      data.push({
        timestamp: now - (i * interval),
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }

    return data;
  }
}
