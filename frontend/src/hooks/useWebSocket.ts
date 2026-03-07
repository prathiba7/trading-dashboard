import { useEffect, useRef, useState } from 'react';
import { Ticker } from '../types';
import { getStoredAuth } from '../services/auth';

const WS_URL = 'ws://localhost:3001/ws';

interface TriggeredAlert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  threshold: number;
  currentPrice: number;
  triggeredAt: number;
}

export function useWebSocket(enabled: boolean = true) {
  const [tickers, setTickers] = useState<Map<string, Ticker>>(new Map());
  const [connected, setConnected] = useState(false);
  const [alerts, setAlerts] = useState<TriggeredAlert[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const auth = getStoredAuth();
    if (!auth) return;

    const connect = () => {
      const ws = new WebSocket(`${WS_URL}?token=${auth.token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'initial' || message.type === 'update') {
          setTickers(prev => {
            const updated = new Map(prev);
            message.data.forEach((ticker: Ticker) => {
              updated.set(ticker.symbol, ticker);
            });
            return updated;
          });
        } else if (message.type === 'alert') {
          const triggered = message.data;
          setAlerts(prev => [...prev, ...triggered]);
          
          triggered.forEach((alert: any) => {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Price Alert Triggered!', {
                body: `${alert.symbol} is ${alert.condition} $${alert.threshold}. Current: $${alert.currentPrice.toFixed(2)}`,
              });
            }
            console.log('Alert triggered:', alert);
          });
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [enabled]);

  return { tickers: Array.from(tickers.values()), connected, alerts };
}
