// src/components/ChatInput.jsx
import React, { useState } from 'react';

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() && !imageUrl) return;
    onSend(input, imageUrl, stockSymbol.toUpperCase().trim());
    setInput('');
    setStockSymbol('');
    setImageUrl(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t bg-white">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any stock (e.g., 'Is TSLA overvalued?')"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          type="text"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value)}
          placeholder="Ticker (e.g. AAPL)"
          className="w-28 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <label className="cursor-pointer bg-gray-100 px-3 py-1 rounded text-sm flex items-center">
          📎 Upload Chart
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        
        <button
          type="submit"
          disabled={!input.trim() && !imageUrl}
          className={`px-4 py-2 rounded font-medium ${
            (!input.trim() && !imageUrl)
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Send
        </button>
      </div>

      {imageUrl && (
        <div className="mt-2 flex items-center gap-2">
          <img src={imageUrl} alt="Preview" className="h-12 w-12 object-cover rounded" />
          <span className="text-sm text-gray-600">Image attached</span>
        </div>
      )}
    </form>
  );
};

export default ChatInput;