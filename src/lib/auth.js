import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectDB } from './db';
import User from '../models/User';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      // console.log('User not found');
      return null;
    }

    // console.log(' User authenticated via JWT:', user.name);
    return user;
    
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}
