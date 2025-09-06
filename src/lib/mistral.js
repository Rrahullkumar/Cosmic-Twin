import { Mistral } from '@mistralai/mistralai';

let mistralClient = null;

export function getMistralClient() {
  if (!mistralClient) {
    mistralClient = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY
    });
  }
  return mistralClient;
}

export async function generateEmbedding(text) {
  const client = getMistralClient();
  
  try {
    console.log('🔗 Calling Mistral embeddings API...');
    
    const response = await client.embeddings.create({
      model: 'mistral-embed',
      inputs: [text]
    });
    
    // 🔍 DEBUG RAW RESPONSE
    console.log('📦 Mistral raw response structure:');
    console.log('- response exists:', !!response);
    console.log('- response.data exists:', !!response.data);
    console.log('- data length:', response.data?.length);
    console.log('- first item keys:', response.data?.[0] ? Object.keys(response.data[0]) : 'none');
    
    if (!response.data?.[0]?.embedding) {
      console.error('❌ Invalid Mistral response:', JSON.stringify(response, null, 2));
      throw new Error('Mistral API returned invalid response structure');
    }
    
    const embedding = response.data[0].embedding;
    
    // 🔍 VALIDATE EMBEDDING
    console.log('🔍 Validating embedding from Mistral:');
    console.log('- Type:', typeof embedding);
    console.log('- Is Array:', Array.isArray(embedding));
    console.log('- Length:', embedding?.length);
    
    if (!Array.isArray(embedding)) {
      throw new Error(`Expected array, got ${typeof embedding}`);
    }
    
    if (embedding.length !== 1024) {
      throw new Error(`Expected 1024 dimensions, got ${embedding.length}`);
    }
    
    // Check for invalid values
    for (let i = 0; i < embedding.length; i++) {
      const val = embedding[i];
      if (typeof val !== 'number') {
        throw new Error(`Non-number at index ${i}: ${typeof val}`);
      }
      if (isNaN(val)) {
        throw new Error(`NaN value at index ${i}`);
      }
      if (!isFinite(val)) {
        throw new Error(`Infinite value at index ${i}: ${val}`);
      }
    }
    
    console.log('✅ Mistral embedding validation passed');
    return embedding;
    
  } catch (error) {
    console.error('❌ Mistral API error:', error);
    throw error;
  }
}
