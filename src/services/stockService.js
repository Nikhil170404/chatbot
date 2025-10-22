import { fetchStockDataFromWeb } from './webSearchService';

/**
 * Fetch real-time stock data using DuckDuckGo web search
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE.BSE")
 * @param {string} name - Stock name (optional, e.g., "Reliance Industries")
 * @returns {Promise<Object|null>} Stock data or null if error
 */
export const fetchStockData = async (symbol, name = '') => {
  if (!symbol && !name) {
    return null;
  }

  try {
    console.log('📊 Fetching stock data for:', symbol, name);

    // Use web search to get stock information
    const stockData = await fetchStockDataFromWeb(symbol, name);

    if (stockData) {
      console.log('✅ Stock data retrieved:', stockData);
      return stockData;
    }

    console.log('⚠️ No stock data found');
    return null;
  } catch (error) {
    console.error('❌ Stock data fetch error:', error.message);
    return null;
  }
};
