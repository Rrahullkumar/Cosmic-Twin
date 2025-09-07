'use client';
import { useState } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatSidebar() {
  const [activeChat, setActiveChat] = useState('global');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Luna',
      content: 'Hey everyone! Anyone else feeling the cosmic vibes today? ✨',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbMIkA2CEWSkGeHxAcrXmEj_n9PdoDQTPEjurCVpOUX-naAmpHWPeSn7-b93mN7mZ84YBxWY0I47Br9OHGWzknHRTBF2QiDhBtb61o3lcov7tcF4E9vw5Um9ESVigIJutD2lJ6cwQqTHKkXbjQIG6X_1CMxVn35uORs0LHTpBuYSd2Y8kgYcxbOdXCP4r0z9z-PtOSO3YYGCRsI_ykvWSvOsOnGQZdIF2JZO42s88iHzhgrwh_LsBqQ4EeH3uW9eS3RNzUeVqQ1Lg',
      isCurrentUser: false
    },
    {
      id: 2,
      sender: 'Orion',
      content: "Totally, Luna! It's like the universe is whispering secrets. 🤫",
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0syBe1EZCoSucRuELziUBwjr8teKaJe8LyeK48KKimemeiCL1mvQf8yTSXHhaO7ag9ltlbMyGevevQu40F1MGRUNzSzbur-y1KG-2ounGq8Kr58zeosW_2yR-D_53WA7tXhnKC5WbDhdpzVOJY6GkxVAbzOODpv89JMhoK8G7wyuSuFTozHF2A7iQhprydg-7qcZtbRmh9cW8tufum4GzsVzwPiJjrLYfuOSZIKD-RSzQff5yyRRdnS-bizbBrNSrvg45ShR8t3I',
      isCurrentUser: true
    }
  ]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // TODO: Send message to backend API
    // await sendMessage({ content: message, chatType: activeChat });
    
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="lg:col-span-3 order-2 lg:order-1">
      <div className="bg-white rounded-2xl shadow-sm p-4 h-full flex flex-col">
        {/* Chat Tabs */}
        <div className="flex border-b mb-4" style={{ borderColor: 'var(--warm-lilac-gray)' }}>
          <button
            onClick={() => setActiveChat('global')}
            className={`flex-1 text-center py-3 font-bold text-base border-b-2 transition-colors ${
              activeChat === 'global'
                ? 'border-[var(--muted-pink)] text-[var(--dark-text)]'
                : 'border-transparent text-[var(--subtle-text)] hover:text-[var(--dark-text)]'
            }`}
          >
            🌍 Global Chat
          </button>
          <button
            onClick={() => setActiveChat('local')}
            className={`flex-1 text-center py-3 font-medium text-base border-b-2 transition-colors ${
              activeChat === 'local'
                ? 'border-[var(--muted-pink)] text-[var(--dark-text)]'
                : 'border-transparent text-[var(--subtle-text)] hover:text-[var(--dark-text)]'
            }`}
          >
            🪐 Local Chat
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow space-y-4 overflow-y-auto scrollbar-hide pr-2 max-h-60 lg:max-h-96">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} isCurrentUser={msg.isCurrentUser} />
          ))}
        </div>

        {/* Message Input */}
        <div className="mt-4 flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 resize-none overflow-hidden rounded-full text-[var(--dark-text)] focus:outline-none focus:ring-2 focus:ring-[var(--muted-pink)] border-none bg-[var(--warm-lilac-gray)] h-11 placeholder:text-[var(--subtle-text)] px-4 text-sm"
            placeholder="Type a message..."
          />
          <button 
            onClick={handleSendMessage}
            className="flex items-center justify-center rounded-full h-11 w-11 bg-[var(--muted-pink)] text-white hover:bg-opacity-90 transition-colors"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
