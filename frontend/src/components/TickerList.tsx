import { Ticker } from '../types';
import './TickerList.css';

interface TickerListProps {
  tickers: Ticker[];
  selectedSymbol: string | null;
  onSelectTicker: (symbol: string) => void;
}

export function TickerList({ tickers, selectedSymbol, onSelectTicker }: TickerListProps) {
  return (
    <div className="ticker-list">
      <h2>Live Tickers</h2>
      <div className="ticker-grid">
        {tickers.map(ticker => (
          <div
            key={ticker.symbol}
            className={`ticker-card ${selectedSymbol === ticker.symbol ? 'selected' : ''}`}
            onClick={() => onSelectTicker(ticker.symbol)}
          >
            <div className="ticker-header">
              <span className="ticker-symbol">{ticker.symbol}</span>
              <span className="ticker-name">{ticker.name}</span>
            </div>
            <div className="ticker-price">${ticker.price.toFixed(2)}</div>
            <div className={`ticker-change ${ticker.change >= 0 ? 'positive' : 'negative'}`}>
              {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)} ({ticker.changePercent.toFixed(2)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
