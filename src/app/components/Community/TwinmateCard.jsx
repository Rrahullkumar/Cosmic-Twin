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

export default function TwinmateCard({ twinmate }) {
  const { name, planet, compatibility } = twinmate;
  const initials = getUserInitials(name);
  const avatarColor = getUserColor(name);

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
      
      {/* Compatibility Badge */}
      <div className="text-xs bg-gradient-to-r from-[var(--muted-pink)] to-[var(--lavender-purple)] text-white px-2 py-1 rounded-full font-semibold">
        {compatibility}
      </div>
    </div>
  );
}
