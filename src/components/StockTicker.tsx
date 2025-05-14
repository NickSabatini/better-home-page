'use client';

import { useEffect, useState } from 'react';
import styles from './StockTicker.module.css';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function StockTicker() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default symbols - in a real app, these would come from user settings
  const defaultSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

  const fetchStockData = async () => {
    console.log("inside fetchStockData");
    try {
      const response = await fetch(`/api/stocks?symbols=${defaultSymbols.join(',')}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const data = await response.json();
      setStocks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load stock data');
      console.error('Error fetching stocks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStockData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading stocks...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.tickerGrid}>
      {stocks.map((stock) => (
        <div key={stock.symbol} className={styles.tickerCard}>
          <div className={styles.symbol}>{stock.symbol}</div>
          <div className={styles.price}>${stock.price.toFixed(2)}</div>
          <div className={`${styles.change} ${stock.change >= 0 ? styles.positive : styles.negative}`}>
            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </div>
        </div>
      ))}
    </div>
  );
} 