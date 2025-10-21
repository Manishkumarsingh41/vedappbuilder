import React from 'react';

const ChatPanel = () => {
  return (
    <div>
      <div className="h-96 bg-gray-700 rounded-lg p-4 overflow-y-auto">
        {/* Chat messages will go here */}
      </div>
      <div className="mt-4">
        <input
          type="text"
          className="w-full bg-gray-700 rounded-lg p-2"
          placeholder="Type your message to Oscar..."
        />
      </div>
    </div>
  );
};

export default ChatPanel;
