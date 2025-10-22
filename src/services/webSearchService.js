import axios from 'axios';

// Your deployed proxy server
const PROXY_URL = 'https://duckduckgo-49y2.onrender.com';

/**
 * Search DuckDuckGo via proxy server
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 */
export const searchDuckDuckGo = async (query) => {
  try {
    console.log('🔍 Searching via proxy:', query);

    const response = await axios.get(`${PROXY_URL}/search`, {
      params: { q: query }
    });

    return response.data || [];
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return [];
  }
};

/**
 * Fetch article content via proxy
 * @param {string} url - Article URL
 * @returns {Promise<string>} Article content
 */
const fetchArticleContent = async (url) => {
  try {
    const response = await axios.get(`${PROXY_URL}/article`, {
      params: { url: url }
    });

    return response.data.content || '';
  } catch (error) {
    console.error('Article fetch error:', error);
    return '';
  }
};

/**
 * Extract stock price from search results and article content
 * @param {Array} searchResults - Search results from DuckDuckGo
 * @returns {Promise<Object|null>} Extracted stock data
 */
const extractStockDataFromResults = async (searchResults) => {
  if (!searchResults || searchResults.length === 0) return null;

  try {
    // Get the first result (most relevant)
    const topResult = searchResults[0];

    // Try to extract price from snippet
    const priceMatch = topResult.snippet.match(/₹?\s*(\d+,?\d*\.?\d+)/);
    const percentMatch = topResult.snippet.match(/([+-]?\d+\.?\d*)%/);

    // Fetch full article content for more details
    let fullContent = '';
    if (topResult.link) {
      fullContent = await fetchArticleContent(topResult.link);
    }

    // Combine snippet and content for analysis
    const combinedText = topResult.snippet + ' ' + fullContent;

    // Extract various data points
    const priceMatches = combinedText.match(/(?:price|current|trading at|₹)\s*:?\s*₹?\s*(\d+,?\d*\.?\d+)/gi);
    const changeMatches = combinedText.match(/(?:change|up|down|gain|loss)\s*:?\s*([+-]?\d+\.?\d+)%?/gi);

    return {
      symbol: null,
      name: topResult.title.split('|')[0].trim(),
      price: priceMatch ? priceMatch[1].replace(/,/g, '') : null,
      changePercent: percentMatch ? percentMatch[1] + '%' : null,
      snippet: topResult.snippet,
      source: 'Web Search',
      url: topResult.link,
      fullInfo: combinedText.substring(0, 500), // First 500 chars
      timestamp: new Date().toLocaleTimeString('en-IN')
    };
  } catch (error) {
    console.error('Error extracting stock data:', error);
    return null;
  }
};

/**
 * Fetch real-time stock data using web search through proxy
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE.BSE")
 * @param {string} name - Stock name (e.g., "Reliance Industries")
 * @returns {Promise<Object|null>} Stock data or null
 */
export const fetchStockDataFromWeb = async (symbol, name) => {
  if (!symbol && !name) return null;

  try {
    // Clean symbol for search
    const cleanSymbol = symbol ? symbol.replace(/\.(BSE|NS)$/i, '') : '';
    const companyName = name || cleanSymbol;

    console.log('🔍 Fetching stock data for:', companyName);

    // Search for current stock price
    const query = `${companyName} stock price NSE BSE India today current latest`;
    const searchResults = await searchDuckDuckGo(query);

    console.log('📊 Search results found:', searchResults.length);

    if (searchResults && searchResults.length > 0) {
      // Extract stock data from results
      const stockData = await extractStockDataFromResults(searchResults);

      if (stockData) {
        console.log('✅ Stock data extracted:', stockData);
        return {
          ...stockData,
          symbol: cleanSymbol || stockData.symbol,
          name: companyName
        };
      }
    }

    // If no structured data found, return search results as info
    if (searchResults && searchResults.length > 0) {
      const topResults = searchResults.slice(0, 3);
      const combinedInfo = topResults.map(r => `${r.title}\n${r.snippet}`).join('\n\n');

      console.log('✅ Returning general search info');
      return {
        symbol: cleanSymbol,
        name: companyName,
        info: combinedInfo,
        sources: topResults.map(r => ({ title: r.title, url: r.link })),
        source: 'Web Search via Proxy',
        timestamp: new Date().toLocaleTimeString('en-IN')
      };
    }

    console.log('⚠️ No stock data found');
    return null;
  } catch (error) {
    console.error('Stock data fetch error:', error);
    return null;
  }
};

/**
 * Get market context using web search via proxy
 * @param {string} query - Market query
 * @returns {Promise<string>} Market information
 */
export const getMarketContext = async (query) => {
  try {
    const searchQuery = `${query} Indian stock market NSE BSE today`;
    const results = await searchDuckDuckGo(searchQuery);

    if (results && results.length > 0) {
      return results[0].snippet || '';
    }

    return '';
  } catch (error) {
    console.error('Market context error:', error);
    return '';
  }
};
