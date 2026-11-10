import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/google-news-rss': {
        target: 'https://news.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google-news-rss/, '/rss/search'),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      },
      '/api/yahoo-finance': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo-finance/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      },
      '/.netlify/functions/stock-prices': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => {
          const match = path.match(/[?&]symbols=([^&]+)/);
          const symbols = match ? match[1] : '';
          return `/v7/finance/quote?symbols=${symbols}`;
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      }
    }
  }
})

