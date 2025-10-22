/**
 * Backend Service - Calls deployed DuckDuckGo proxy at https://duckduckgo-49y2.onrender.com
 * Handles all web search and article fetching - UPDATED FOR 2025 LATEST DATA
 */

const BACKEND_URL = 'https://duckduckgo-49y2.onrender.com';

/**
 * Search using DuckDuckGo backend - UPDATED FOR LATEST 2025 DATA
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results with title, snippet, link
 */
export const searchWithBackend = async (query) => {
  if (!query || !query.trim()) {
    return [];
  }

  try {
    console.log('🔍 Backend Search (2025 LATEST):', query);
    
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
    console.log('📅 Searching for latest 2025 data...');
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
 * Search for stock news and data - UPDATED FOR 2025 LATEST
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE.BSE")
 * @param {string} name - Stock name (e.g., "Reliance Industries")
 * @returns {Promise<Object>} Stock data with news
 */
export const searchStockNews = async (symbol, name) => {
  const query = `${name || symbol} stock price today 2025 latest live NSE BSE`;
  
  try {
    const results = await searchWithBackend(query);
    
    if (!results || results.length === 0) {
      return null;
    }

    console.log('📊 Found', results.length, 'stock news results for 2025');

    return {
      symbol: symbol.replace(/\.(BSE|NS|BO)$/i, ''),
      name: name || symbol,
      sources: results.slice(0, 15).map(r => ({  // Increased from 5 to 15
        title: r.title,
        snippet: r.snippet,
        url: r.link,
        domain: new URL(r.link).hostname
      })),
      timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
      date: new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
      source: '🔴 LIVE DuckDuckGo 2025 Latest',
      year: new Date().getFullYear(),
      topSnippet: results[0]?.snippet || ''
    };
  } catch (error) {
    console.error('❌ Stock news search error:', error.message);
    throw error;
  }
};

/**
 * Get market news - UPDATED FOR 2025
 * @param {string} query - News query
 * @returns {Promise<Array>} News articles
 */
export const getMarketNews = async (query = 'Indian stock market news today 2025 latest') => {
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
 * Get comprehensive stock information - UPDATED FOR 2025 LATEST
 * @param {string} symbol - Stock symbol
 * @param {string} name - Stock name
 * @returns {Promise<Object>} Comprehensive stock data
 */
export const getStockInformation = async (symbol, name) => {
  try {
    // Search for CURRENT PRICE with 2025 focus
    const priceQuery = `${name || symbol} current stock price today 2025 latest live rupees`;
    const priceResults = await searchWithBackend(priceQuery);

    // Search for TODAY'S MARKET DATA
    const marketQuery = `${name || symbol} stock market today 2025 live trading NSE BSE`;
    const marketResults = await searchWithBackend(marketQuery);

    // Search for RECENT PERFORMANCE
    const performanceQuery = `${name || symbol} stock performance today 2025 latest changes`;
    const performanceResults = await searchWithBackend(performanceQuery);

    // Search for ANALYSIS & NEWS
    const analysisQuery = `${name || symbol} stock analysis today 2025 news update`;
    const analysisResults = await searchWithBackend(analysisQuery);

    const allResults = [
      ...priceResults.slice(0, 5),
      ...marketResults.slice(0, 4),
      ...performanceResults.slice(0, 3),
      ...analysisResults.slice(0, 3)
    ];

    return {
      symbol: symbol.replace(/\.(BSE|NS|BO)$/i, ''),
      name: name || symbol,
      price: {
        results: priceResults.slice(0, 5),
        snippet: priceResults[0]?.snippet || 'Price information not available'
      },
      market: {
        results: marketResults.slice(0, 4),
        snippet: marketResults[0]?.snippet || 'Market data not available'
      },
      performance: {
        results: performanceResults.slice(0, 3),
        snippet: performanceResults[0]?.snippet || 'Performance data not available'
      },
      analysis: {
        results: analysisResults.slice(0, 3),
        snippet: analysisResults[0]?.snippet || 'Analysis not available'
      },
      allSources: allResults,
      timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
      date: new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
      source: '🔴 LIVE DuckDuckGo 2025 Latest - Maximum Context'
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