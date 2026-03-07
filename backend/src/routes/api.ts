import { Router, Request, Response } from 'express';
import { MarketDataService } from '../services/marketData';

export function createApiRoutes(marketData: MarketDataService): Router {
  const router = Router();

  router.get('/tickers', (_req: Request, res: Response) => {
    res.json(marketData.getTickerList());
  });

  router.get('/tickers/:symbol', (req: Request, res: Response) => {
    const { symbol } = req.params;
    const ticker = marketData.getCurrentPrices().find(t => t.symbol === symbol);
    
    if (!ticker) {
      return res.status(404).json({ error: 'Ticker not found' });
    }
    
    res.json(ticker);
  });

  router.get('/historical/:symbol', (req: Request, res: Response) => {
    const { symbol } = req.params;
    const points = parseInt(req.query.points as string) || 50;
    
    const data = marketData.getHistoricalData(symbol, points);
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Ticker not found' });
    }
    
    res.json(data);
  });

  router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  return router;
}
