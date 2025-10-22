import { 
  searchWithBackend, 
   
  getStockInformation,
  getMarketNews 
} from './backendService';

/**
 * Fetch real-time stock data and news using DuckDuckGo backend
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE.BSE")
 * @param {string} name - Stock name (e.g., "Reliance Industries")
 * @returns {Promise<Object|null>} Stock data with real news
 */
export const fetchStockDataFromWeb = async (symbol, name) => {
  if (!symbol && !name) return null;

  const cleanSymbol = symbol ? symbol.replace(/\.(BSE|NS|BO)$/i, '') : '';
  const companyName = name || cleanSymbol;

  console.log('📊 Fetching REAL stock data for:', companyName, '(' + cleanSymbol + ')');

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
      source: 'DuckDuckGo Backend - Real Data',
      
      // Price Information
      priceInfo: {
        snippet: stockInfo.price.snippet,
        sources: stockInfo.price.results.map(r => ({
          title: r.title,
          snippet: r.snippet,
          url: r.link,
          domain: new URL(r.link).hostname
        }))
      },

      // Company Information
      companyInfo: {
        snippet: stockInfo.info.snippet,
        sources: stockInfo.info.results.map(r => ({
          title: r.title,
          snippet: r.snippet,
          url: r.link,
          domain: new URL(r.link).hostname
        }))
      },

      // Analysis
      analysisInfo: {
        snippet: stockInfo.analysis.snippet,
        sources: stockInfo.analysis.results.map(r => ({
          title: r.title,
          snippet: r.snippet,
          url: r.link,
          domain: new URL(r.link).hostname
        }))
      },

      // All sources combined
      sources: stockInfo.allSources.map(r => ({
        title: r.title,
        snippet: r.snippet,
        url: r.link,
        domain: new URL(r.link).hostname
      }))
    };

    console.log('✅ Stock data retrieved with', formattedResponse.sources.length, 'sources');
    return formattedResponse;
  } catch (error) {
    console.error('❌ Stock data fetch error:', error.message);
    throw error;
  }
};

/**
 * Search for stocks
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 */
export const searchStocks = async (query) => {
  try {
    console.log('🔍 Searching for stocks:', query);
    
    const results = await searchWithBackend(`${query} stock NSE BSE`);
    
    // Parse stock symbols from results
    const stocks = [];
    for (const result of results.slice(0, 10)) {
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
 * Get market context and news
 * @param {string} query - Market query
 * @returns {Promise<string>} Market information formatted
 */
export const getMarketContext = async (query = 'Indian stock market news today') => {
  try {
    console.log('📰 Getting market news:', query);
    
    const newsResults = await getMarketNews(query);
    
    if (!newsResults || newsResults.length === 0) {
      return '📊 Market updates available on NSE and BSE websites';
    }

    // Format market news
    let marketInfo = '📰 **Latest Market News:**\n\n';
    newsResults.slice(0, 5).forEach((news, index) => {
      marketInfo += `${index + 1}. **${news.title}**\n`;
      marketInfo += `   ${news.snippet}\n`;
      marketInfo += `   🔗 [Read more](${news.link})\n\n`;
    });

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
 * Get all supported stocks from web search
 * @returns {Promise<Array>} List of popular stocks
 */
export const getSupportedStocks = async () => {
  try {
    console.log('📊 Fetching popular Indian stocks');
    
    const results = await searchWithBackend('top NSE BSE stocks today');
    
    const stocks = [];
    for (const result of results.slice(0, 8)) {
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
 * Search DuckDuckGo (uses backend proxy)
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 */
export const searchDuckDuckGo = async (query) => {
  try {
    console.log('🔍 DuckDuckGo Search:', query);
    return await searchWithBackend(query);
  } catch (error) {
    console.warn('⚠️ Search error:', error.message);
    return [];
  }
};