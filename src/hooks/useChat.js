import { useState, useEffect } from 'react';
import { sendChatRequest } from '../services/aiService';
import { fetchStockData } from '../services/stockService';

const STORAGE_KEY = 'indiaStockChat';

/**
 * Custom hook for managing chat state and interactions
 */
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage when messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  /**
   * Send a message to the AI assistant
   * @param {string} userInput - User's message
   * @param {string} stockSymbol - Optional stock symbol for data fetching
   * @param {string} stockName - Optional stock name for better search
   */
  const sendMessage = async (userInput, stockSymbol = '', stockName = '') => {
    if (!userInput.trim()) return;

    const userMsg = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Fetch stock data if symbol or name provided
      let stockContext = '';
      if (stockSymbol || stockName) {
        const stockData = await fetchStockData(stockSymbol, stockName);
        if (stockData) {
          // Build context from available data
          stockContext = `\n\n📊 **Stock Information:** ${stockData.name || stockData.symbol}\n\n`;

          // If we have price data
          if (stockData.price) {
            stockContext += `💰 **Current Price:** ₹${stockData.price}\n`;
            if (stockData.changePercent) stockContext += `📈 **Change:** ${stockData.changePercent}\n`;
            if (stockData.previousClose) stockContext += `**Previous Close:** ₹${stockData.previousClose}\n`;
            if (stockData.open) stockContext += `**Open:** ₹${stockData.open}\n`;
            if (stockData.high && stockData.low) stockContext += `**Range:** ₹${stockData.low} - ₹${stockData.high}\n`;
          }

          // Add company info if available
          if (stockData.info) {
            stockContext += `\n📋 **Company Info:**\n${stockData.info}\n`;
          }

          // Add snippet if available
          if (stockData.snippet) {
            stockContext += `\n📰 **Latest News:**\n${stockData.snippet}\n`;
          }

          // Add full info if available
          if (stockData.fullInfo) {
            stockContext += `\n📄 **Details:**\n${stockData.fullInfo}\n`;
          }

          // Add sources
          if (stockData.sources && stockData.sources.length > 0) {
            stockContext += `\n🔗 **Sources:**\n`;
            stockData.sources.forEach(s => {
              stockContext += `- [${s.title}](${s.url})\n`;
            });
          } else if (stockData.url) {
            stockContext += `\n🔗 **Source:** ${stockData.url}\n`;
          }

          stockContext += `\n⏰ **Retrieved at:** ${stockData.timestamp}`;
          stockContext += `\n📡 **Via:** ${stockData.source || 'Web Search'}`;

        } else {
          stockContext = `\n\n⚠️ Could not fetch real-time data for ${stockSymbol || stockName}. Please provide information based on your general knowledge up to 2024.`;
        }
      }

      // Get AI response
      const aiResponse = await sendChatRequest(messages, userInput, stockContext);
      
      // Add AI response to messages
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse,
        isStockData: !!stockContext
      }]);
      
      console.log('✅ AI Response added to chat:', aiResponse);
    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.error('❌ Chat error:', errorMsg);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Error: ${errorMsg}\n\nTroubleshooting:\n• Check your OpenRouter API key\n• Ensure you have credits\n• Try again in a moment`,
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear all chat messages
   */
  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
};