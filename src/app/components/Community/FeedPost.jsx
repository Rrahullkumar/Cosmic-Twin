// FeedPost.jsx
'use client';
import { useEffect } from 'react';

export default function FeedPost({ post }) {
  const { id, author, content, image, likes = 0, comments = 0, liked = false } = post;

  // Load Material Symbols font
  useEffect(() => {
    if (!document.querySelector('link[href*="material-symbols"]')) {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  const handleLike = async () => {
    // TODO: Send like to backend API
  };

  const handleComment = () => {
    console.log('Comment on post:', id);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {/* User Avatar or Initials */}
        {author.avatar ? (
          <div
            className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url("${author.avatar}")` }}
          />
        ) : (
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: 'var(--muted-pink)' }}
          >
            {author.initials || author.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
          </div>
        )}

        <div className="flex-grow min-w-0">
          <p className="text-[var(--dark-text)] text-base font-bold">{author.name}</p>
          <p className="text-[var(--subtle-text)] text-sm mb-3 break-words">
            {content}
          </p>
          {image && (
            <div
              className="aspect-video bg-cover bg-center rounded-xl mb-3 max-w-full"
              style={{ backgroundImage: `url("${image}")` }}
            />
          )}
          <div className="flex items-center gap-4 text-[var(--subtle-text)]">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                liked ? 'text-red-500' : 'hover:text-[var(--muted-pink)]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {liked ? 'favorite' : 'favorite_border'}
              </span>
              <span className="text-sm">{likes} Like{likes !== 1 ? 's' : ''}</span>
            </button>
            <button 
              onClick={handleComment}
              className="flex items-center gap-1 hover:text-[var(--muted-pink)] transition-colors"
            >
              <span className="material-symbols-outlined text-xl">chat_bubble_outline</span>
              <span className="text-sm">{comments} Comment{comments !== 1 ? 's' : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
