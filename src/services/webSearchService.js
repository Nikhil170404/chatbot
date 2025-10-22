import { 
  searchWithBackend, 
  getStockInformation,
  getMarketNews 
} from './backendService';

/**
 * Fetch real-time stock data and news using DuckDuckGo backend - 2025 LATEST
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE.BSE")
 * @param {string} name - Stock name (e.g., "Reliance Industries")
 * @returns {Promise<Object|null>} Stock data with real news
 */
export const fetchStockDataFromWeb = async (symbol, name) => {
  if (!symbol && !name) return null;

  const cleanSymbol = symbol ? symbol.replace(/\.(BSE|NS|BO)$/i, '') : '';
  const companyName = name || cleanSymbol;

  console.log('📊 Fetching REAL 2025 LATEST stock data for:', companyName, '(' + cleanSymbol + ')');

  try {
    // Get comprehensive stock information from backend
    const stockInfo = await getStockInformation(symbol, name);
    
    if (!stockInfo) {
      throw new Error('No stock data found');
    }

    // Format the response with all real data
    const formattedResponse = {
      symbol: cleanSymbol,
      name: companyName,
      timestamp: stockInfo.timestamp,
      date: stockInfo.date,
      source: '🔴 LIVE 2025 - DuckDuckGo Backend Real Data',
      
      // Price Information - 2025 Latest
      priceInfo: {
        snippet: stockInfo.price.snippet,
        sources: stockInfo.price.results.slice(0, 5).map(r => ({
          title: r.title,
          snippet: r.snippet,
          url: r.link,
          domain: new URL(r.link).hostname
        }))
      },

      // Market Data - Today's 2025
      marketInfo: {
        snippet: stockInfo.market.snippet,
        sources: stockInfo.market.results.slice(0, 4).map(r => ({
          title: r.title,
          snippet: r.snippet,
          url: r.link,
          domain: new URL(r.link).hostname
        }))
      },

      // Performance - 2025 Latest
      performanceInfo: {
        snippet: stockInfo.performance.snippet,
        sources: stockInfo.performance.results.slice(0, 3).map(r => ({
          title: r.title,
          snippet: r.snippet,
          url: r.link,
          domain: new URL(r.link).hostname
        }))
      },

      // Analysis - 2025 Latest
      analysisInfo: {
        snippet: stockInfo.analysis.snippet,
        sources: stockInfo.analysis.results.slice(0, 3).map(r => ({
          title: r.title,
          snippet: r.snippet,
          url: r.link,
          domain: new URL(r.link).hostname
        }))
      },

      // All sources combined - MAXIMUM CONTEXT
      sources: stockInfo.allSources.map(r => ({
        title: r.title,
        snippet: r.snippet,
        url: r.link,
        domain: new URL(r.link).hostname
      }))
    };

    console.log('✅ Stock data retrieved with', formattedResponse.sources.length, 'sources');
    console.log('📅 Date:', formattedResponse.date);
    console.log('🔴 LIVE 2025 DATA - Maximum Context Enabled');
    return formattedResponse;
  } catch (error) {
    console.error('❌ Stock data fetch error:', error.message);
    throw error;
  }
};

/**
 * Search for stocks - 2025 LATEST
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 */
export const searchStocks = async (query) => {
  try {
    console.log('🔍 Searching for stocks 2025 latest:', query);
    
    const results = await searchWithBackend(`${query} stock 2025 latest NSE BSE today`);
    
    // Parse stock symbols from results
    const stocks = [];
    for (const result of results.slice(0, 15)) {
      const symbolMatch = result.title.match(/([A-Z]+(?:\.[A-Z]+)?)/);
      if (symbolMatch) {
        stocks.push({
          symbol: symbolMatch[1],
          name: result.title,
          snippet: result.snippet,
          url: result.link
        });
      }
    }
    
    console.log('✅ Found', stocks.length, 'stocks');
    return stocks;
  } catch (error) {
    console.warn('⚠️ Search error:', error.message);
    return [];
  }
};

/**
 * Get market context and news - 2025 LATEST
 * @param {string} query - Market query
 * @returns {Promise<string>} Market information formatted
 */
export const getMarketContext = async (query = 'Indian stock market news today 2025 latest') => {
  try {
    console.log('📰 Getting market news 2025 latest:', query);
    
    const newsResults = await getMarketNews(query);
    
    if (!newsResults || newsResults.length === 0) {
      return '📊 Market updates available on NSE and BSE websites';
    }

    // Format market news
    let marketInfo = '📰 **Latest Market News (2025):**\n\n';
    newsResults.slice(0, 10).forEach((news, index) => {
      marketInfo += `${index + 1}. **${news.title}**\n`;
      marketInfo += `   ${news.snippet}\n`;
      marketInfo += `   🔗 [Read more](${news.link})\n\n`;
    });

    marketInfo += `\n📅 **Retrieved:** ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n`;
    marketInfo += `🔴 **Status:** LIVE 2025 Data`;

    return marketInfo;
  } catch (error) {
    console.error('⚠️ Market context error:', error.message);
    return '📊 Market updates available on NSE and BSE websites';
  }
};

/**
 * Fetch article content
 * @param {string} url - Article URL
 * @returns {Promise<string>} Article content
 */
export const fetchArticleContent = async (url) => {
  try {
    console.log('📄 Fetching article from URL:', url);
    
    // Note: Article fetching requires the backend to have proper proxy support
    // For now, return a message directing to the URL
    return `📄 Article available at: ${url}\n\nTo read full content, please visit the link above.`;
  } catch (error) {
    console.error('⚠️ Article fetch error:', error.message);
    return '';
  }
};

/**
 * Get all supported stocks from web search - 2025 LATEST
 * @returns {Promise<Array>} List of popular stocks
 */
export const getSupportedStocks = async () => {
  try {
    console.log('📊 Fetching popular Indian stocks 2025');
    
    const results = await searchWithBackend('top NSE BSE stocks today 2025 latest trading');
    
    const stocks = [];
    for (const result of results.slice(0, 12)) {
      const symbolMatch = result.title.match(/([A-Z]+(?:\.[A-Z]+)?)/);
      if (symbolMatch) {
        stocks.push({
          symbol: symbolMatch[1],
          name: result.title,
          snippet: result.snippet
        });
      }
    }
    
    return stocks.length > 0 ? stocks : getDefaultStocks();
  } catch (error) {
    console.warn('⚠️ Could not fetch stocks from web, using defaults');
    return getDefaultStocks();
  }
};

/**
 * Default stocks list
 */
const getDefaultStocks = () => [
  { symbol: 'RELIANCE.BSE', name: 'Reliance Industries', snippet: 'Oil & Gas' },
  { symbol: 'TCS.BSE', name: 'Tata Consultancy Services', snippet: 'IT Services' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', snippet: 'Banking' },
  { symbol: 'INFY.NS', name: 'Infosys', snippet: 'IT Services' }
];

/**
 * Search DuckDuckGo (uses backend proxy) - 2025 LATEST
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 */
export const searchDuckDuckGo = async (query) => {
  try {
    console.log('🔍 DuckDuckGo Search 2025 Latest:', query);
    return await searchWithBackend(query + ' 2025 latest today');
  } catch (error) {
    console.warn('⚠️ Search error:', error.message);
    return [];
  }
};