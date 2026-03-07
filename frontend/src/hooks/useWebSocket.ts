import { useEffect, useRef, useState } from 'react';
import { Ticker } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';

export function useWebSocket() {
  const [tickers, setTickers] = useState<Map<string, Ticker>>(new Map());
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(WS_URL);
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
  }, []);

  return { tickers: Array.from(tickers.values()), connected };
}
