import { getCurrentUser } from '@/lib/auth';
import { generateEmbedding } from '@/lib/mistral';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Generate daily fortune using Mistral
    const fortunePrompt = `Generate a daily cosmic fortune for ${user.name}. Make it mystical, positive, and about 1-2 sentences. Focus on cosmic themes like stars, planets, energy, and personal growth.`;
    
    try {
      // Use Mistral to generate personalized fortune
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
              content: fortunePrompt
            }
          ],
          max_tokens: 100
        })
      });

      if (response.ok) {
        const data = await response.json();
        const fortune = data.choices[0].message.content.trim();
        
        return Response.json({
          success: true,
          fortune: fortune
        });
      }
    } catch (mistralError) {
      console.error('Mistral fortune error:', mistralError);
    }

    // Fallback fortunes if Mistral fails
    const fallbackFortunes = [
      "The stars align to bring you clarity. Trust your intuition and embrace new opportunities.",
      "Cosmic energies flow through you today. Your creativity will shine brighter than the brightest star.",
      "The universe whispers secrets of growth. Listen closely to the rhythm of your heart.",
      "Today's stellar alignment brings harmony to your path. Embrace the cosmic dance of possibility.",
      "Mercury's wisdom guides your thoughts. Saturn's strength supports your journey forward.",
      "The cosmos celebrates your unique light. Share your gifts with the universe today."
    ];

    const randomFortune = fallbackFortunes[Math.floor(Math.random() * fallbackFortunes.length)];

    return Response.json({
      success: true,
      fortune: randomFortune
    });

  } catch (error) {
    console.error('Daily fortune error:', error);
    return Response.json({ 
      error: 'Failed to generate daily fortune' 
    }, { status: 500 });
  }
}
