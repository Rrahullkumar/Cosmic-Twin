// NewPost.jsx
'use client';
import React, { useState } from 'react';
import PostModal from './PostModal';

const NewPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 overflow-hidden rounded-xl h-12 px-4 text-white text-base font-bold shadow-md hover:shadow-lg transition-shadow"
        style={{
          background: 'linear-gradient(to right, var(--muted-pink), var(--lavender-purple))'
        }}
      >
        <span className="text-xl">+</span>
        <span>Add New Post</span>
      </button>

      {isModalOpen && (
        <PostModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

export default NewPost;
