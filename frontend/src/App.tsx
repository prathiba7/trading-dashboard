import { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { TickerList } from './components/TickerList';
import { PriceChart } from './components/PriceChart';
import './App.css';

function App() {
  const { tickers, connected } = useWebSocket();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const selectedTicker = tickers.find(t => t.symbol === selectedSymbol);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Trading Dashboard</h1>
        <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '● Live' : '○ Disconnected'}
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
