'use client';

// Generate user initials from name
const getUserInitials = (name) => {
  if (!name) return 'U';
  
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

// Generate consistent color based on user name
const getUserColor = (name) => {
  if (!name) return 'bg-gray-500';
  
  const colors = [
    'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-rose-500', 'bg-violet-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function ChatMessage({ message, isCurrentUser }) {
  const { sender, content, timestamp } = message;
  const initials = getUserInitials(sender.name);
  const avatarColor = getUserColor(sender.name);

  return (
    <div className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
      {/* User Avatar with Initials */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${avatarColor}`}>
        {initials}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-1 max-w-xs ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center gap-2 text-xs text-[var(--subtle-text)] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
          <span>{sender.name}</span>
          <span>{formatTime(timestamp)}</span>
        </div>
        
        <div className={`text-sm font-medium leading-normal rounded-2xl px-4 py-2 break-words ${
          isCurrentUser 
            ? 'bg-[var(--muted-pink)] text-white rounded-br-md' 
            : 'bg-[var(--warm-lilac-gray)] text-[var(--dark-text)] rounded-bl-md'
        }`}>
          {content}
        </div>
      </div>
    </div>
  );
}
