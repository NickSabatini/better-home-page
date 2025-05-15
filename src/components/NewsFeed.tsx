'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './NewsFeed.module.css';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsResponse {
  articles: Article[];
  status: string;
}

const categories = [
  { id: 'general', label: 'All' },
  { id: 'technology', label: 'Technology' },
  { id: 'business', label: 'Business' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'sports', label: 'Sports' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health' },
];

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryClick = useCallback((e: React.MouseEvent<HTMLButtonElement>, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setCategory(categoryId);
  }, []);

  const fetchNews = async (selectedCategory: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/news?category=${selectedCategory}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data: NewsResponse = await response.json();
      setArticles(data.articles);
    } catch (err) {
      setError('Failed to load news articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(category);
    const interval = setInterval(() => fetchNews(category), 3600000);
    return () => clearInterval(interval);
  }, [category]);

  return (
    <div className={styles.newsFeed}>
      <div className={styles.categoryButtons}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={(e) => handleCategoryClick(e, cat.id)}
            className={`${styles.categoryButton} ${
              category === cat.id
                ? styles.categoryButtonActive
                : styles.categoryButtonInactive
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.articleGrid}>
        {loading ? (
          <>
            {[...Array(6)].map((_, index) => (
              <article key={`placeholder-${index}`} className={styles.articleCard}>
                <div className={styles.articleContent}>
                  <div className={styles.thumbnailContainer}>
                    <div className={styles.placeholderThumbnail} />
                  </div>
                  <div className={styles.articleText}>
                    <div className={styles.placeholderTitle} />
                    <div className={styles.placeholderDescription} />
                    <div className={styles.articleMeta}>
                      <div className={styles.placeholderMeta} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </>
        ) : (
          articles.map((article, index) => (
            <article key={index} className={styles.articleCard}>
              <div className={styles.articleContent}>
                {article.urlToImage && (
                  <div className={styles.thumbnailContainer}>
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className={styles.thumbnail}
                    />
                  </div>
                )}
                <div className={styles.articleText}>
                  <h3 className={styles.articleTitle}>
                    <Link
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className={styles.articleDescription}>
                    {article.description}
                  </p>
                  <div className={styles.articleMeta}>
                    <span className={styles.sourceName}>{article.source.name}</span>
                    <span className={styles.metaSeparator}>•</span>
                    <span className={styles.publishDate}>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
} 