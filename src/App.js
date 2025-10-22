// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OPENROUTER_KEY = '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';
const ALPHA_VANTAGE_KEY = 'E7OITS39T31MMGH6';

// Indian stock examples
const INDIAN_STOCKS = [
  "RELIANCE.BSE",
  "TCS.BSE",
  "HDFCBANK.NS",
  "INFY.NS",
  "ICICIBANK.BSE",
  "SBIN.BSE",
  "BHARTIARTL.NS",
  "KOTAKBANK.NS"
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Load chat history
  useEffect(() => {
    const saved = localStorage.getItem('indiaStockChat');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('indiaStockChat', JSON.stringify(messages));
  }, [messages]);

  // Fetch real stock data from Alpha Vantage
  const fetchStockData = async (symbol) => {
    if (!symbol) return null;
    
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
      );
      
      const quote = response.data['Global Quote'];
      if (quote && quote['01. symbol']) {
        return {
          symbol: quote['01. symbol'],
          price: quote['05. price'],
          change: quote['09. change'],
          changePercent: quote['10. change percent'],
        };
      }
    } catch (error) {
      console.warn('Alpha Vantage error:', error.message);
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() && !imageUrl) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Fetch real stock data if symbol provided
      let stockData = null;
      if (stockSymbol) {
        stockData = await fetchStockData(stockSymbol);
      }

      // Build context for AI
      let context = "";
      if (stockData) {
        context = `\n\nReal-time data for ${stockData.symbol}:\nPrice: ₹${stockData.price}\nChange: ${stockData.change} (${stockData.changePercent})`;
      } else if (stockSymbol) {
        context = `\n\nNote: Could not fetch real data for ${stockSymbol}. Using general knowledge.`;
      }

      // Call OpenRouter AI
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content: `You are an expert on Indian stocks (NSE/BSE). 
              Answer questions about companies like Reliance, TCS, HDFC Bank, Infosys, etc.
              Use rupees (₹) for prices. Be concise, professional, and helpful.
              If real data is provided, use it. Otherwise, rely on your knowledge up to 2024.
              Never give financial advice. Say "I am not a financial advisor" if asked for advice.`
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: input + context }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please check your API keys.' 
      }]);
    } finally {
      setIsLoading(false);
      setImageUrl(null);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('indiaStockChat');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🇮🇳 India Stock AI</h1>
        <p>Ask about NSE/BSE stocks — Reliance, TCS, HDFC, Infosys & more</p>
        <button className="clear-btn" onClick={clearChat}>Clear</button>
      </header>

      <div className="chat">
        {messages.length === 0 ? (
          <div className="welcome">
            <h2>Ask about Indian Stocks!</h2>
            <p>Get insights on NSE & BSE companies with real data</p>
            <div className="examples">
              {INDIAN_STOCKS.slice(0, 4).map((stock, i) => (
                <span key={i} className="example-tag">{stock}</span>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className={`avatar ${msg.role}`}>
                {msg.role === 'user' ? '👤' : '📊'}
              </div>
              <div className={`bubble ${msg.role}`}>{msg.content}</div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      <div className="input-area">
        <div className="input-group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any Indian stock..."
            className="input-field"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <input
            type="text"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            placeholder="Ticker (e.g. RELIANCE.BSE)"
            className="input-field ticker-input"
          />
        </div>

        <div className="actions">
          <button className="upload-btn" disabled>
            📎 Upload Chart (Coming Soon)
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="send-btn"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}