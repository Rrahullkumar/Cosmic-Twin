'use client';
import { useState, useEffect } from 'react';
import CosmicPrompt from './CosmicPrompt';
import FeedPost from './FeedPost';

export default function CenterFeed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'Nova',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLSliCCsHdMqN9MhEXCH3FiJ4szfzRydmZxdU_AB5YPttgrSKgPLJizXsG6OzQyxxbFQybZaH0gCu5XCIkw8ZKCRmSqZK15mkCKU0YNGgVl0pHBtIyxJ_lwmOxQXWa-DdduPC2kfeDYM6c_Q4fdMvLTATw08Z-89a_sM1Qo98rBCvBDLxYWBBIUnbTNLSppFBuSV0x4wpG4N6ZtlGnMMVBvjE7A2594yyf3lmhnXSw4bXATcfLFmVIywJnfPDw9hdnw4k8fj_0FAs'
      },
      content: 'Just had an amazing meditation session connecting with my inner self. Feeling so grounded and aligned with the cosmos! 🧘‍♀️',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuBERPpAy09Fx6PJL_iT99CWUxh3YvVfefWnLYuI7NyiTRsFT3jgwRXWRV8Kfvb1s6CmNkMaYWedQxBdMzV4uUlQIl3f6zKPG_PiJR0tLBK5aXDh2P4zkY5Fiu_mfrcNfAGhC8Wzdcq6epY2y8J_QjTmasK6EqTovXwGbKDRrbGdNktUnKjl6SadUhyCpMSTUKscaSIOirmUsNL-ZKt8vFWkJAJbB6AOVUR3Be32SUtmTeYyLf-6eDAVTVx9AIaXcOORMHX_6PNco',
      likes: 12,
      comments: 3
    },
    // Add more posts for scrolling demo
    ...Array.from({ length: 8 }).map((_, i) => ({
      id: i + 2,
      author: {
        name: `User ${i + 2}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 2}`
      },
      content: `This is a demo post ${i + 2} to show scrolling behavior. The center content scrolls while sidebars stay fixed! 🌟`,
      likes: Math.floor(Math.random() * 20),
      comments: Math.floor(Math.random() * 10)
    }))
  ]);

  return (
    <div className="flex-1 h-screen overflow-y-auto scrollbar-hide">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <CosmicPrompt />
        {posts.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
