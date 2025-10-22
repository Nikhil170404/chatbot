import React from 'react';

/**
 * ChatMessage Component - Displays a single chat message with rich styling
 * DEBUG VERSION - Shows what content is received
 */
const ChatMessage = React.memo(({ message }) => {
  const { role, content, isError, isStockData } = message;

  // Log what we receive
  React.useEffect(() => {
    console.log('🎨 ChatMessage rendered:');
    console.log('   Role:', role);
    console.log('   Content type:', typeof content);
    console.log('   Content length:', content?.length || 0);
    console.log('   Content is empty?', !content || content.trim() === '');
    console.log('   Is stock data?', isStockData);
    console.log('   Is error?', isError);
    if (content) {
      console.log('   Content preview:', content.substring(0, 150));
    }
  }, [message, role, content, isError, isStockData]);

  const getAvatar = () => {
    if (role === 'user') return '👤';
    if (isError) return '⚠️';
    if (isStockData) return '📊';
    return '💬';
  };

  // Format content with markdown-like styling
  const formatContent = (text) => {
    console.log('🔄 formatContent called with:', text?.length, 'characters');
    
    if (!text) {
      console.log('⚠️ No text provided to formatContent');
      return <p style={{ margin: 0 }}>No content available</p>;
    }

    if (typeof text !== 'string') {
      console.error('❌ Text is not a string, it is:', typeof text, text);
      return <p style={{ margin: 0 }}>Invalid content type</p>;
    }

    if (text.trim() === '') {
      console.log('⚠️ Text is empty string');
      return <p style={{ margin: 0 }}>No content available</p>;
    }

    // Split by lines and process
    const lines = text.split('\n');
    console.log('📄 Processing', lines.length, 'lines');

    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} style={{ height: '8px' }} />;
      }

      // Bold text: **text**
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Italic text: *text*
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Links: [text](url)
      line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #0084ff; text-decoration: underline; cursor: pointer;">$1</a>');

      return (
        <div 
          key={idx} 
          style={{ 
            marginBottom: idx < lines.length - 1 ? '8px' : '0',
            lineHeight: '1.5'
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: line }} />
        </div>
      );
    });
  };

  console.log('📮 Rendering ChatMessage with content length:', content?.length);

  return (
    <div className={`message message-${role} ${isError ? 'error' : ''} ${isStockData ? 'stock-data' : ''}`}>
      <div className="message-avatar" title={role === 'user' ? 'You' : 'Stock Assistant'}>
        {getAvatar()}
      </div>
      <div className={`message-bubble ${isStockData ? 'stock-bubble' : ''}`}>
        {isStockData || isError ? (
          <div style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {formatContent(content)}
          </div>
        ) : (
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {content || 'No content'}
          </p>
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;