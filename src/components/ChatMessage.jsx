import React from 'react';

/**
 * ChatMessage Component - Displays a single chat message with rich styling
 * @param {Object} props
 * @param {Object} props.message - Message object with role and content
 * @param {string} props.message.role - 'user' or 'assistant'
 * @param {string} props.message.content - Message text
 * @param {boolean} props.message.isError - Whether this is an error message
 * @param {boolean} props.message.isStockData - Whether this has stock data
 */
const ChatMessage = React.memo(({ message }) => {
  const { role, content, isError, isStockData } = message;

  const getAvatar = () => {
    if (role === 'user') return '👤';
    if (isError) return '⚠️';
    if (isStockData) return '📊';
    return '💬';
  };

  // Format content with markdown-like styling
  const formatContent = (text) => {
    if (!text) return '';

    // Split by lines and process
    return text.split('\n').map((line, idx) => {
      // Bold text: **text**
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Italic text: *text*
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Links: [text](url)
      line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #0084ff; text-decoration: underline;">$1</a>');

      return <div key={idx} style={{ marginBottom: idx < text.split('\n').length - 1 ? '8px' : '0' }}>
        <div dangerouslySetInnerHTML={{ __html: line }} />
      </div>;
    });
  };

  return (
    <div className={`message message-${role} ${isError ? 'error' : ''} ${isStockData ? 'stock-data' : ''}`}>
      <div className="message-avatar" title={role === 'user' ? 'You' : 'Stock Assistant'}>
        {getAvatar()}
      </div>
      <div className={`message-bubble ${isStockData ? 'stock-bubble' : ''}`}>
        {isStockData || isError ? (
          formatContent(content)
        ) : (
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {content}
          </p>
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;