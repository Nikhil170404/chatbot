import axios from 'axios';
import { config } from '../utils/config';

/**
 * Send a chat request to OpenRouter AI with timeout and validation
 * @param {Array} messages - Chat message history
 * @param {string} userInput - Current user input
 * @param {string} stockContext - Additional stock data context
 * @returns {Promise<string>} AI response
 */
export const sendChatRequest = async (messages, userInput, stockContext = '') => {
  if (!config.openRouterApiKey) {
    throw new Error('❌ OpenRouter API key not configured');
  }

  const currentDate = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const systemPrompt = `🔴 YOU MUST FOLLOW THESE RULES:

TODAY'S DATE: ${currentDate}

CRITICAL - REAL DATA PROVIDED:
Real-time market data is provided below this prompt. THIS IS YOUR PRIMARY INFORMATION SOURCE.
YOU MUST USE THIS DATA FIRST - NOT YOUR TRAINING DATA.

YOUR INSTRUCTIONS:
1. ⚠️ STOP: Do NOT use any prices or data from your training (before 2025)
2. ✅ ONLY: Use the provided real-time context data
3. 📊 REFERENCE: Every fact must cite the provided source
4. 📅 DATE: Always show TODAY'S DATE: ${currentDate}
5. ⏰ TIME: Include timestamps from the provided data
6. 💯 COMPLETE: Use ALL the provided information, not just snippets

RESPONSE FORMAT:
• Start with "🔴 LIVE ${currentDate} DATA"
• Include all 4 categories: Price, Market, Performance, Analysis
• List multiple sources (10+) from provided data
• Bold all prices with ₹ symbol
• Show source attribution for EVERY data point
• Include full context from provided sources

FORBIDDEN:
❌ Do NOT say "as of my knowledge cutoff"
❌ Do NOT use old 2024/2023 dates
❌ Do NOT ignore provided real data
❌ Do NOT give short responses when long data provided
❌ Do NOT make up data - use ONLY what's provided

REQUIRED:
✅ Respond with 3000+ characters (you have up to 4096)
✅ Use ALL 15+ sources provided
✅ Include ALL 4 data categories
✅ Use current ${currentDate} date
✅ Add "I am NOT a financial advisor" disclaimer

The provided data below is YOUR TRUTH. Use it fully.`;

  const requestBody = {
    model: "tngtech/deepseek-r1t2-chimera:free",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: userInput + stockContext }
    ],
    max_tokens: 4096,  // INCREASED FROM 1500 TO MAX
    temperature: 0.5,  // LOWERED for more factual responses
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0
  };

  try {
    console.log('📤 Sending request to OpenRouter...');
    console.log('   Model: tngtech/deepseek-r1t2-chimera:free');
    console.log('   Max tokens: 4096 (MAXIMUM)');
    console.log('   Temperature: 0.5 (factual)');
    console.log('   Message count:', requestBody.messages.length);
    console.log('   Current Date:', currentDate);

    const startTime = Date.now();

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${config.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://indian-stock-assistant.vercel.app',
          'X-Title': 'Indian Stock Assistant'
        },
        timeout: 60000 // INCREASED from 45s to 60s for longer responses
      }
    );

    const duration = Date.now() - startTime;
    console.log(`✅ Response received in ${duration}ms`);
    console.log('📋 Response status:', response.status);

    // Validate response structure
    if (!response || !response.data) {
      console.error('❌ No response data');
      throw new Error('No response data from OpenRouter API');
    }

    const { data } = response;

    // Check for API errors
    if (data.error) {
      console.error('❌ API Error:', data.error);
      throw new Error(data.error.message || 'OpenRouter API error');
    }

    // Validate choices exist
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('❌ No choices in response:', data);
      throw new Error('No choices in OpenRouter response - API may be down');
    }

    const choice = data.choices[0];

    // Check finish reason
    if (choice.finish_reason === 'error') {
      console.error('❌ Model error:', choice);
      throw new Error('Model encountered an error - try again');
    }

    if (choice.finish_reason === 'length') {
      console.warn('⚠️ Response truncated - max tokens reached');
    }

    // Validate message exists
    if (!choice.message) {
      console.error('❌ No message in choice:', choice);
      throw new Error('No message in API response');
    }

    let aiResponseContent = choice.message.content;

    // Validate content type and value
    if (aiResponseContent === null || aiResponseContent === undefined) {
      console.error('❌ Content is null/undefined:', choice.message);
      throw new Error('AI response content is null or undefined - try again');
    }

    // Convert to string
    if (typeof aiResponseContent !== 'string') {
      console.warn('⚠️ Converting non-string content to string');
      aiResponseContent = String(aiResponseContent);
    }

    // Trim whitespace
    aiResponseContent = aiResponseContent.trim();

    // Final validation
    if (aiResponseContent === '' || aiResponseContent.length === 0) {
      console.error('❌ Content is empty after processing');
      console.error('   Full message object:', choice.message);
      throw new Error('AI returned empty response - model may be having issues');
    }

    console.log('✅ AI Response valid');
    console.log('   Length:', aiResponseContent.length, 'characters');
    console.log('   Preview:', aiResponseContent.substring(0, 80) + '...');

    return aiResponseContent;

  } catch (error) {
    // Handle specific HTTP errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      console.error('❌ API Error Response:', {
        status,
        statusText: error.response.statusText,
        data: data
      });

      if (status === 401 || status === 403) {
        throw new Error('❌ Invalid OpenRouter API key (401/403). Get a new key from https://openrouter.ai/keys');
      }

      if (status === 402) {
        throw new Error('❌ Insufficient credits (402). Add credits at https://openrouter.ai/credits');
      }

      if (status === 429) {
        throw new Error('❌ Rate limit exceeded (429). Wait a moment and try again.');
      }

      if (status >= 500) {
        throw new Error(`❌ OpenRouter server error (${status}). Their API may be down - try again later.`);
      }

      throw new Error(`❌ API Error ${status}: ${error.response.statusText}`);
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      throw new Error('❌ Request timeout (60s). OpenRouter took too long to respond. Try again.');
    }

    // Handle network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('❌ Network error. Check your internet connection and OpenRouter status.');
    }

    // Handle known error patterns
    if (error.message.includes('empty')) {
      throw new Error('❌ Empty response from API. Check if API key is valid or has credits.');
    }

    // Re-throw if it's already our formatted error
    if (error.message.includes('❌')) {
      throw error;
    }

    // Generic error
    console.error('❌ Unexpected error:', error.message);
    throw new Error(`❌ Failed to get AI response: ${error.message}`);
  }
};