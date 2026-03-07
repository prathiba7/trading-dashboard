import { Router, Request, Response } from 'express';
import { MarketDataService } from '../services/marketData';
import { AuthService } from '../services/auth';

export function createApiRoutes(marketData: MarketDataService): Router {
  const router = Router();
  const authService = new AuthService();

  router.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = authService.login(username, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(user);
  });

  router.post('/logout', (req: Request, res: Response) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      authService.logout(token);
    }

    res.json({ success: true });
  });

  const authMiddleware = (req: Request, res: Response, next: Function) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !authService.validateToken(token)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
  };

  router.get('/tickers', authMiddleware, (_req: Request, res: Response) => {
    res.json(marketData.getTickerList());
  });

  router.get('/tickers/:symbol', authMiddleware, (req: Request, res: Response) => {
    const { symbol } = req.params;
    const ticker = marketData.getCurrentPrices().find(t => t.symbol === symbol);
    
    if (!ticker) {
      return res.status(404).json({ error: 'Ticker not found' });
    }
    
    res.json(ticker);
  });

  router.get('/historical/:symbol', authMiddleware, (req: Request, res: Response) => {
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
