// src/utils/openrouter.js
import axios from 'axios';

const API_KEY = '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';

export const askAI = async (messages, imageUrl = null, stockSymbol = null) => {
  // Use a strong free model (good for finance)
  let model = 'mistralai/mistral-7b-instruct';

  // System prompt to enforce stock expertise
  const systemPrompt = `You are a professional stock and financial analyst AI. 
Your job is to answer questions about ANY stock (e.g., AAPL, TSLA, MSFT, GOOGL, AMZN, etc.) with accuracy and clarity.
- Always mention the stock ticker symbol.
- Explain financial terms (P/E, EPS, market cap, etc.) simply.
- Do NOT hallucinate numbers. If unsure, say "I don't have real-time data" or "Based on my knowledge up to 2024...".
- If the user uploads an image (chart, graph), analyze it as a stock chart.
- Keep answers concise but informative.
${stockSymbol ? `Current context: user is asking about ${stockSymbol}.` : ''}`;

  const payload = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: [
          { type: 'text', text: msg.content },
          ...(imageUrl && msg.role === 'user' 
            ? [{ type: 'image_url', image_url: { url: imageUrl } }] 
            : []
          ),
        ],
      })),
    ],
  };

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      payload,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter Error:', error.response?.data || error.message);
    throw new Error('Failed to get AI response. Check your API key.');
  }
};