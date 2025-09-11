// src/app/api/galaxy/users/route.js
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    // Get users with populated matched_planet data
    const users = await User.find({
      planet_matched: true,
      matched_planet: { $exists: true }
    }).select('name email matched_planet').lean();

    console.log('🌌 Fetched users:', users.length);
    console.log('👥 Sample user data:', users[0]); // Debug log

    return Response.json(users);
  } catch (error) {
    console.error('❌ Galaxy users error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
