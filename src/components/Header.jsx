import React from 'react';

/**
 * Header Component - App header with title and clear button
 * @param {Object} props
 * @param {Function} props.onClear - Callback when clear button is clicked
 */
const Header = React.memo(({ onClear }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>🇮🇳 Stock Assistant</h1>
        <p>Real-time Indian Stock Information</p>
      </div>
      <button className="clear-btn" onClick={onClear}>
        Clear
      </button>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
