import { QdrantClient } from '@qdrant/js-client-rest';

let qdrantClient = null;

export function getQdrantClient() {
  if (!qdrantClient) {
    console.log('🔌 Creating Qdrant client...');
    
    qdrantClient = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });
  }
  return qdrantClient;
}

export async function initializeCollections() {
  const client = getQdrantClient();
  
  // Create planets collection
  try {
    console.log('🔍 Checking planets collection...');
    await client.getCollection('planets');
    console.log('✅ Planets collection exists');
  } catch (error) {
    if (error.status === 404) {
      console.log('📦 Creating planets collection...');
      await client.createCollection('planets', {
        vectors: {
          size: 1024, // Mistral embed dimension
          distance: 'Cosine'
        }
      });
      console.log('✅ Planets collection created');
    } else {
      throw error;
    }
  }

  // Create users collection
  try {
    console.log('🔍 Checking users collection...');
    await client.getCollection('users');
    console.log('✅ Users collection exists');
  } catch (error) {
    if (error.status === 404) {
      console.log('📦 Creating users collection...');
      await client.createCollection('users', {
        vectors: {
          size: 1024,
          distance: 'Cosine'
        }
      });
      console.log('✅ Users collection created');
    } else {
      throw error;
    }
  }
}
