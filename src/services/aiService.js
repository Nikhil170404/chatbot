import axios from 'axios';
import { config } from '../utils/config';

/**
 * Send a chat request to OpenRouter AI
 * @param {Array} messages - Chat message history
 * @param {string} userInput - Current user input
 * @param {string} stockContext - Additional stock data context
 * @returns {Promise<string>} AI response
 */
export const sendChatRequest = async (messages, userInput, stockContext = '') => {
  if (!config.openRouterApiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  console.log('🔑 Using OpenRouter Key:', config.openRouterApiKey.substring(0, 20) + '...');

  const systemPrompt = `You are an expert on Indian stocks (NSE/BSE).
    Answer questions about companies like Reliance, TCS, HDFC Bank, Infosys, etc.
    Use rupees (₹) for prices. Be concise, professional, and helpful.
    If real data is provided, use it. Otherwise, rely on your knowledge up to 2024.
    Never give financial advice. Say "I am not a financial advisor" if asked for advice.
    Format responses clearly with bullet points where helpful.`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: userInput + stockContext }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${config.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://indian-stock-assistant.vercel.app',
          'X-Title': 'Indian Stock Assistant'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('❌ OpenRouter API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // Provide more helpful error messages
    if (error.response?.status === 401) {
      throw new Error('❌ Invalid OpenRouter API key. Please:\n1. Get a new key from https://openrouter.ai/keys\n2. Update your .env file\n3. Restart the server');
    }

    if (error.response?.status === 402) {
      throw new Error('❌ Insufficient credits. Add credits at https://openrouter.ai/credits');
    }

    if (error.response?.status === 429) {
      throw new Error('❌ Rate limit exceeded. Please wait a moment and try again.');
    }

    throw error;
  }
};
