import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { MarketDataService } from './marketData';

export class WebSocketService {
  private wss: WebSocketServer;
  private marketData: MarketDataService;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(server: Server, marketData: MarketDataService) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.marketData = marketData;
    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');

      ws.send(JSON.stringify({
        type: 'initial',
        data: this.marketData.getCurrentPrices()
      }));

      ws.on('close', () => {
        console.log('Client disconnected');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  startBroadcasting(intervalMs: number = 1000): void {
    if (this.updateInterval) return;

    this.updateInterval = setInterval(() => {
      const updates = this.marketData.updatePrices();
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
