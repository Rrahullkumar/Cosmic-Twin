import { getQdrantClient, initializeCollections } from '@/lib/qdrant';
import { generateEmbedding } from '@/lib/mistral';
import { planetsData } from '@/data/planets';

export async function POST(request) {
  console.log('🚀 Seed planets API called');
  
  try {
    await initializeCollections();
    const client = getQdrantClient();
    
    const planet = planetsData[0]; // Test with first planet
    console.log(`🪐 Processing ${planet.name}...`);
    
    const embeddingText = `${planet.name} is a ${planet.type} planet.`;
    console.log('📝 Embedding text:', embeddingText);
    
    // Generate embedding
    console.log('🧠 Calling Mistral API...');
    const embedding = await generateEmbedding(embeddingText);
    
    // 🔍 DETAILED EMBEDDING DEBUG
    console.log('🔍 MISTRAL EMBEDDING DEBUG:');
    console.log('- Raw type:', typeof embedding);
    console.log('- Is Array:', Array.isArray(embedding));
    console.log('- Length:', embedding?.length);
    console.log('- First 10 values:', embedding?.slice(0, 10));
    console.log('- Last 5 values:', embedding?.slice(-5));
    console.log('- Min value:', embedding ? Math.min(...embedding) : 'N/A');
    console.log('- Max value:', embedding ? Math.max(...embedding) : 'N/A');
    
    // Check for problematic values
    if (Array.isArray(embedding)) {
      const nanCount = embedding.filter(val => isNaN(val)).length;
      const infinityCount = embedding.filter(val => !isFinite(val)).length;
      const nonNumberCount = embedding.filter(val => typeof val !== 'number').length;
      
      console.log('- NaN values:', nanCount);
      console.log('- Infinity values:', infinityCount);
      console.log('- Non-number values:', nonNumberCount);
    }
    
    // Validate embedding
    if (!Array.isArray(embedding)) {
      throw new Error(`Embedding is not array, got: ${typeof embedding}`);
    }
    if (embedding.length !== 1024) {
      throw new Error(`Wrong dimension: expected 1024, got ${embedding.length}`);
    }
    
    // 🧪 TEST WITH MINIMAL PAYLOAD
    const minimalPayload = { name: planet.name };
    
    console.log('💾 Testing upsert with minimal payload:', JSON.stringify(minimalPayload));
    
    const result = await client.upsert('planets', {
      points: [{
        id: planet.id,
        vector: embedding,
        payload: minimalPayload
      }]
    });
    
    console.log('✅ SUCCESS!', result);
    
    return Response.json({ 
      success: true, 
      message: `${planet.name} seeded successfully`,
      embedding_debug: {
        length: embedding.length,
        min_max: [Math.min(...embedding), Math.max(...embedding)],
        sample: embedding.slice(0, 5)
      }
    });
    
  } catch (error) {
    console.error('💥 Error details:', {
      message: error.message,
      stack: error.stack?.slice(0, 500)
    });
    
    return Response.json({ 
      error: error.message,
      debug_info: error.stack?.slice(0, 300)
    }, { status: 500 });
  }
}
