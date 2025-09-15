import { generateEmbedding } from '@/lib/mistral';
import { planetsData } from '@/data/planets';

export async function POST(request) {
  
  try {
    // Process all planets
    for (const planet of planetsData) {
      // console.log(`Processing ${planet.name}...`);
      // console.log(`- Planet ID (UUID): ${planet.id}`); // Now shows UUID
      
      // Generate embedding
      const embeddingText = `${planet.name} is a ${planet.type} planet. ${planet.description}`;
      const embedding = await generateEmbedding(embeddingText);
      
      // console.log('Embedding generated, length:', embedding.length);
      
      // Create payload with raw HTTP API
      const rawPayload = {
        points: [{
          id: planet.id, // Now uses UUID instead of "xylos"
          vector: embedding,
          payload: {
            name: planet.name,
            slug: planet.slug, // Keep original identifier as metadata
            type: planet.type,
            description: planet.description.slice(0, 500),
            traits: planet.traits,
            image: planet.image,
            community_vibe: planet.community_vibe,
            element: planet.element
          }
        }]
      };
      
      // console.log('🌐 Making HTTP request to Qdrant...');
      
      // Raw HTTP request (since JS SDK had issues)
      const response = await fetch(`${process.env.QDRANT_URL}/collections/planets/points`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.QDRANT_API_KEY
        },
        body: JSON.stringify(rawPayload)
      });
      
      if (response.ok) {
        // console.log(`✅ ${planet.name} seeded successfully!`);
      } else {
        const errorText = await response.text();
        console.error(`❌ Failed to seed ${planet.name}:`, errorText);
        throw new Error(`Qdrant error: ${response.status} - ${errorText}`);
      }
    }
    
    return Response.json({
      success: true,
      message: `✅ All ${planetsData.length} planets seeded successfully with UUID IDs!`,
      fix_applied: 'Changed point IDs from strings to UUIDs'
    });
    
  } catch (error) {
    console.error('💥 Seeding error:', error);
    return Response.json({
      error: error.message
    }, { status: 500 });
  }
}
