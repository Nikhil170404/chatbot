import axios from 'axios';
import { config } from '../utils/config';

/**
 * Fetch real-time stock data from Alpha Vantage API
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE.BSE")
 * @returns {Promise<Object|null>} Stock data or null if error
 */
export const fetchStockData = async (symbol) => {
  if (!symbol || !config.alphaVantageApiKey) {
    return null;
  }

  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${config.alphaVantageApiKey}`
    );

    const quote = response.data['Global Quote'];

    if (quote && quote['01. symbol']) {
      return {
        symbol: quote['01. symbol'],
        price: quote['05. price'],
        change: quote['09. change'],
        changePercent: quote['10. change percent'],
        timestamp: new Date().toLocaleTimeString('en-IN')
      };
    }

    return null;
  } catch (error) {
    console.warn('Alpha Vantage error:', error.message);
    return null;
  }
};
