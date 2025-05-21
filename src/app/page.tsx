import styles from './page.module.css';
import StockTicker from '@/components/StockTicker';
import NewsFeed from '@/components/NewsFeed';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Settings Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <h2>Settings</h2>
          {/* Stock Ticker Settings */}
          <section className={styles.settingsSection}>
            {/* <h3>Stock Tickers</h3> */}
            <div className={styles.tickerList}>
              {/* Ticker list will go here */}
              <p className={styles.comingSoon}>Custom ticker selection coming soon!</p>
            </div>
          </section>
          
          {/* News Settings */}
          <section className={styles.settingsSection}>
            <h3>News Categories</h3>
            <div className={styles.newsCategories}>
              {/* News category checkboxes will go here */}
              <p className={styles.comingSoon}>Category selection coming soon!</p>
            </div>
          </section>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Header */}
        <h1 className={styles.header}>BetterHomePage</h1>

        {/* Google Search Bar */}
        <div className={styles.searchContainer}>
          <form 
            className={styles.searchForm}
            action="https://www.google.com/search"
            method="get"
          >
            <input
              type="text"
              name="q"
              className={styles.searchInput}
              autoFocus
              placeholder="Search Google"
            />
          </form>
        </div>

        {/* Stock Ticker Tile */}
        <section className={styles.tickerTile}>
          <h2>Market Watch</h2>
          <StockTicker />
        </section>

        {/* News Feed Tile */}
        <section className={styles.newsTile}>
          <h2>News Feed</h2>
          <NewsFeed />
        </section>
      </main>
    </div>
  );
}
