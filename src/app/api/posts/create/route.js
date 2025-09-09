// src/app/api/posts/create/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Post from '@/models/Post';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  try {
    // Use your existing auth function
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const content = formData.get('content');
    const imageFile = formData.get('image');

    let imagePath = null;

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const filename = `post_${Date.now()}_${imageFile.name}`;
      const path = join(process.cwd(), 'public', 'uploads', filename);
      
      // Save file
      await writeFile(path, buffer);
      imagePath = `/uploads/${filename}`;
    }

    // Connect to database using your existing function
    await connectDB();

    // Create post using Mongoose model
    const post = new Post({
      content,
      image: imagePath,
      author: {
        id: user._id,
        name: user.name || user.username,
        email: user.email,
        initials: (user.name || user.username || 'U')
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      }
    });

    // Save to database
    const savedPost = await post.save();

    return NextResponse.json({ 
      message: 'Post created successfully',
      postId: savedPost._id.toString() // Convert ObjectId to string
    });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
