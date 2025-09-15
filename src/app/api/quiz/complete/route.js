import { generateEmbedding } from '@/lib/mistral';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // console.log(`🎯 Processing quiz for user: ${user.name} (ID: ${user._id})`);

    const { answers } = await request.json();
    // console.log('📊 Quiz answers:', answers);

    // ✨ FIXED: Create highly distinctive personality profiles
    const personalityArchetypes = {
      creative: "PURE CREATIVE VISIONARY: I am an ethereal artist who lives entirely in dreams and imagination. My soul flows like liquid starlight through realms of pure creativity. I value mystical experiences, abstract art, spiritual connections, and transcendent beauty above all practical concerns. Logic and structure feel restrictive to my free-flowing creative spirit. I seek wonder, magic, and artistic expression in every moment.",

      adventurous: "EXTREME FRONTIER EXPLORER: I am a fearless pioneer who craves intense physical danger and extreme challenges. I thrive on adrenaline rushes, extreme sports, wilderness survival, and bold conquest. I value courage over safety, risk over security, and raw adventure over comfort. My spirit demands constant movement, exploration, and pushing boundaries. Sitting still or routine activities completely drain my energy.",

      analytical: "PURE LOGICAL SCHOLAR: I am a systematic analytical mind who operates through pure logic and scientific rigor. I prioritize data analysis, mathematical precision, research methodology, and intellectual pursuits above all emotional concerns. Social activities and creative expression feel inefficient and distracting. My mind operates like a precision instrument, dissecting problems through methodical reasoning and empirical evidence."
    };

    // ✨ FIXED: Simplified trait scoring based on key differentiating questions
    // ✨ CORRECTED: Properly map quiz answers to personality types
    const keyAnswers = [answers[0], answers[3], answers[6]]; // Most distinctive questions
    let creativeScore = 0, adventurousScore = 0, analyticalScore = 0;

    keyAnswers.forEach(answer => {
      if (answer === 0) adventurousScore += 4;      // Index 0 = Adventurous (Zylos)
      else if (answer === 1) analyticalScore += 5;  // Index 1 = Analytical (Nilos) 
      else if (answer === 2) adventurousScore += 3; // Index 2 = Also Adventurous  
      else if (answer === 3) creativeScore += 3;    // Index 3 = Creative (Xylos)
      else analyticalScore += 1; // Default analytical lean
    });

    // Add secondary scoring from remaining answers with heavier analytical weight
    answers.slice(3).forEach(answer => {
      if (answer === 0) adventurousScore += 1;
      else if (answer === 1) analyticalScore += 2; 
      else if (answer === 2) adventurousScore += 1;
      else if (answer === 3) creativeScore += 1;
    });

    // Determine dominant archetype with analytical preference
    let dominantType = 'analytical'; // Default to analytical
    if (adventurousScore > analyticalScore && adventurousScore > creativeScore) {
      dominantType = 'adventurous';
    } else if (creativeScore > analyticalScore && creativeScore > adventurousScore) {
      dominantType = 'creative';
    }
    // If tied or close, default to analytical (Nilos)


    const personalityProfile = personalityArchetypes[dominantType];

    // console.log('🧠 Generated personality type:', dominantType);
    // console.log('🧠 Generating embedding...');
    const embedding = await generateEmbedding(personalityProfile);
    // console.log('✅ Embedding generated, length:', embedding.length);

    // Generate UUID for Qdrant point ID
    const qdrantPointId = uuidv4();
    // console.log('📋 Generated Qdrant point ID:', qdrantPointId);

    // Store in Qdrant users collection
    // console.log('💾 Storing user embedding in Qdrant...');
    const response = await fetch(`${process.env.QDRANT_URL}/collections/users/points`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.QDRANT_API_KEY
      },
      body: JSON.stringify({
        points: [{
          id: qdrantPointId,
          vector: embedding,
          payload: {
            mongoUserId: user._id.toString(),
            name: user.name,
            email: user.email,
            answers: answers,
            personality_profile: personalityProfile,
            personality_type: dominantType,
            created_at: new Date().toISOString()
          }
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Qdrant storage failed:', error);
      throw new Error(`Qdrant error: ${error}`);
    }

    // console.log('✅ Qdrant embedding stored successfully');

    // ✅ CRITICAL FIX: UPDATE MONGODB WITH PERSONALITY_VECTOR
    // console.log('💾 Updating MongoDB with personality vector...');
    await connectDB();

    const updateResult = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {  // ✨ Use $set to ensure the update works
          quiz_completed: true,
          quiz_answers: answers,
          quiz_completed_at: new Date(),
          qdrant_point_id: qdrantPointId,
          personality_vector: embedding,        // ✨ CRITICAL: This field
          personality_profile: personalityProfile,
          personality_type: dominantType
        }
      },
      { new: true, upsert: false } // Return updated document, don't create new
    );

    // console.log('💾 MongoDB update result:', {
    //   userId: updateResult._id,
    //   quiz_completed: updateResult.quiz_completed,
    //   has_personality_vector: !!updateResult.personality_vector,
    //   vector_length: updateResult.personality_vector?.length || 0,
    //   qdrant_point_id: updateResult.qdrant_point_id,
    //   personality_type: updateResult.personality_type
    // });

    // ✨ VERIFY the update worked
    if (!updateResult.personality_vector) {
      throw new Error('Failed to save personality_vector to MongoDB');
    }

    return Response.json({
      success: true,
      message: 'Quiz results saved successfully',
      debug: {
        qdrant_point_id: qdrantPointId,
        personality_vector_length: embedding.length,
        mongodb_updated: !!updateResult.personality_vector,
        personality_type: dominantType
      }
    });

  } catch (error) {
    console.error('💥 Quiz completion error:', error);
    return Response.json({
      error: 'Failed to save quiz results: ' + error.message
    }, { status: 500 });
  }
}
