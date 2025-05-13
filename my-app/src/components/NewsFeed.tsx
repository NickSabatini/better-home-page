'use client';

import { useEffect, useState } from 'react';
import styles from './NewsFeed.module.css';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  summary: string;
  url: string;
  publishedAt: string;
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default categories - in a real app, these would come from user settings
  const defaultCategories = ['technology', 'business'];

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/news?categories=${defaultCategories.join(',')}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      setNews(data);
      setError(null);
    } catch (err) {
      setError('Failed to load news');
      console.error('Error fetching news:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // Refresh every 5 minutes
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading news...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.newsFeed}>
      {news.map((item) => (
        <article key={item.id} className={styles.newsCard}>
          <div className={styles.newsHeader}>
            <span className={styles.source}>{item.source}</span>
            <time className={styles.time}>
              {new Date(item.publishedAt).toLocaleDateString()}
            </time>
          </div>
          <h3 className={styles.title}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          </h3>
          <p className={styles.summary}>{item.summary}</p>
        </article>
      ))}
    </div>
  );
} 