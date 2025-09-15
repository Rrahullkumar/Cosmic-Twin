import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST() {
  try {
    // console.log(' Starting twinmate search...');

    const user = await getCurrentUser();
    // console.log('👤 Current user:', user?.name || 'Not authenticated');

    if (!user) {
      // console.log('❌ User not authenticated');
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    // console.log('✅ Database connected');

    const userWithVector = await User.findById(user._id);
    // console.log(' User vector exists:', !!userWithVector?.personality_vector);
    // console.log(' Vector length:', userWithVector?.personality_vector?.length || 0);

    if (!userWithVector || !userWithVector.personality_vector) {
      // console.log(' No personality vector found');
      return Response.json({
        success: false,
        error: 'Please complete the personality quiz first to find twinmates'
      }, { status: 400 });
    }

    // ✨ PERFORM ACTUAL QDRANT SEARCH
    // console.log('🔍 Searching for twinmates using Qdrant...');
    // console.log('🌐 Qdrant URL:', process.env.QDRANT_URL);

    const response = await fetch(`${process.env.QDRANT_URL}/collections/users/points/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.QDRANT_API_KEY
      },
      body: JSON.stringify({
        vector: userWithVector.personality_vector,
        limit: 10,
        with_payload: true,
        score_threshold: 0.1 // Only return matches with decent similarity
      })
    });

    // console.log('📡 Qdrant response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Qdrant search failed:', {
        status: response.status,
        error: errorText
      });
      
      // Return mock data as fallback
      const mockTwinmates = [
        { id: 'mock1', name: "Luna StarSeeker", planet: "Mystical Venus", compatibility: "94%", avatar: null },
        { id: 'mock2', name: "Cosmic Wanderer", planet: "Azure Neptune", compatibility: "91%", avatar: null }
      ];

      return Response.json({
        success: true,
        twinmates: mockTwinmates,
        note: `Qdrant search failed (${response.status}): Using sample data`
      });
    }

    const searchData = await response.json();
    // console.log(' Raw search results:', searchData.result?.length || 0);

    if (!searchData.result || searchData.result.length === 0) {
      // console.log(' No search results found');
      return Response.json({
        success: true,
        twinmates: [],
        note: 'No twinmates found with current similarity threshold'
      });
    }

    // ✨ PROCESS REAL SEARCH RESULTS
    const searchResults = searchData.result || [];

    // Filter out current user and format results
    const twinmates = searchResults
      .filter(result => {
        // console.log(' Checking result:', result.payload?.mongoUserId, 'vs current user:', user._id.toString());
        return result.payload?.mongoUserId !== user._id.toString();
      })
      .slice(0, 5)
      .map(result => {
        const compatibility = Math.round((result.score || 0) * 100);
        // console.log('✨ Found match:', result.payload?.name, 'compatibility:', compatibility + '%');
        
        return {
          id: result.payload?.mongoUserId || 'unknown',
          name: result.payload?.name || 'Unknown User',
          planet: 'Cosmic Planet', // You can enhance this later with actual planet data
          compatibility: `${compatibility}%`,
          avatar: null
        };
      });

    // console.log(' Found twinmates:', twinmates.length);
    // console.log(' Twinmate details:', twinmates.map(t => `${t.name} (${t.compatibility})`));

    return Response.json({
      success: true,
      twinmates: twinmates,
      debug: {
        userId: user._id.toString(),
        userName: user.name,
        hasVector: !!userWithVector.personality_vector,
        totalResults: searchResults.length,
        filteredResults: twinmates.length
      }
    });

  } catch (error) {
    console.error('💥 Twinmate search error:', error);
    
    // Always return mock data as fallback for errors
    const mockTwinmates = [
      { id: 'mock1', name: "Luna StarSeeker", planet: "Mystical Venus", compatibility: "94%", avatar: null },
      { id: 'mock2', name: "Cosmic Wanderer", planet: "Azure Neptune", compatibility: "91%", avatar: null }
    ];

    return Response.json({
      success: true,
      twinmates: mockTwinmates,
      note: `Search error: ${error.message}`,
      debug: {
        error: error.message
      }
    });
  }
}
