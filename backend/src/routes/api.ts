import { Router, Request, Response } from 'express';
import { MarketDataService } from '../services/marketData';
import { AuthService } from '../services/auth';
import { AlertService } from '../services/alerts';

export function createApiRoutes(marketData: MarketDataService, alertService: AlertService): Router {
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

  router.post('/signup', (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }

    const user = authService.signup(username, password);
    
    if (!user) {
      return res.status(409).json({ error: 'Username already exists' });
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

    (req as any).username = authService.validateToken(token);
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
    const minutes = parseInt(req.query.minutes as string) || 60;
    
    const data = marketData.getHistoricalData(symbol, minutes);
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Ticker not found' });
    }
    
    res.json(data);
  });

  router.post('/alerts', authMiddleware, (req: Request, res: Response) => {
    const { symbol, condition, threshold } = req.body;
    const username = (req as any).username;

    if (!symbol || !condition || threshold === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const alert = alertService.createAlert(username, symbol, condition, parseFloat(threshold));
    res.json(alert);
  });

  router.get('/alerts', authMiddleware, (req: Request, res: Response) => {
    const username = (req as any).username;
    const alerts = alertService.getUserAlerts(username);
    res.json(alerts);
  });

  router.delete('/alerts/:id', authMiddleware, (req: Request, res: Response) => {
    const username = (req as any).username;
    const { id } = req.params;
    
    const deleted = alertService.deleteAlert(username, id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ success: true });
  });

  router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  return router;
}
