import { useEffect, useState } from 'react';
import { Ticker } from '../types';
import { PriceChart } from './PriceChart';
import { AlertPanel } from './AlertPanel';
import './TradeDetail.css';

interface TradeDetailProps {
  ticker: Ticker;
  onBack: () => void;
}

export function TradeDetail({ ticker, onBack }: TradeDetailProps) {
  const [stats, setStats] = useState({
    high24h: ticker.price * 1.05,
    low24h: ticker.price * 0.95,
    volume24h: Math.floor(Math.random() * 10000000) + 1000000,
    marketCap: ticker.price * 1000000000,
    avgPrice: ticker.price * 0.98
  });

  useEffect(() => {
    setStats({
      high24h: ticker.price * 1.05,
      low24h: ticker.price * 0.95,
      volume24h: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: ticker.price * 1000000000,
      avgPrice: ticker.price * 0.98
    });
  }, [ticker.symbol]);

  return (
    <div className="trade-detail">
      <button className="back-btn" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <div className="detail-header">
        <div className="header-left">
          <h1>{ticker.symbol}</h1>
          <p className="ticker-full-name">{ticker.name}</p>
        </div>
        <div className="header-right">
          <div className="current-price-large">${ticker.price.toFixed(2)}</div>
          <div className={`price-change-large ${ticker.change >= 0 ? 'positive' : 'negative'}`}>
            {ticker.change >= 0 ? '▲' : '▼'} ${Math.abs(ticker.change).toFixed(2)} ({ticker.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-label">24h High</div>
          <div className="stat-value">${stats.high24h.toFixed(2)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">24h Low</div>
          <div className="stat-value">${stats.low24h.toFixed(2)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">24h Volume</div>
          <div className="stat-value">{(stats.volume24h / 1e6).toFixed(2)}M</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Market Cap</div>
          <div className="stat-value">${(stats.marketCap / 1e9).toFixed(2)}B</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Avg Price</div>
          <div className="stat-value">${stats.avgPrice.toFixed(2)}</div>
        </div>
      </div>

      <div className="detail-content">
        <div className="chart-section-detail">
          <PriceChart ticker={ticker} />
        </div>
        <div className="alert-section-detail">
          <AlertPanel ticker={ticker} />
        </div>
      </div>

      <div className="info-section">
        <h3>About {ticker.symbol}</h3>
        <p>
          {ticker.symbol} is actively traded on our platform with real-time price updates. 
          Monitor price movements, set alerts, and analyze historical trends to make informed trading decisions.
        </p>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-icon">🔄</span>
            <div>
              <div className="info-title">Real-time Updates</div>
              <div className="info-desc">Live price streaming every second</div>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📊</span>
            <div>
              <div className="info-title">Historical Data</div>
              <div className="info-desc">Multiple timeframes available</div>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🔔</span>
            <div>
              <div className="info-title">Price Alerts</div>
              <div className="info-desc">Get notified on threshold breach</div>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📈</span>
            <div>
              <div className="info-title">Analytics</div>
              <div className="info-desc">Comprehensive market statistics</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
