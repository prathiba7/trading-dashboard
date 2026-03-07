import { MarketDataService } from '../services/marketData';

describe('MarketDataService', () => {
  let service: MarketDataService;

  beforeEach(() => {
    service = new MarketDataService();
  });

  test('should initialize with 5 tickers', () => {
    const tickers = service.getTickerList();
    expect(tickers).toHaveLength(5);
    expect(tickers.map(t => t.symbol)).toContain('AAPL');
    expect(tickers.map(t => t.symbol)).toContain('TSLA');
    expect(tickers.map(t => t.symbol)).toContain('BTC-USD');
  });

  test('should return current prices for all tickers', () => {
    const prices = service.getCurrentPrices();
    expect(prices).toHaveLength(5);
    prices.forEach(ticker => {
      expect(ticker).toHaveProperty('symbol');
      expect(ticker).toHaveProperty('price');
      expect(ticker).toHaveProperty('change');
      expect(ticker).toHaveProperty('changePercent');
      expect(ticker).toHaveProperty('timestamp');
    });
  });

  test('should update prices and return updated tickers', () => {
    const initialPrices = service.getCurrentPrices();
    const updatedPrices = service.updatePrices();
    
    expect(updatedPrices).toHaveLength(5);
    expect(updatedPrices[0].timestamp).toBeGreaterThan(initialPrices[0].timestamp);
  });

  test('should generate historical data for valid symbol', () => {
    const data = service.getHistoricalData('AAPL', 30);
    expect(data).toHaveLength(30);
    
    data.forEach(point => {
      expect(point).toHaveProperty('timestamp');
      expect(point).toHaveProperty('price');
      expect(point).toHaveProperty('volume');
      expect(point.price).toBeGreaterThan(0);
      expect(point.volume).toBeGreaterThan(0);
    });
  });

  test('should return empty array for invalid symbol', () => {
    const data = service.getHistoricalData('INVALID', 30);
    expect(data).toHaveLength(0);
  });

  test('should generate historical data with timestamps in ascending order', () => {
    const data = service.getHistoricalData('TSLA', 20);
    
    for (let i = 1; i < data.length; i++) {
      expect(data[i].timestamp).toBeGreaterThan(data[i - 1].timestamp);
    }
  });
});
