import React, { useEffect, useState, useRef } from 'react';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import LoadingIndicator from './components/LoadingIndicator';
import { useChat } from './hooks/useChat';
import { validateConfig } from './utils/config';
import { checkEnvVariables } from './utils/envDebug';
import './App.css';

/**
 * Main App Component with enhanced loading states
 */
function App() {
  const { messages, isLoading, loadingStatus, sendMessage, clearMessages } = useChat();
  const [configError, setConfigError] = useState(null);
  const chatContainerRef = useRef(null);

  // Validate API configuration on mount
  useEffect(() => {
    checkEnvVariables();

    const validation = validateConfig();
    if (!validation.isValid) {
      setConfigError(validation.errors.join(', '));
      console.error('Configuration errors:', validation.errors);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [messages, isLoading]);

  /**
   * Handle stock selection from welcome screen
   */
  const handleStockSelect = (stock) => {
    const message = `Tell me about ${stock.name} stock price today with latest market information`;
    sendMessage(message, stock.symbol, stock.name);
  };

  /**
   * Handle message send from input
   */
  const handleSend = (input, stockSymbol) => {
    sendMessage(input, stockSymbol, '');
  };

  return (
    <div className="app">
      <Header onClear={clearMessages} />

      <div className="chat-container" ref={chatContainerRef}>
        {messages.length === 0 ? (
          configError ? (
            <div className="error-container">
              <div className="message message-assistant error">
                <div className="message-avatar">⚠️</div>
                <div className="message-bubble">
                  ❌ API key not configured!
                  <br />
                  <br />
                  Please set REACT_APP_OPENROUTER_API_KEY in your .env file
                  <br />
                  Get your free key from: https://openrouter.ai/
                  <br />
                  <br />
                  Missing: {configError}
                </div>
              </div>
            </div>
          ) : (
            <WelcomeScreen onStockSelect={handleStockSelect} />
          )
        ) : (
          <div className="messages">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {isLoading && (
              <div className="loading-section">
                <LoadingIndicator message={loadingStatus || 'Processing'} />
                {loadingStatus && (
                  <div className="loading-status">
                    <small>{loadingStatus}</small>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}

export default App;