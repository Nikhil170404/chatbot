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
   */
  const sendMessage = async (userInput, stockSymbol = '') => {
    if (!userInput.trim()) return;

    const userMsg = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Fetch stock data if symbol provided
      let stockContext = '';
      if (stockSymbol) {
        const stockData = await fetchStockData(stockSymbol);
        if (stockData) {
          stockContext = `\n\n📊 Real-time data for ${stockData.symbol}:\nPrice: ₹${stockData.price}\nChange: ${stockData.change} (${stockData.changePercent})\nTime: ${stockData.timestamp}`;
        } else {
          stockContext = `\n\n⚠️ Could not fetch real-time data for ${stockSymbol}. Using general knowledge up to 2024.`;
        }
      }

      // Get AI response
      const aiResponse = await sendChatRequest(messages, userInput, stockContext);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.error('Chat error:', errorMsg);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Error: ${errorMsg}. Check your API keys in .env file.`,
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
