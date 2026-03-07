import { useState, useEffect } from 'react';
import { Ticker } from '../types';
import { alertApi, PriceAlert } from '../services/alertApi';
import './AlertPanel.css';

interface AlertPanelProps {
  ticker: Ticker;
}

export function AlertPanel({ ticker }: AlertPanelProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [threshold, setThreshold] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await alertApi.getAlerts();
      setAlerts(data.filter(a => a.symbol === ticker.symbol));
    } catch (err) {
      console.error('Failed to load alerts:', err);
    }
  };

  const handleCreate = async () => {
    if (!threshold) return;
    
    setLoading(true);
    try {
      await alertApi.createAlert(ticker.symbol, condition, parseFloat(threshold));
      setThreshold('');
      setShowForm(false);
      await loadAlerts();
    } catch (err) {
      console.error('Failed to create alert:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await alertApi.deleteAlert(id);
      await loadAlerts();
    } catch (err) {
      console.error('Failed to delete alert:', err);
    }
  };

  return (
    <div className="alert-panel">
      <div className="alert-header">
        <h3>Price Alerts</h3>
        <button className="add-alert-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕' : '+ Add Alert'}
        </button>
      </div>

      {showForm && (
        <div className="alert-form">
          <select value={condition} onChange={(e) => setCondition(e.target.value as any)}>
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
          <input
            type="number"
            placeholder="Price threshold"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            step="0.01"
          />
          <button onClick={handleCreate} disabled={loading || !threshold}>
            Create
          </button>
        </div>
      )}

      <div className="alert-list">
        {alerts.length === 0 ? (
          <p className="no-alerts">No alerts set for {ticker.symbol}</p>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`alert-item ${!alert.active ? 'inactive' : ''}`}>
              <div className="alert-info">
                <span className="alert-condition">
                  {alert.condition === 'above' ? '↑' : '↓'} {alert.condition.toUpperCase()}
                </span>
                <span className="alert-threshold">${alert.threshold.toFixed(2)}</span>
                {!alert.active && <span className="alert-status">Triggered</span>}
              </div>
              <button className="delete-btn" onClick={() => handleDelete(alert.id)}>
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
