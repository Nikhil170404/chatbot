/**
 * Backend Service - Calls deployed DuckDuckGo proxy at https://duckduckgo-49y2.onrender.com
 * Handles all web search and article fetching
 */

const BACKEND_URL = 'https://duckduckgo-49y2.onrender.com';

/**
 * Search using DuckDuckGo backend
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results with title, snippet, link
 */
export const searchWithBackend = async (query) => {
  if (!query || !query.trim()) {
    return [];
  }

  try {
    console.log('🔍 Backend Search:', query);
    
    const response = await fetch(
      `${BACKEND_URL}/search?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Backend search failed: ${response.status}`);
    }

    const results = await response.json();
    console.log('✅ Backend search results:', results.length, 'results found');
    return results || [];
  } catch (error) {
    console.error('❌ Backend search error:', error.message);
    throw error;
  }
};

/**
 * Fetch full article content from URL
 * @param {string} url - Article URL
 * @returns {Promise<string>} Article content
 */
export const fetchArticleWithBackend = async (url) => {
  if (!url || !url.trim()) {
    return '';
  }

  try {
    console.log('📄 Fetching article:', url);
    
    const response = await fetch(
      `${BACKEND_URL}/article?url=${encodeURIComponent(url)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Article fetch failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Article fetched:', data.content?.length, 'characters');
    return data.content || '';
  } catch (error) {
    console.error('❌ Article fetch error:', error.message);
    throw error;
  }
};

/**
 * Search for stock news and data
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE.BSE")
 * @param {string} name - Stock name (e.g., "Reliance Industries")
 * @returns {Promise<Object>} Stock data with news
 */
export const searchStockNews = async (symbol, name) => {
  const query = `${name || symbol} stock price NSE BSE`;
  
  try {
    const results = await searchWithBackend(query);
    
    if (!results || results.length === 0) {
      return null;
    }

    console.log('📊 Found', results.length, 'stock news results');

    return {
      symbol: symbol.replace(/\.(BSE|NS|BO)$/i, ''),
      name: name || symbol,
      sources: results.slice(0, 5).map(r => ({
        title: r.title,
        snippet: r.snippet,
        url: r.link,
        domain: new URL(r.link).hostname
      })),
      timestamp: new Date().toLocaleTimeString('en-IN'),
      source: 'DuckDuckGo Backend',
      topSnippet: results[0]?.snippet || ''
    };
  } catch (error) {
    console.error('❌ Stock news search error:', error.message);
    throw error;
  }
};

/**
 * Get market news
 * @param {string} query - News query
 * @returns {Promise<Array>} News articles
 */
export const getMarketNews = async (query = 'Indian stock market news today') => {
  try {
    const results = await searchWithBackend(query);
    console.log('📰 Found', results.length, 'market news articles');
    return results || [];
  } catch (error) {
    console.error('❌ Market news error:', error.message);
    throw error;
  }
};

/**
 * Get comprehensive stock information
 * @param {string} symbol - Stock symbol
 * @param {string} name - Stock name
 * @returns {Promise<Object>} Comprehensive stock data
 */
export const getStockInformation = async (symbol, name) => {
  try {
    // Search for current price and news
    const priceQuery = `${name || symbol} current stock price today`;
    const priceResults = await searchWithBackend(priceQuery);

    // Search for company info
    const infoQuery = `${name || symbol} company information about`;
    const infoResults = await searchWithBackend(infoQuery);

    // Search for analysis
    const analysisQuery = `${name || symbol} stock analysis technical analysis`;
    const analysisResults = await searchWithBackend(analysisQuery);

    return {
      symbol: symbol.replace(/\.(BSE|NS|BO)$/i, ''),
      name: name || symbol,
      price: {
        results: priceResults.slice(0, 3),
        snippet: priceResults[0]?.snippet || 'Price information not available'
      },
      info: {
        results: infoResults.slice(0, 3),
        snippet: infoResults[0]?.snippet || 'Company information not available'
      },
      analysis: {
        results: analysisResults.slice(0, 3),
        snippet: analysisResults[0]?.snippet || 'Analysis not available'
      },
      allSources: [
        ...priceResults.slice(0, 2),
        ...infoResults.slice(0, 2),
        ...analysisResults.slice(0, 1)
      ],
      timestamp: new Date().toLocaleTimeString('en-IN'),
      source: 'DuckDuckGo Backend Search'
    };
  } catch (error) {
    console.error('❌ Stock information error:', error.message);
    throw error;
  }
};

const backendService = {
  searchWithBackend,
  fetchArticleWithBackend,
  searchStockNews,
  getMarketNews,
  getStockInformation
};

export default backendService;