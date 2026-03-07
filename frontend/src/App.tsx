import { useState, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { HomePage } from './components/HomePage';
import { TradeDetail } from './components/TradeDetail';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Toast } from './components/Toast';
import { authApi, getStoredAuth, setStoredAuth, clearStoredAuth, User } from './services/auth';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const { tickers, connected, alerts } = useWebSocket(!!user);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setUser(stored);
    }
  }, []);

  useEffect(() => {
    if (alerts.length > 0) {
      const latest = alerts[alerts.length - 1];
      setToastMessage(`🔔 ${latest.symbol} is ${latest.condition} $${latest.threshold}! Current: $${latest.currentPrice.toFixed(2)}`);
    }
  }, [alerts]);

  const handleLogin = async (username: string, password: string) => {
    try {
      setAuthError(null);
      const userData = await authApi.login(username, password);
      setStoredAuth(userData);
      setUser(userData);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleSignup = async (username: string, password: string) => {
    try {
      setAuthError(null);
      const userData = await authApi.signup(username, password);
      setStoredAuth(userData);
      setUser(userData);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Signup failed');
    }
  };

  const handleLogout = async () => {
    if (user) {
      await authApi.logout(user.token);
      clearStoredAuth();
      setUser(null);
      setSelectedSymbol(null);
    }
  };

  const handleSelectTicker = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  const handleBackToHome = () => {
    setSelectedSymbol(null);
  };

  if (!user) {
    return showSignup ? (
      <Signup 
        onSignup={handleSignup} 
        onSwitchToLogin={() => { setShowSignup(false); setAuthError(null); }}
        error={authError} 
      />
    ) : (
      <Login 
        onLogin={handleLogin} 
        onSwitchToSignup={() => { setShowSignup(true); setAuthError(null); }}
        error={authError} 
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Trading Dashboard</h1>
        <div className="header-right">
          <span className="username">Welcome, {user.username}</span>
          <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '● Live' : '○ Disconnected'}
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="app-main">
        {!selectedSymbol ? (
          <HomePage tickers={tickers} onSelectTicker={handleSelectTicker} />
        ) : selectedSymbol && tickers.find(t => t.symbol === selectedSymbol) ? (
          <TradeDetail 
            ticker={tickers.find(t => t.symbol === selectedSymbol)!} 
            onBack={handleBackToHome}
          />
        ) : null}
      </main>
      
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="info" 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
}

export default App;
