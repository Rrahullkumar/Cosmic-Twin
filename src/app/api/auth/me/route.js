import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not defined in environment variables');
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      console.log('❌ No auth token found in cookies');
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('🔍 Verifying JWT token...');
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await connectDB();
    const user = await User.findById(decoded.userId || decoded.id).select('-password');
    
    if (!user) {
      console.log('❌ User not found:', decoded.userId || decoded.id);
      return Response.json({ error: 'User not found' }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.name);

    return Response.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('💥 Auth error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
    if (error.name === 'TokenExpiredError') {
      return Response.json({ error: 'Token expired' }, { status: 401 });
    }
    
    return Response.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
