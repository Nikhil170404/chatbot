import React from 'react';

/**
 * LoadingIndicator Component - Shows loading state with better feedback
 */
const LoadingIndicator = React.memo(({ message = 'Analyzing...' }) => {
  const [dotCount, setDotCount] = React.useState(0);

  // Animated dots: ... .. ...
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const dots = '.'.repeat(dotCount);

  return (
    <div className="message message-assistant">
      <div className="message-avatar">📊</div>
      <div className="message-bubble loading">
        <div className="spinner"></div>
        <span>{message}{dots}</span>
      </div>
    </div>
  );
});

LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator;