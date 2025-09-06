import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getSessionCookie } from '@/lib/session';

export async function GET(request) {
  try {
    const sessionId = getSessionCookie(request);
    
    if (!sessionId) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(sessionId).select('-password');
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 401 });
    }

    return Response.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
