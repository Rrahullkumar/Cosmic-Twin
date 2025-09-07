export default function ChatMessage({ message, isCurrentUser = false }) {
  const { sender, content, avatar, timestamp } = message;

  return (
    <div className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : ''}`}>
      {!isCurrentUser && (
        <div
          className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0"
          style={{ backgroundImage: `url("${avatar}")` }}
        />
      )}
      <div className={`flex flex-col gap-1 ${isCurrentUser ? 'items-end' : 'items-start'} max-w-xs`}>
        <p className="text-[var(--subtle-text)] text-xs">{sender}</p>
        <p className={`text-sm font-medium leading-normal rounded-2xl px-4 py-2 break-words ${
          isCurrentUser 
            ? 'bg-[var(--muted-pink)] text-white' 
            : 'bg-[var(--warm-lilac-gray)] text-[var(--dark-text)]'
        }`}>
          {content}
        </p>
      </div>
      {isCurrentUser && (
        <div
          className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0"
          style={{ backgroundImage: `url("${avatar}")` }}
        />
      )}
    </div>
  );
}
