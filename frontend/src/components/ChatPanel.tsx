import React, { useState } from 'react';

interface ChatPanelProps {
  onSendMessage: (message: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div>
      <div className="h-96 bg-gray-700 rounded-lg p-4 overflow-y-auto">
        {/* Chat messages will go here */}
      </div>
      <div className="mt-4">
        <input
          type="text"
          className="w-full bg-gray-700 rounded-lg p-2"
          placeholder="Type your project prompt..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
