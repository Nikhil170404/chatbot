import { fetchStockDataFromWeb } from './webSearchService';
import { searchStockNews } from './backendService';

/**
 * Fetch real-time stock data using DuckDuckGo backend
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE.BSE")
 * @param {string} name - Stock name (optional, e.g., "Reliance Industries")
 * @returns {Promise<Object|null>} Stock data with real news or null if error
 */
export const fetchStockData = async (symbol, name = '') => {
  if (!symbol && !name) {
    return null;
  }

  try {
    console.log('📊 Fetching REAL stock data for:', symbol, name);

    // Fetch stock information from web using backend
    const stockData = await fetchStockDataFromWeb(symbol, name);

    if (stockData) {
      console.log('✅ Stock data retrieved from backend');
      return stockData;
    }

    console.log('⚠️ No stock data found');
    return null;
  } catch (error) {
    console.error('❌ Stock data fetch error:', error.message);
    throw error;
  }
};

/**
 * Get stock news specifically
 * @param {string} symbol - Stock symbol
 * @param {string} name - Stock name
 * @returns {Promise<Object>} Stock news
 */
export const getStockNews = async (symbol, name) => {
  try {
    console.log('📰 Fetching stock news for:', symbol, name);
    
    const newsData = await searchStockNews(symbol, name);
    
    if (!newsData) {
      throw new Error('No news found');
    }

    console.log('✅ Stock news fetched:', newsData.sources.length, 'sources');
    return newsData;
  } catch (error) {
    console.error('❌ Stock news error:', error.message);
    throw error;
  }
};

/**
 * Format stock data for display
 * @param {Object} stockData - Raw stock data
 * @returns {string} Formatted stock information
 */
export const formatStockData = (stockData) => {
  if (!stockData) return '⚠️ No stock data available';

  let formatted = `📊 **${stockData.name}** (${stockData.symbol})\n\n`;

  // Price Information
  if (stockData.priceInfo) {
    formatted += `💰 **Current Price Info:**\n`;
    formatted += `${stockData.priceInfo.snippet}\n\n`;
    
    if (stockData.priceInfo.sources && stockData.priceInfo.sources.length > 0) {
      formatted += `**Price Sources:**\n`;
      stockData.priceInfo.sources.forEach(source => {
        formatted += `• [${source.title}](${source.url}) - ${source.domain}\n`;
      });
      formatted += '\n';
    }
  }

  // Company Information
  if (stockData.companyInfo) {
    formatted += `📋 **Company Info:**\n`;
    formatted += `${stockData.companyInfo.snippet}\n\n`;
  }

  // Analysis
  if (stockData.analysisInfo) {
    formatted += `📈 **Market Analysis:**\n`;
    formatted += `${stockData.analysisInfo.snippet}\n\n`;
  }

  // All sources
  if (stockData.sources && stockData.sources.length > 0) {
    formatted += `🔗 **Top Sources:**\n`;
    stockData.sources.slice(0, 5).forEach((source, index) => {
      formatted += `${index + 1}. [${source.title}](${source.url})\n`;
    });
  }

  formatted += `\n⏰ **Retrieved:** ${stockData.timestamp}\n`;
  formatted += `📡 **Source:** ${stockData.source}`;

  return formatted;
};

const stockService = {
  fetchStockData,
  getStockNews,
  formatStockData
};

export default stockService;