'use client';

import { useEffect, useState } from 'react';
import styles from './StockTicker.module.css';
import StockTickerInput from './StockTickerInput';
import useLocalStorage from '@/hooks/useLocalStorage';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

type PartialStockData = Partial<Record<keyof StockData, unknown>>;

const isValidStockData = (stock: PartialStockData): stock is StockData => {
  return (
    typeof stock === 'object' &&
    stock !== null &&
    typeof stock.symbol === 'string' &&
    typeof stock.price === 'number' &&
    !isNaN(stock.price) &&
    typeof stock.change === 'number' &&
    !isNaN(stock.change) &&
    typeof stock.changePercent === 'number' &&
    !isNaN(stock.changePercent)
  );
};

export default function StockTicker() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTickers, setSelectedTickers] = useLocalStorage<string[]>('stockTickers', ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']);

  const fetchStockData = async () => {
    try {
      const response = await fetch(`/api/stocks?symbols=${selectedTickers.join(',')}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const data = await response.json();
      // Filter out any invalid stock data
      const validStocks = data.filter(isValidStockData);
      setStocks(validStocks);
      setError(null);
    } catch (err) {
      setError('Failed to load stock data');
      console.error('Error fetching stocks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTickers.length > 0) {
      fetchStockData();
      // Refresh every 30 seconds
      const interval = setInterval(fetchStockData, 30000);
      return () => clearInterval(interval);
    } else {
      setStocks([]);
      setIsLoading(false);
    }
  }, [selectedTickers]);

  return (
    <div className={styles.container}>
      {/* <h2 className={styles.title}>Stock Tickers</h2> */}
      <StockTickerInput
        onTickersChange={setSelectedTickers}
        maxTickers={20}
        initialTickers={selectedTickers}
      />
      
      {isLoading && selectedTickers.length > 0 ? (
        <div className={styles.loading}>Loading stocks...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : stocks.length > 0 ? (
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
      ) : (
        <div className={styles.emptyState}>
          Add stock tickers to see their prices
        </div>
      )}
    </div>
  );
} 