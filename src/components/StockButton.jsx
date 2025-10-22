import React from 'react';

/**
 * StockButton Component - Button for quick stock selection
 * @param {Object} props
 * @param {Object} props.stock - Stock object with symbol and name
 * @param {Function} props.onClick - Click handler
 */
const StockButton = React.memo(({ stock, onClick }) => {
  return (
    <button
      className="stock-btn"
      onClick={() => onClick(stock)}
      title={stock.name}
    >
      {stock.symbol}
    </button>
  );
});

StockButton.displayName = 'StockButton';

export default StockButton;
