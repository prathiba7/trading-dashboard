import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { MarketDataService } from './marketData';
import { AlertService } from './alerts';

export class WebSocketService {
  private wss: WebSocketServer;
  private marketData: MarketDataService;
  private alertService: AlertService;
  private updateInterval: NodeJS.Timeout | null = null;
  private clientUsers: Map<WebSocket, string> = new Map();

  constructor(server: Server, marketData: MarketDataService, alertService: AlertService) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.marketData = marketData;
    this.alertService = alertService;
    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws: WebSocket, req) => {
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const token = url.searchParams.get('token');
      
      if (token) {
        const username = this.extractUsernameFromToken(token);
        if (username) {
          this.clientUsers.set(ws, username);
        }
      }

      console.log('Client connected');

      ws.send(JSON.stringify({
        type: 'initial',
        data: this.marketData.getCurrentPrices()
      }));

      ws.on('close', () => {
        this.clientUsers.delete(ws);
        console.log('Client disconnected');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  private extractUsernameFromToken(token: string): string | null {
    const parts = token.split('_');
    return parts.length >= 2 ? parts[1] : null;
  }

  startBroadcasting(intervalMs: number = 1000): void {
    if (this.updateInterval) return;

    this.updateInterval = setInterval(() => {
      const updates = this.marketData.updatePrices();
      
      updates.forEach(ticker => {
        this.wss.clients.forEach((client) => {
          const username = this.clientUsers.get(client);
          if (username && client.readyState === WebSocket.OPEN) {
            const triggered = this.alertService.checkAlerts(username, ticker.symbol, ticker.price);
            if (triggered.length > 0) {
              client.send(JSON.stringify({
                type: 'alert',
                data: triggered
              }));
            }
          }
        });
      });

      this.broadcast({
        type: 'update',
        data: updates
      });
    }, intervalMs);
  }

  private broadcast(message: any): void {
    const data = JSON.stringify(message);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.wss.close();
  }
}
