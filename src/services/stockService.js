import { fetchStockDataFromWeb } from './webSearchService';
import { searchStockNews } from './backendService';

/**
 * Fetch real-time stock data using DuckDuckGo backend - 2025 LATEST
 * @param {string} symbol - Stock symbol (e.g., "RELIANCE.BSE")
 * @param {string} name - Stock name (optional, e.g., "Reliance Industries")
 * @returns {Promise<Object|null>} Stock data with real news
 */
export const fetchStockData = async (symbol, name = '') => {
  if (!symbol && !name) {
    return null;
  }

  try {
    console.log('📊 Fetching REAL 2025 LATEST stock data for:', symbol, name);

    // Fetch stock information from web using backend
    const stockData = await fetchStockDataFromWeb(symbol, name);

    if (stockData) {
      console.log('✅ Stock data retrieved from backend');
      console.log('🔴 LIVE 2025 - Maximum Context Enabled');
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
 * Get stock news specifically - 2025 LATEST
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
    console.log('📅 Date:', newsData.date);
    return newsData;
  } catch (error) {
    console.error('❌ Stock news error:', error.message);
    throw error;
  }
};

/**
 * Format stock data for display - AGGRESSIVE REAL DATA USAGE
 * Forces AI to use provided data instead of training data
 * @param {Object} stockData - Raw stock data
 * @returns {string} Formatted stock information with prominent data markers
 */
export const formatStockData = (stockData) => {
  if (!stockData) return '⚠️ No stock data available';

  let formatted = `

╔════════════════════════════════════════════════════════════════════════════╗
║                 🔴 CRITICAL - REAL-TIME DATA BELOW                        ║
║  THIS IS TODAY'S LIVE DATA - USE THIS FOR YOUR RESPONSE                   ║
║  Do NOT use training data. Reference ONLY these sources.                  ║
║  Include ALL information provided. Make response 2000+ characters.         ║
╚════════════════════════════════════════════════════════════════════════════╝

📊 COMPANY: **${stockData.name}** (${stockData.symbol})
📅 DATE: ${stockData.date}
⏰ TIME: ${stockData.timestamp} IST (India Standard Time)
🔴 STATUS: LIVE CURRENT DATA - NOT TRAINING DATA

═══════════════════════════════════════════════════════════════════════════════
💰 SECTION 1: CURRENT PRICE INFO (2025 Latest)
═══════════════════════════════════════════════════════════════════════════════`;

  // ======== PRICE INFORMATION ========
  if (stockData.priceInfo) {
    formatted += `\n\n${stockData.priceInfo.snippet}\n`;
    
    if (stockData.priceInfo.sources && stockData.priceInfo.sources.length > 0) {
      formatted += `\n📌 PRICE SOURCES TO CITE:\n`;
      stockData.priceInfo.sources.slice(0, 5).forEach((source, idx) => {
        formatted += `\n${idx + 1}. SOURCE: "${source.title}"\n`;
        formatted += `   QUOTE: "${source.snippet.substring(0, 180)}"\n`;
        formatted += `   URL: ${source.url}\n`;
        formatted += `   DOMAIN: ${source.domain}`;
      });
    }
  }

  // ======== MARKET DATA ========
  formatted += `\n\n═══════════════════════════════════════════════════════════════════════════════\n📈 SECTION 2: TODAY'S MARKET DATA (2025)\n═══════════════════════════════════════════════════════════════════════════════`;
  
  if (stockData.marketInfo) {
    formatted += `\n\n${stockData.marketInfo.snippet}\n`;
    
    if (stockData.marketInfo.sources && stockData.marketInfo.sources.length > 0) {
      formatted += `\n📌 MARKET DATA SOURCES TO CITE:\n`;
      stockData.marketInfo.sources.slice(0, 4).forEach((source, idx) => {
        formatted += `\n${idx + 1}. SOURCE: "${source.title}"\n`;
        formatted += `   DATA: "${source.snippet.substring(0, 180)}"\n`;
        formatted += `   URL: ${source.url}`;
      });
    }
  }

  // ======== PERFORMANCE ========
  formatted += `\n\n═══════════════════════════════════════════════════════════════════════════════\n📊 SECTION 3: STOCK PERFORMANCE (2025 Latest)\n═══════════════════════════════════════════════════════════════════════════════`;
  
  if (stockData.performanceInfo) {
    formatted += `\n\n${stockData.performanceInfo.snippet}\n`;
    
    if (stockData.performanceInfo.sources && stockData.performanceInfo.sources.length > 0) {
      formatted += `\n📌 PERFORMANCE SOURCES:\n`;
      stockData.performanceInfo.sources.slice(0, 3).forEach((source, idx) => {
        formatted += `\n${idx + 1}. SOURCE: "${source.title}"\n`;
        formatted += `   URL: ${source.url}`;
      });
    }
  }

  // ======== ANALYSIS ========
  formatted += `\n\n═══════════════════════════════════════════════════════════════════════════════\n📈 SECTION 4: MARKET ANALYSIS (2025)\n═══════════════════════════════════════════════════════════════════════════════`;
  
  if (stockData.analysisInfo) {
    formatted += `\n\n${stockData.analysisInfo.snippet}\n`;
  }

  // ======== ALL SOURCES - COMPLETE LIST ========
  if (stockData.sources && stockData.sources.length > 0) {
    formatted += `\n\n═══════════════════════════════════════════════════════════════════════════════\n🔗 COMPLETE SOURCES LIST (${stockData.sources.length} Total Sources - USE ALL)\n═══════════════════════════════════════════════════════════════════════════════\n`;
    formatted += `\n⚠️ IMPORTANT: Reference these ${stockData.sources.length} sources in your response:\n`;
    
    stockData.sources.forEach((source, index) => {
      formatted += `\n${index + 1}. **${source.title}**\n`;
      formatted += `   SNIPPET: "${source.snippet}"\n`;
      formatted += `   DOMAIN: ${source.domain}\n`;
      formatted += `   URL: ${source.url}`;
    });
  }

  // ======== CRITICAL INSTRUCTIONS ========
  formatted += `

═══════════════════════════════════════════════════════════════════════════════
⚠️ CRITICAL INSTRUCTIONS FOR YOUR RESPONSE
═══════════════════════════════════════════════════════════════════════════════

✅ DO THIS:
  1. Use ONLY the data and sources provided above
  2. Include ALL 4 sections (Price, Market, Performance, Analysis)
  3. Reference specific sources from the list
  4. Use quotes from the snippets provided
  5. Make response AT LEAST 2000+ characters
  6. Use date: ${stockData.date}
  7. Include time: ${stockData.timestamp}

❌ DO NOT DO THIS:
  1. Use your training data or knowledge cutoff
  2. Say "as of my knowledge cutoff"
  3. Use data from before 2025
  4. Give short responses
  5. Ignore the provided sources
  6. Rely on old pricing

📊 CONTEXT STATISTICS:
  - Total sources available: ${stockData.sources.length}
  - Data retrieved: ${stockData.date} at ${stockData.timestamp}
  - Source type: Live web search results
  - Context type: Real-time market data

═══════════════════════════════════════════════════════════════════════════════

📅 Retrieved: ${stockData.date} at ${stockData.timestamp} IST
📡 Source: ${stockData.source}
🔴 Status: LIVE ${stockData.date} DATA (NOT TRAINING DATA)
📊 Total Context: ${stockData.sources.length} sources with full market information
⚠️ Disclaimer: This is informational. I am NOT a financial advisor.
`;

  return formatted;
};

const stockService = {
  fetchStockData,
  getStockNews,
  formatStockData
};

export default stockService;