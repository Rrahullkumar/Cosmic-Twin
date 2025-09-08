'use client';
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatSidebar({ user }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef();

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch messages and poll for updates
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/chat/messages');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMessages(data.messages);
          }
        }
      } catch (error) {
        console.error('Fetch messages error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage('');
          // Message will appear in next poll
        }
      }
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-80 flex-shrink-0 sticky top-0 h-screen bg-white shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--warm-lilac-gray)' }}>
        <h3 className="text-[var(--dark-text)] text-lg font-bold mb-3">Community Chat</h3>
        
        {/* Chat Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--warm-lilac-gray)' }}>
          <button className="flex-1 text-center py-2 text-sm font-bold border-b-2 border-[var(--muted-pink)] text-[var(--dark-text)]">
            🌍 Global
          </button>
          <button disabled className="flex-1 text-center py-2 text-sm font-medium border-b-2 border-transparent text-[var(--subtle-text)] opacity-50">
            🪐 Local (Soon)
          </button>
        </div>
      </div>

      {/* Chat Messages - Scrollable */}
      <div className="flex-grow overflow-y-auto scrollbar-hide p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--subtle-text)] text-sm">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-[var(--subtle-text)] text-sm">
              <div className="mb-2">🌌</div>
              <div>No messages yet.</div>
              <div>Start the cosmic conversation!</div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} isCurrentUser={msg.isCurrentUser} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input - Sticky Bottom */}
      <div className="sticky bottom-0 bg-white border-t p-4" style={{ borderColor: 'var(--warm-lilac-gray)' }}>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 resize-none overflow-hidden rounded-full text-[var(--dark-text)] focus:outline-none focus:ring-2 focus:ring-[var(--muted-pink)] border-none bg-[var(--warm-lilac-gray)] h-11 placeholder:text-[var(--subtle-text)] px-4 text-sm"
            placeholder="Type a message..."
            maxLength={1000}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="flex items-center justify-center rounded-full h-11 w-11 bg-[var(--muted-pink)] text-white hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
