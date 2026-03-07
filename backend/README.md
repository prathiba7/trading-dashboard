# Trading Dashboard Backend

Real-time trading data microservice with WebSocket streaming and REST API.

## Features

- WebSocket server for real-time price updates
- REST API for ticker information and historical data
- Mock market data generator with realistic price movements
- TypeScript with strict type checking
- Unit tests with Jest

## API Endpoints

### REST API

- `GET /api/tickers` - List all available tickers
- `GET /api/tickers/:symbol` - Get current price for a specific ticker
- `GET /api/historical/:symbol?points=50` - Get historical data points
- `GET /api/health` - Health check endpoint

### WebSocket

- `ws://localhost:3001/ws` - Real-time price updates

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Testing

```bash
npm test
npm run test:watch
```

## Build

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t trading-backend .
docker run -p 3001:3001 trading-backend
```
