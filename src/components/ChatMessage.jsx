// src/components/ChatMessage.jsx
import React from 'react';
import { FaUser, FaChartLine } from 'react-icons/fa';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-lg max-w-xs lg:max-w-2xl break-words ${
        isUser 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-800 border border-gray-200'
      }`}>
        {isUser ? (
          <FaUser className="inline mr-2 mb-1" />
        ) : (
          <FaChartLine className="inline mr-2 mb-1 text-green-600" />
        )}
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;