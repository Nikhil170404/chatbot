import React, { useState } from 'react';

/**
 * ChatInput Component - Input area for user messages and stock symbols
 * @param {Object} props
 * @param {Function} props.onSend - Callback when user sends a message
 * @param {boolean} props.isLoading - Whether the chat is processing
 */
const ChatInput = React.memo(({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input, stockSymbol);
    setInput('');
    setStockSymbol('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <div className="input-area">
      <div className="input-fields">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any Indian stock..."
          className="input-field main-input"
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <input
          type="text"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value)}
          placeholder="Stock ticker (e.g. RELIANCE.BSE)"
          className="input-field ticker-input"
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
      </div>

      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className="send-btn"
      >
        {isLoading ? 'Loading...' : 'Send'}
      </button>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
