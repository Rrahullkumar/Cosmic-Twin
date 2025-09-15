import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // console.log(`🔍 Finding match for user: ${user.name} (ID: ${user._id})`);

    // Get fresh user data from MongoDB
    await connectDB();
    const userDoc = await User.findById(user._id);
    
    // console.log('📋 User document check:', {
    //   userId: userDoc._id,
    //   quiz_completed: userDoc.quiz_completed,
    //   qdrant_point_id: userDoc.qdrant_point_id,
    //   hasQdrantPointId: !!userDoc.qdrant_point_id
    // });
    
    if (!userDoc.quiz_completed) {
      return Response.json({ 
        error: 'Quiz not completed. Please complete the quiz first.' 
      }, { status: 404 });
    }

    if (!userDoc.qdrant_point_id) {
      return Response.json({ 
        error: 'Quiz results not found in database. Please complete the quiz again.' 
      }, { status: 404 });
    }

    // console.log('🔍 Fetching user vector from Qdrant with ID:', userDoc.qdrant_point_id);

    // Get user's embedding from Qdrant
    const userResponse = await fetch(`${process.env.QDRANT_URL}/collections/users/points/${userDoc.qdrant_point_id}`, {
      headers: {
        'api-key': process.env.QDRANT_API_KEY
      }
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('❌ Qdrant user lookup failed:', errorText);
      return Response.json({ 
        error: 'User quiz results not found in vector database. Please complete the quiz again.' 
      }, { status: 404 });
    }

    const userData = await userResponse.json();
    const userVector = userData.result.vector;

    // console.log('✅ User vector retrieved, length:', userVector.length);

    // Search for similar planets
    // console.log('🔍 Searching for matching planets...');
    const searchResponse = await fetch(`${process.env.QDRANT_URL}/collections/planets/points/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.QDRANT_API_KEY
      },
      body: JSON.stringify({
        vector: userVector,
        limit: 3,
        with_payload: true,
        // score_threshold: 0.1 // Lowered threshold for better matches
      })
    });

    const searchData = await searchResponse.json();
    // console.log('🔍 Planet search results:', searchData.result?.length || 0, 'matches');
    
    if (!searchData.result || searchData.result.length === 0) {
      return Response.json({ 
        error: 'No matching planet found. This is unusual - please try again.' 
      }, { status: 404 });
    }

    // Get the best match
    const bestMatch = searchData.result[0];
    const matchedPlanet = {
      id: bestMatch.id,
      name: bestMatch.payload.name,
      type: bestMatch.payload.type,
      description: bestMatch.payload.description,
      traits: bestMatch.payload.traits,
      image: bestMatch.payload.image,
      community_vibe: bestMatch.payload.community_vibe,
      element: bestMatch.payload.element,
      similarity_score: bestMatch.score
    };

    // console.log('🪐 Best match found:', matchedPlanet.name, 'with score:', bestMatch.score);

    // Save to MongoDB
    await User.findByIdAndUpdate(user._id, {
      matched_planet: {
        ...matchedPlanet,
        matched_at: new Date()
      },
      planet_matched: true
    });

    return Response.json({
      success: true,
      matched_planet: matchedPlanet,
      message: `Welcome to ${matchedPlanet.name}! You are a ${matchedPlanet.type} type.`
    });

  } catch (error) {
    console.error('💥 Planet matching error:', error);
    return Response.json({ 
      error: 'Failed to match planet: ' + error.message 
    }, { status: 500 });
  }
}
