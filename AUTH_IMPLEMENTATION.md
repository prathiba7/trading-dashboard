# Authentication Implementation

## Overview
Minimal mocked authentication system with login page and token-based session management.

## Backend Changes

### New Files
- `backend/src/services/auth.ts` - Authentication service with mocked users

### Modified Files
- `backend/src/routes/api.ts` - Added login/logout endpoints and auth middleware

### Features
- Mock user database with 3 demo accounts
- Token-based session management
- Protected API endpoints (tickers, historical data)
- Login/logout endpoints

### Demo Credentials
```
admin / admin123
trader / trader123
demo / demo
```

## Frontend Changes

### New Files
- `frontend/src/components/Login.tsx` - Login form component
- `frontend/src/components/Login.css` - Login page styles
- `frontend/src/services/auth.ts` - Auth API client and localStorage management

### Modified Files
- `frontend/src/App.tsx` - Added auth state and login/logout flow
- `frontend/src/App.css` - Added logout button and username styles
- `frontend/src/services/api.ts` - Added auth headers to API requests
- `frontend/src/hooks/useWebSocket.ts` - Added token to WebSocket connection

### Features
- Login page with form validation
- Session persistence with localStorage
- Auto-login on page refresh
- Logout functionality
- Protected routes (requires authentication)
- Auth token sent with all API/WebSocket requests

## API Endpoints

### POST /api/login
Request:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "username": "admin",
  "token": "token_admin_1234567890"
}
```

### POST /api/logout
Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true
}
```

## Security Notes
- This is a MOCKED implementation for demonstration
- Passwords are stored in plain text (not for production)
- Tokens are simple strings (use JWT in production)
- No password hashing or encryption
- No rate limiting or brute force protection
- Sessions stored in memory (reset on server restart)

## Testing
1. Start the application
2. You'll see the login page
3. Use any demo credentials to login
4. Access the trading dashboard
5. Click logout to return to login page
6. Refresh page - should auto-login if session exists
