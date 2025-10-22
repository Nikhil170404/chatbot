import { useState, useEffect } from 'react';
import { sendChatRequest } from '../services/aiService';
import { fetchStockData, formatStockData } from '../services/stockService';

const STORAGE_KEY = 'indiaStockChat';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds between retries

/**
 * Custom hook for managing chat state with retry logic
 */
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        console.log('✅ Loaded chat history from localStorage');
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage when messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    console.log('💾 Saved to localStorage. Total messages:', messages.length);
  }, [messages]);

  /**
   * Retry function with exponential backoff
   */
  const retryWithBackoff = async (fn, retries = MAX_RETRIES) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${retries}...`);
        setLoadingStatus(`Attempt ${attempt}/${retries}...`);
        return await fn();
      } catch (error) {
        if (attempt === retries) {
          throw error; // Last attempt failed
        }
        console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);
        setLoadingStatus(`Retrying in ${RETRY_DELAY / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  };

  /**
   * Send a message to the AI assistant with retry logic
   * @param {string} userInput - User's message
   * @param {string} stockSymbol - Optional stock symbol for data fetching
   * @param {string} stockName - Optional stock name for better search
   */
  const sendMessage = async (userInput, stockSymbol = '', stockName = '') => {
    if (!userInput.trim()) return;

    const userMsg = { role: 'user', content: userInput };
    console.log('👤 Adding user message:', userMsg);
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setLoadingStatus('Fetching stock data...');

    try {
      // Fetch real stock data if symbol or name provided
      let stockContext = '';
      let realStockData = null;

      if (stockSymbol || stockName) {
        try {
          console.log('🔍 Fetching real stock data...');
          setLoadingStatus('📊 Searching for stock data...');
          realStockData = await fetchStockData(stockSymbol, stockName);
          
          if (realStockData) {
            // Format the stock data nicely
            stockContext = '\n\n' + formatStockData(realStockData);
            console.log('✅ Real stock data retrieved and formatted');
            console.log('📊 Stock context length:', stockContext.length, 'characters');
            setLoadingStatus('💭 Generating AI response...');
          } else {
            stockContext = `\n\n⚠️ Could not fetch real-time data for ${stockSymbol || stockName}. Please provide information based on your general knowledge.`;
            setLoadingStatus('💭 Generating AI response (without real data)...');
          }
        } catch (error) {
          console.error('❌ Error fetching stock data:', error.message);
          stockContext = `\n\n⚠️ Error fetching data: ${error.message}\n\nPlease answer based on your general knowledge up to 2024.`;
          setLoadingStatus('💭 Generating AI response (error in data fetch)...');
        }
      }

      // Get AI response with retry logic
      console.log('🤖 Requesting AI response...');
      setLoadingStatus('🤖 Contacting AI service...');

      let aiResponse;
      try {
        aiResponse = await retryWithBackoff(
          () => sendChatRequest(messages, userInput, stockContext)
        );
      } catch (error) {
        console.error('❌ AI response failed after retries:', error.message);
        throw error;
      }
      
      console.log('📝 AI Response received:');
      console.log('   Length:', aiResponse.length, 'characters');
      console.log('   Preview:', aiResponse.substring(0, 100) + '...');

      // Validate response
      if (!aiResponse || aiResponse.trim() === '') {
        throw new Error('AI returned empty response - validation failed');
      }

      // Create the message object
      const assistantMessage = { 
        role: 'assistant', 
        content: aiResponse,
        isStockData: !!realStockData
      };

      console.log('💬 Creating assistant message:', assistantMessage);
      
      // Add AI response to messages
      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        console.log('✅ Message state updated');
        console.log('   Total messages now:', newMessages.length);
        return newMessages;
      });
      
      setLoadingStatus('✅ Response received!');
      console.log('✅ AI Response added to chat');
    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.error('❌ Chat error:', errorMsg);
      console.error('   Full error:', error);
      
      setLoadingStatus('❌ Error occurred');

      let errorContent = `❌ Error: ${errorMsg}\n\n`;

      // Provide specific troubleshooting
      if (errorMsg.includes('401') || errorMsg.includes('Invalid')) {
        errorContent += '🔑 **API Key Issue:**\n';
        errorContent += '• Your OpenRouter API key may be invalid\n';
        errorContent += '• Get a new key from: https://openrouter.ai/keys\n';
        errorContent += '• Update .env file and restart\n\n';
      }

      if (errorMsg.includes('402') || errorMsg.includes('credit')) {
        errorContent += '💳 **Credit Issue:**\n';
        errorContent += '• Your account has insufficient credits\n';
        errorContent += '• Add credits at: https://openrouter.ai/credits\n';
        errorContent += '• Minimum: $5\n\n';
      }

      if (errorMsg.includes('429') || errorMsg.includes('rate')) {
        errorContent += '⏱️ **Rate Limited:**\n';
        errorContent += '• You\'re sending requests too fast\n';
        errorContent += '• Wait 30 seconds and try again\n\n';
      }

      if (errorMsg.includes('empty') || errorMsg.includes('Empty')) {
        errorContent += '📡 **API Response Issue:**\n';
        errorContent += '• OpenRouter API returned empty response\n';
        errorContent += '• Check API status: https://openrouter.ai/status\n';
        errorContent += '• Try a simpler question first\n\n';
      }

      errorContent += 'Troubleshooting:\n';
      errorContent += '• Check your OpenRouter API key\n';
      errorContent += '• Ensure you have credits\n';
      errorContent += '• Verify API status is good\n';
      errorContent += '• Try again in a moment\n';
      errorContent += '• Check backend is running';

      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        isError: true
      };

      console.log('🚨 Adding error message:', errorMessage);
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
      console.log('✅ Request completed. isLoading set to false');
    }
  };

  /**
   * Clear all chat messages
   */
  const clearMessages = () => {
    console.log('🗑️ Clearing all messages');
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setLoadingStatus('');
    console.log('✅ Messages cleared');
  };

  return {
    messages,
    isLoading,
    loadingStatus,
    sendMessage,
    clearMessages
  };
};