import { useState, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { TickerList } from './components/TickerList';
import { PriceChart } from './components/PriceChart';
import { Login } from './components/Login';
import { authApi, getStoredAuth, setStoredAuth, clearStoredAuth, User } from './services/auth';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const { tickers, connected } = useWebSocket(!!user);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setUser(stored);
    }
  }, []);

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

  const handleLogout = async () => {
    if (user) {
      await authApi.logout(user.token);
      clearStoredAuth();
      setUser(null);
      setSelectedSymbol(null);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} error={authError} />;
  }

  const selectedTicker = tickers.find(t => t.symbol === selectedSymbol);

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
        <TickerList
          tickers={tickers}
          selectedSymbol={selectedSymbol}
          onSelectTicker={setSelectedSymbol}
        />

        {selectedTicker && (
          <div className="chart-section">
            <PriceChart ticker={selectedTicker} />
          </div>
        )}

        {!selectedTicker && tickers.length > 0 && (
          <div className="empty-state">
            <p>Select a ticker to view its chart</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
