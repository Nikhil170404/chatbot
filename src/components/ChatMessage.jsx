import React from 'react';

/**
 * ChatMessage Component - Displays a single chat message
 * @param {Object} props
 * @param {Object} props.message - Message object with role and content
 * @param {string} props.message.role - 'user' or 'assistant'
 * @param {string} props.message.content - Message text
 * @param {boolean} props.message.isError - Whether this is an error message
 */
const ChatMessage = React.memo(({ message }) => {
  const { role, content, isError } = message;

  const getAvatar = () => {
    if (role === 'user') return '👤';
    if (isError) return '⚠️';
    return '📊';
  };

  return (
    <div className={`message message-${role} ${isError ? 'error' : ''}`}>
      <div className="message-avatar">
        {getAvatar()}
      </div>
      <div className="message-bubble">
        {content}
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
