// src/app/api/posts/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch posts and convert to plain objects
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(); // Use .lean() to get plain objects instead of Mongoose documents

    // Format posts for frontend - ensure all ObjectIds are strings
    const formattedPosts = posts.map(post => ({
      id: post._id.toString(),
      content: post.content,
      image: post.image,
      author: {
        name: post.author.name,
        avatar: null,
        initials: post.author.initials
      },
      likes: post.likes || 0,
      comments: post.comments || 0,
      createdAt: post.createdAt
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
