# Setup Instructions

## Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (optional)
- Git

## Quick Start

### Option 1: Local Development

1. **Install dependencies**
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. **Start backend**
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:3001

3. **Start frontend** (in new terminal)
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000

### Option 2: Docker

```bash
docker-compose up --build
```

Access the app at http://localhost:3000

## Running Tests

```bash
cd backend
npm test
```

For coverage report:
```bash
npm test -- --coverage
```

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Kubernetes Deployment

1. Build images:
```bash
docker build -t trading-backend:latest ./backend
docker build -t trading-frontend:latest ./frontend
```

2. Apply manifests:
```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

## Environment Variables

Frontend supports:
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001/api)
- `VITE_WS_URL` - WebSocket URL (default: ws://localhost:3001/ws)

Copy `frontend/.env.example` to `frontend/.env` and customize if needed.

## Troubleshooting

**WebSocket connection fails:**
- Ensure backend is running on port 3001
- Check firewall settings
- Verify CORS configuration

**Chart not displaying:**
- Check browser console for errors
- Ensure historical data API is accessible
- Verify Chart.js is properly installed

**Docker build fails:**
- Clear Docker cache: `docker system prune -a`
- Ensure sufficient disk space
- Check Dockerfile syntax
