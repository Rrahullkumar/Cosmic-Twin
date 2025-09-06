import { getQdrantClient } from '@/lib/qdrant';

export async function POST() {
  try {
    const client = getQdrantClient();
    
    // Simple test data
    const testEmbedding = new Array(1024).fill(0.01); // Simple test embedding
    
    const result = await client.upsert({
      collection_name: 'planets',
      points: [{
        id: 'test-planet',
        vector: testEmbedding,
        payload: {
          name: 'Test Planet',
          type: 'Test'
        }
      }]
    });
    
    return Response.json({
      success: true,
      message: 'Simple upsert worked!',
      result: result
    });
    
  } catch (error) {
    return Response.json({
      error: error.message,
      stack: error.stack?.slice(0, 300)
    }, { status: 500 });
  }
}
