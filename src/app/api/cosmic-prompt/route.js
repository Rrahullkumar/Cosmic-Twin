import { NextResponse } from 'next/server';

// Cache the prompt with timestamp to avoid generating too frequently
let cachedPrompt = null;
let lastGenerated = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET() {
    try {
        const now = Date.now();

        // Return cached prompt if still valid (within 1 hour)
        if (cachedPrompt && (now - lastGenerated) < CACHE_DURATION) {
            return NextResponse.json(cachedPrompt);
        }

        // console.log('🌌 Generating new cosmic prompt with Mistral AI...');

        // Generate new prompt using Mistral AI
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
                        role: 'system',
                        content: 'You are a mystical cosmic guide. Create unique, thought-provoking prompts that help people reflect on their inner selves, relationships, and cosmic connections. Keep prompts inspiring and introspective.'
                    },
                    {
                        role: 'user',
                        content: `Generate a unique cosmic prompt for today. Format your response as JSON with these fields:
            - title: "Cosmic Prompt" (keep this constant)
            - question: A thought-provoking question (1-2 sentences, mystical and cosmic themed)
            - description: A brief explanation or context (2-3 sentences encouraging reflection)
            
            Make it about cosmic connections, inner wisdom, planetary energy, star alignments, universal bonds, soul journeys, or similar mystical themes. Make it unique and different from common prompts about cosmic twins.`
                    }
                ],
                max_tokens: 200,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            throw new Error(`Mistral API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        let newPrompt;
        try {
            // Try to parse JSON response from AI
            newPrompt = JSON.parse(aiResponse);
        } catch (parseError) {
            // If AI didn't return proper JSON, create structured response
            newPrompt = {
                title: 'Cosmic Prompt',
                question: aiResponse.split('\n')[0] || 'What cosmic energy surrounds you today?',
                description: 'Reflect on this cosmic message and share your thoughts with the community.'
            };
        }

        // Validate and set defaults if needed
        newPrompt = {
            title: newPrompt.title || 'Cosmic Prompt',
            question: newPrompt.question || 'What cosmic energy flows through you today?',
            description: newPrompt.description || 'Take a moment to reflect on this cosmic question and share your insights.'
        };

        // Cache the new prompt
        cachedPrompt = newPrompt;
        lastGenerated = now;

        // console.log('✅ New cosmic prompt generated:', newPrompt.question);
        return NextResponse.json(newPrompt);

    } catch (error) {
        console.error('Error generating cosmic prompt:', error);

        // Return fallback cosmic prompts if AI fails
        const fallbackPrompts = [
            {
                title: 'Cosmic Prompt',
                question: 'What hidden constellation of talents within you is ready to shine?',
                description: 'The universe has blessed you with unique gifts. Reflect on the abilities that make you sparkle like a distant star.'
            },
            {
                title: 'Cosmic Prompt',
                question: 'How does the rhythm of celestial bodies mirror your inner heartbeat today?',
                description: 'Feel the cosmic dance within your soul. Share how the universe\'s energy resonates with your being right now.'
            },
            {
                title: 'Cosmic Prompt',
                question: 'What interstellar message would your future self send to you today?',
                description: 'Imagine yourself as a wise cosmic traveler looking back through time. What guidance echoes across the stars?'
            },
            {
                title: 'Cosmic Prompt',
                question: 'Which planetary energy best describes your emotional landscape today?',
                description: 'Mars\' passion, Venus\' love, Mercury\'s wisdom, or Jupiter\'s expansion? Explore how cosmic forces shape your inner world.'
            },
            {
                title: 'Cosmic Prompt',
                question: 'What would happen if you could channel the creative force of a supernova?',
                description: 'Supernovas create new elements and scatter stardust across galaxies. Reflect on your own creative potential to transform and inspire.'
            }
        ];

        const randomPrompt = fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];

        // Cache fallback prompt too
        cachedPrompt = randomPrompt;
        lastGenerated = Date.now();

        return NextResponse.json(randomPrompt);
    }
}
