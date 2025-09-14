import React, { useState } from 'react';

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

// Add Friend Plus Icon Component
const AddFriendIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2.5} 
    stroke="currentColor" 
    className="w-4 h-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

// Checkmark Icon Component
const CheckIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2.5} 
    stroke="currentColor" 
    className="w-4 h-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

export default function TwinmateCard({ twinmate }) {
  const { name, planet, compatibility } = twinmate;
  const initials = getUserInitials(name);
  const avatarColor = getUserColor(name);
  
  // State to track friend request status
  const [requestSent, setRequestSent] = useState(false);
  
  // Handle add friend button click
  const handleAddFriendClick = (e) => {
    e.stopPropagation(); // Prevent triggering parent click handlers
    setRequestSent(true);
  };

  return (
    <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors group">
      {/* User Avatar with Initials */}
      <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${avatarColor} group-hover:scale-105 transition-transform`}>
        {initials}
      </div>
      
      <div className="flex-grow min-w-0">
        <p className="text-[var(--dark-text)] text-base font-bold break-words">{name}</p>
        <p className="text-[var(--subtle-text)] text-sm">{planet} · {compatibility}</p>
      </div>
      
      {/* Add Friend Icon Button */}
      <button
        onClick={handleAddFriendClick}
        disabled={requestSent}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 flex-shrink-0 bg-[var(--muted-pink)] ${
          requestSent 
            ? 'bg-green-100 text-green-600 cursor-default' 
            : 'bg-gradient-to-r from-[var(--muted-pink)] to-[var(--lavender-purple)] text-white hover:opacity-90 hover:shadow-lg transform hover:scale-110 active:scale-95'
        }`}
        aria-label={requestSent ? 'Friend Request Sent' : 'Add Friend'}
        title={requestSent ? 'Friend Request Sent' : 'Add Friend'}
      >
        {requestSent ? <CheckIcon /> : <AddFriendIcon />}
      </button>
    </div>
  );
}
