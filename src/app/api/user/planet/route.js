import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    
    // Get user with populated planet data
    const userWithPlanet = await User.findById(user._id);
    
    if (!userWithPlanet.matched_planet) {
      return Response.json({ 
        error: 'No planet matched yet. Please complete the quiz first.' 
      }, { status: 404 });
    }

    // Ensure traits is an array
    const planet = userWithPlanet.matched_planet;
    if (planet.traits && !Array.isArray(planet.traits)) {
      planet.traits = [planet.traits];
    }

    // console.log(' Planet data being returned:', JSON.stringify(planet, null, 2));

    return Response.json({
      success: true,
      planet: planet
    });

  } catch (error) {
    console.error('Get planet error:', error);
    return Response.json({ 
      error: 'Failed to get planet data' 
    }, { status: 500 });
  }
}
