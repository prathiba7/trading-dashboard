import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { fetchHistoricalData } from '../services/api';
import { HistoricalDataPoint, Ticker } from '../types';
import './PriceChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PriceChartProps {
  ticker: Ticker;
}

export function PriceChart({ ticker }: PriceChartProps) {
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchHistoricalData(ticker.symbol)
      .then(historicalData => {
        setData([...historicalData, {
          timestamp: ticker.timestamp,
          price: ticker.price,
          volume: 0
        }]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch historical data:', err);
        setLoading(false);
      });
  }, [ticker.symbol]);

  useEffect(() => {
    setData(prev => [...prev.slice(-49), {
      timestamp: ticker.timestamp,
      price: ticker.price,
      volume: 0
    }]);
  }, [ticker.price, ticker.timestamp]);

  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [{
      label: `${ticker.symbol} Price`,
      data: data.map(d => d.price),
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2
    }]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: { display: true, grid: { display: false } },
      y: { display: true, grid: { color: '#f0f0f0' } }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (loading) {
    return <div className="chart-loading">Loading chart...</div>;
  }

  return (
    <div className="price-chart">
      <div className="chart-header">
        <h2>{ticker.symbol} - {ticker.name}</h2>
        <div className="chart-price">
          <span className="current-price">${ticker.price.toFixed(2)}</span>
          <span className={`price-change ${ticker.change >= 0 ? 'positive' : 'negative'}`}>
            {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)} ({ticker.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
