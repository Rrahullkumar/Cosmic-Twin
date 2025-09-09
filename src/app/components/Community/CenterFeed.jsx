'use client';
import { useState, useEffect } from 'react';
import CosmicPrompt from './CosmicPrompt';
import FeedPost from './FeedPost';
import NewPost from './NewPost';
import Header from './Header';
import Poll from './Poll';

export default function CenterFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 h-screen overflow-y-auto scrollbar-hide">
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <div className="text-center py-8 text-[var(--subtle-text)]">
            Loading posts...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto scrollbar-hide">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <Header/>
        
        {/* Add the flex container for Poll and CosmicPrompt */}
        <div className="flex items-center gap-10 justify-between">
          <Poll />
          <CosmicPrompt />
        </div>
        
        <NewPost/>
        {posts.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
