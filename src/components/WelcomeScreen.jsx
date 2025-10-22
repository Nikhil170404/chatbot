import React from 'react';
import StockButton from './StockButton';
import { INDIAN_STOCKS, EXAMPLE_QUERIES } from '../constants/stocks';

/**
 * WelcomeScreen Component - Initial screen shown when chat is empty
 * @param {Object} props
 * @param {Function} props.onStockSelect - Callback when stock is selected
 */
const WelcomeScreen = React.memo(({ onStockSelect }) => {
  return (
    <div className="welcome">
      <div className="welcome-content">
        <h2>📈 Working chatbot for stock prices</h2>
        <p>Get instant insights on NSE & BSE stocks</p>

        <div className="example-section">
          <p className="example-label">Popular stocks:</p>
          <div className="stock-grid">
            {INDIAN_STOCKS.map((stock, i) => (
              <StockButton
                key={i}
                stock={stock}
                onClick={onStockSelect}
              />
            ))}
          </div>
        </div>

        <div className="example-queries">
          <p className="example-label">Try asking:</p>
          <div className="query-list">
            {EXAMPLE_QUERIES.map((query, i) => (
              <span key={i}>• "{query}"</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';

export default WelcomeScreen;
