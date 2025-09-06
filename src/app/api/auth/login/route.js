import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    await connectDB();
    const user = await User.findOne({ email });
    
    if (!user) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email 
      },
      process.env.SESSION_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return Response.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}
