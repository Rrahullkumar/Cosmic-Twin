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
    // console.log('📦 Mistral raw response structure:');
    // console.log('- response exists:', !!response);
    // console.log('- response.data exists:', !!response.data);
    // console.log('- data length:', response.data?.length);
    // console.log('- first item keys:', response.data?.[0] ? Object.keys(response.data[0]) : 'none');
    
    if (!response.data?.[0]?.embedding) {
      // console.error('❌ Invalid Mistral response:', JSON.stringify(response, null, 2));
      throw new Error('Mistral API returned invalid response structure');
    }
    
    const embedding = response.data[0].embedding;
    
    // 🔍 VALIDATE EMBEDDING
    // console.log('🔍 Validating embedding from Mistral:');
    // console.log('- Type:', typeof embedding);
    // console.log('- Is Array:', Array.isArray(embedding));
    // console.log('- Length:', embedding?.length);
    
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
// lib/mistral.js - Fix the response parsing
export async function generatePollQuestion() {
  try {
    // console.log('🎯 Generating poll question with Mistral AI (direct fetch)...');
    
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages: [
          {
            role: 'user',
            content: `Generate a fun cosmic poll question with 4 options. Return ONLY this JSON format:
            {"question": "Your question here", "options": ["Option 1", "Option 2", "Option 3", "Option 4"]}`
          }
        ],
        max_tokens: 150,
        temperature: 0.8,
        response_format: { type: "json_object" } // Add this for cleaner JSON
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    // console.log('📦 Full Mistral response:', JSON.stringify(data, null, 2));

    // Fix: Add array index [0] to access first choice
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No choices in Mistral response');
    }

    const aiResponse = data.choices[0].message.content; // Fixed line
    // console.log('📝 Mistral AI raw response:', aiResponse);

    // Clean the response - extract only JSON part
    const cleanedResponse = cleanJsonFromText(aiResponse);
    // console.log('🧹 Cleaned response:', cleanedResponse);

    const pollData = JSON.parse(cleanedResponse);
    
    if (!pollData.question || !pollData.options || !Array.isArray(pollData.options) || pollData.options.length !== 4) {
      throw new Error('Invalid poll structure from Mistral');
    }

    // console.log('✅ Poll generated successfully:', pollData);
    return pollData;

  } catch (error) {
    // console.error('❌ Mistral API failed:', error);
    throw error;
  }
}

// Helper function to extract clean JSON from AI response
function cleanJsonFromText(text) {
  try {
    // Try parsing as-is first
    JSON.parse(text);
    return text;
  } catch (e) {
    console.log('🔧 Need to clean JSON response...');
    
    // Extract JSON object using regex
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in response');
    }
    
    let jsonText = jsonMatch[0];
    
    // Clean common issues
    jsonText = jsonText.trim();
    
    // Remove any trailing text after the closing brace
    const lastBrace = jsonText.lastIndexOf('}');
    if (lastBrace !== -1) {
      jsonText = jsonText.substring(0, lastBrace + 1);
    }
    
    console.log('🧹 Extracted JSON:', jsonText);
    return jsonText;
  }
}

export async function generateText(prompt, model = "mistral-small-latest") {
  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("❌ generateText error:", error);
    throw error;
  }
}

