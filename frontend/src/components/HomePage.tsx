import { Ticker } from '../types';
import { Line } from 'react-chartjs-2';
import './HomePage.css';

interface HomePageProps {
  tickers: Ticker[];
  onSelectTicker: (symbol: string) => void;
}

export function HomePage({ tickers, onSelectTicker }: HomePageProps) {
  const totalMarketCap = tickers.reduce((sum, t) => sum + t.price * 1000000, 0);
  const gainers = tickers.filter(t => t.change > 0).length;
  const losers = tickers.filter(t => t.change < 0).length;

  const miniChartData = (ticker: Ticker) => ({
    labels: Array(10).fill(''),
    datasets: [{
      data: Array(10).fill(0).map(() => ticker.price * (1 + (Math.random() - 0.5) * 0.02)),
      borderColor: ticker.change >= 0 ? '#4caf50' : '#f44336',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 0
    }]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Trading Dashboard</h1>
        <p>Real-time market data and analytics at your fingertips</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{tickers.length}</div>
          <div className="stat-label">Active Tickers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{gainers}</div>
          <div className="stat-label">Gainers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📉</div>
          <div className="stat-value">{losers}</div>
          <div className="stat-label">Losers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">${(totalMarketCap / 1e9).toFixed(2)}B</div>
          <div className="stat-label">Market Cap</div>
        </div>
      </div>

      <div className="tickers-section">
        <h2>📈 Live Market Tickers</h2>
        <div className="ticker-cards">
          {tickers.map(ticker => (
            <div 
              key={ticker.symbol} 
              className="home-ticker-card"
              onClick={() => onSelectTicker(ticker.symbol)}
            >
              <div className="ticker-main">
                <div className="ticker-info">
                  <div className="ticker-symbol">{ticker.symbol}</div>
                  <div className="ticker-name">{ticker.name}</div>
                </div>
                <div className="ticker-price-info">
                  <div className="ticker-price">${ticker.price.toFixed(2)}</div>
                  <div className={`ticker-change ${ticker.change >= 0 ? 'positive' : 'negative'}`}>
                    {ticker.change >= 0 ? '▲' : '▼'} {Math.abs(ticker.changePercent).toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="mini-chart">
                <Line data={miniChartData(ticker)} options={chartOptions} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
