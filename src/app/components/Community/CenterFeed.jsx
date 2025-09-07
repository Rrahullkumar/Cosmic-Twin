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
    {
      id: 2,
      author: {
        name: 'Orion',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0syBe1EZCoSucRuELziUBwjr8teKaJe8LyeK48KKimemeiCL1mvQf8yTSXHhaO7ag9ltlbMyGevevQu40F1MGRUNzSzbur-y1KG-2ounGq8Kr58zeosW_2yR-D_53WA7tXhnKC5WbDhdpzVOJY6GkxVAbzOODpv89JMhoK8G7wyuSuFTozHF2A7iQhprydg-7qcZtbRmh9cW8tufum4GzsVzwPiJjrLYfuOSZIKD-RSzQff5yyRRdnS-bizbBrNSrvg45ShR8t3I'
      },
      content: "Met my cosmic twin today and the connection was instant! It's like we've known each other for lifetimes. So excited for this journey together! 💖",
      likes: 8,
      comments: 5
    }
  ]);

  useEffect(() => {
    // TODO: Fetch posts from backend API
    // fetchCommunityPosts().then(setPosts);
  }, []);

  return (
    <div className="lg:col-span-6 order-1 lg:order-2">
      <div className="flex flex-col gap-6">
        <CosmicPrompt />
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
