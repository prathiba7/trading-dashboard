# Real-Time Trading Dashboard

A full-stack application for displaying live ticker prices and interactive charts for financial instruments.

## Architecture

- **Backend**: Node.js + TypeScript + Express + WebSocket
- **Frontend**: React + TypeScript + Vite + Chart.js
- **Containerization**: Docker + Docker Compose
- **Testing**: Jest for backend unit tests

## Features

### Backend
- **Authentication**: Mocked user authentication with token-based sessions
- WebSocket server for real-time price streaming
- RESTful API for ticker data and historical prices
- Mock market data generator with realistic volatility
- Clean architecture with separation of concerns
- Unit tests with Jest

### Frontend
- **Login Page**: Secure authentication with session persistence
- Real-time ticker list with live price updates
- Interactive price charts using Chart.js
- Responsive design for mobile and desktop
- WebSocket client with auto-reconnection
- TypeScript for type safety

## Project Structure

```
trading-dashboard/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── marketData.ts
│   │   │   └── websocket.ts
│   │   ├── routes/
│   │   │   └── api.ts
│   │   ├── __tests__/
│   │   │   └── marketData.test.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TickerList.tsx
│   │   │   └── PriceChart.tsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Quick Start

### Demo Credentials
```
Username: admin    | Password: admin123
Username: trader   | Password: trader123
Username: demo     | Password: demo
```

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional)

### Local Development

1. Install dependencies:
```bash
npm run install:all
```

2. Start both services:
```bash
npm run dev
```

Backend runs on http://localhost:3001
Frontend runs on http://localhost:3000

### Using Docker

```bash
docker-compose up --build
```

Access the app at http://localhost:3000

## API Documentation

### REST Endpoints

- `POST /api/login` - Authenticate user and get token
- `POST /api/logout` - Logout and invalidate token
- `GET /api/tickers` - List all available tickers (requires auth)
- `GET /api/tickers/:symbol` - Get current price for a ticker (requires auth)
- `GET /api/historical/:symbol?points=50` - Get historical data (requires auth)
- `GET /api/health` - Health check

### WebSocket

Connect to `ws://localhost:3001/ws?token=<your_token>` for real-time updates.

Message format:
```json
{
  "type": "update",
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 175.50,
      "change": 1.25,
      "changePercent": 0.72,
      "timestamp": 1234567890
    }
  ]
}
```

## Testing

Run backend tests:
```bash
cd backend
npm test
```

Run with coverage:
```bash
npm test -- --coverage
```

## Assumptions & Trade-offs

### Assumptions
- Mock data is sufficient for demonstration
- 1-second update interval for price changes
- 50 historical data points provide adequate chart detail
- Single WebSocket connection per client is acceptable

### Trade-offs
- **Mock Data**: Used simulated market data instead of real API to avoid external dependencies
- **Mock Authentication**: Simple token-based auth for demonstration (no JWT, no encryption)
- **In-Memory Storage**: No database for simplicity; prices and sessions reset on restart
- **Single Server**: No load balancing or horizontal scaling in base implementation
- **Limited Error Handling**: Basic error handling; production would need more robust handling

## Technology Choices

### Backend
- **Express**: Lightweight and widely adopted
- **ws**: Native WebSocket library with good performance
- **TypeScript**: Type safety and better developer experience

### Frontend
- **Vite**: Fast build tool with excellent DX
- **Chart.js**: Performant charting library with good React integration
- **Native WebSocket**: No additional library needed for simple use case

## Performance Considerations

- WebSocket broadcasts only changed data
- Chart updates use efficient data structure (sliding window)
- Frontend caches historical data per ticker
- Minimal re-renders using React hooks

## Future Enhancements

- User authentication with JWT
- Redis caching for historical data
- Price threshold alerts
- Multiple chart timeframes
- Trade execution simulation
- Kubernetes deployment manifests
- End-to-end tests with Playwright

## License

MIT
