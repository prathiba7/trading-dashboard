import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { MarketDataService } from './services/marketData';
import { WebSocketService } from './services/websocket';
import { createApiRoutes } from './routes/api';

const PORT = process.env.PORT || 3001;

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

const marketData = new MarketDataService();
const wsService = new WebSocketService(server, marketData);

app.use('/api', createApiRoutes(marketData));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  wsService.startBroadcasting(1000);
});

process.on('SIGTERM', () => {
  wsService.stop();
  server.close();
});
