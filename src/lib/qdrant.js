import { QdrantClient } from '@qdrant/js-client-rest';

let qdrantClient = null;

export function getQdrantClient() {
  if (!qdrantClient) {
    
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

    await client.getCollection('planets');
  } catch (error) {
    if (error.status === 404) {
      await client.createCollection('planets', {
        vectors: {
          size: 1024, // Mistral embed dimension
          distance: 'Cosine'
        }
      });

    } else {
      throw error;
    }
  }

  // Create users collection
  try {
    await client.getCollection('users');
  } catch (error) {
    if (error.status === 404) {
      await client.createCollection('users', {
        vectors: {
          size: 1024,
          distance: 'Cosine'
        }
      });
    } else {
      throw error;
    }
  }
}
