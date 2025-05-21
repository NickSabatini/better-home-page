'use client';

import { useState, useCallback, KeyboardEvent, ChangeEvent } from 'react';
import styles from './StockTickerInput.module.css';

interface StockTickerInputProps {
  onTickersChange: (tickers: string[]) => void;
  maxTickers?: number;
  initialTickers?: string[];
}

export default function StockTickerInput({ 
  onTickersChange, 
  maxTickers = 20,
  initialTickers = []
}: StockTickerInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [tickers, setTickers] = useState<string[]>(initialTickers);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateTicker = async (symbol: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/stocks/validate?symbol=${symbol}`);
      if (!response.ok) throw new Error('Validation failed');
      const data = await response.json();
      return data.isValid;
    } catch (err) {
      console.error('Error validating ticker:', err);
      return false;
    }
  };

  const addTicker = useCallback(async (symbol: string) => {
    const normalizedSymbol = symbol.trim().toUpperCase();
    
    // Basic validation
    if (!normalizedSymbol) return;
    if (tickers.includes(normalizedSymbol)) {
      setError('This ticker is already added');
      return;
    }
    if (tickers.length >= maxTickers) {
      setError(`Maximum ${maxTickers} tickers allowed`);
      return;
    }

    setIsValidating(true);
    setError(null);

    const isValid = await validateTicker(normalizedSymbol);
    if (!isValid) {
      setError('Invalid ticker symbol');
      setIsValidating(false);
      return;
    }

    const newTickers = [...tickers, normalizedSymbol];
    setTickers(newTickers);
    onTickersChange(newTickers);
    setInputValue('');
    setIsValidating(false);
  }, [tickers, maxTickers, onTickersChange]);

  const removeTicker = useCallback((symbolToRemove: string) => {
    const newTickers = tickers.filter(symbol => symbol !== symbolToRemove);
    setTickers(newTickers);
    onTickersChange(newTickers);
  }, [tickers, onTickersChange]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue) {
        addTicker(inputValue);
      }
    }
  };

  const handleBlur = () => {
    if (inputValue) {
      addTicker(inputValue);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.toUpperCase());
    setError(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Add stock ticker..."
          className={styles.input}
          disabled={isValidating || tickers.length >= maxTickers}
        />
        <div className={styles.tickerCount}>
          {tickers.length}/{maxTickers}
        </div>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.tickerList}>
        {tickers.map((ticker) => (
          <div key={ticker} className={styles.tickerChip}>
            <span>{ticker}</span>
            <button
              type="button"
              onClick={() => removeTicker(ticker)}
              className={styles.removeButton}
              aria-label={`Remove ${ticker}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 