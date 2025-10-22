import React from 'react';

/**
 * LoadingIndicator Component - Shows loading state during API calls
 */
const LoadingIndicator = React.memo(() => {
  return (
    <div className="message message-assistant">
      <div className="message-avatar">📊</div>
      <div className="message-bubble loading">
        <div className="spinner"></div>
        <span>Analyzing...</span>
      </div>
    </div>
  );
});

LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator;
