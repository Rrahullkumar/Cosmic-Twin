import { generateText } from '@/lib/mistral';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !user.matched_planet) {
      return Response.json({ error: 'User must have a matched planet' }, { status: 401 });
    }

    const { action, content } = await request.json();
    const planet = user.matched_planet;

    switch (action) {
      case 'generate_icebreakers':
        return await generateIcebreakers(planet);
      
      case 'suggest_profile_tags':
        return await suggestProfileTags(user, planet);
      
      case 'moderate_content':
        return await moderateContent(content);
      
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Community features error:', error);
    return Response.json({ 
      error: 'Failed to process request: ' + error.message 
    }, { status: 500 });
  }
}

async function generateIcebreakers(planet) {
  const prompt = `Generate 5 creative icebreaker questions for the ${planet.name} community. 
  This planet is for ${planet.type} types with traits: ${planet.traits.join(', ')}.
  The community vibe is ${planet.community_vibe}.
  
  Make the questions fun, engaging, and specific to this planet's personality.
  Format as a JSON array of strings.`;

  try {
    const response = await generateText(prompt, 'mistral-small-latest');
    
    // Try to parse JSON, fallback to manual parsing if needed
    let icebreakers;
    try {
      icebreakers = JSON.parse(response);
    } catch {
      // Manual extraction if JSON parsing fails
      const lines = response.split('\n').filter(line => 
        line.trim().startsWith('"') || line.trim().match(/^\d+\./)
      );
      icebreakers = lines.map(line => line.replace(/^\d+\.\s*/, '').replace(/^"/, '').replace(/"$/, '').trim());
    }

    return Response.json({
      success: true,
      icebreakers: icebreakers.slice(0, 5), // Ensure max 5
      planet: planet.name
    });

  } catch (error) {
    console.error('Icebreaker generation error:', error);
    return Response.json({ error: 'Failed to generate icebreakers' }, { status: 500 });
  }
}

async function suggestProfileTags(user, planet) {
  const prompt = `Based on this user profile, suggest 8-10 personality tags:
  
  User: ${user.name}
  Planet: ${planet.name} (${planet.type})
  Planet traits: ${planet.traits.join(', ')}
  
  Generate tags like "dreamer", "explorer", "innovator", etc. that would fit this user.
  Make them cosmic-themed and personality-focused.
  Return as a JSON array of strings, each tag should be 1-2 words max.`;

  try {
    const response = await generateText(prompt, 'mistral-small-latest');
    
    let tags;
    try {
      tags = JSON.parse(response);
    } catch {
      // Extract tags manually if JSON parsing fails
      const matches = response.match(/"([^"]+)"/g);
      tags = matches ? matches.map(match => match.replace(/"/g, '')) : [];
    }

    return Response.json({
      success: true,
      suggested_tags: tags.slice(0, 10),
      planet: planet.name
    });

  } catch (error) {
    console.error('Tag suggestion error:', error);
    return Response.json({ error: 'Failed to suggest tags' }, { status: 500 });
  }
}

async function moderateContent(content) {
  const prompt = `Analyze this user content for toxicity, spam, or inappropriate material:

  "${content}"
  
  Respond with JSON format:
  {
    "is_safe": true/false,
    "reason": "explanation if not safe", 
    "suggested_edit": "cleaner version if needed"
  }
  
  Be permissive but flag clear toxicity, spam, or harassment.`;

  try {
    const response = await generateText(prompt, 'mistral-small-latest');
    
    let moderation;
    try {
      moderation = JSON.parse(response);
    } catch {
      // Fallback to safe if parsing fails
      moderation = { is_safe: true, reason: null, suggested_edit: null };
    }

    return Response.json({
      success: true,
      moderation: moderation,
      original_content: content
    });

  } catch (error) {
    console.error('Content moderation error:', error);
    return Response.json({ error: 'Failed to moderate content' }, { status: 500 });
  }
}
