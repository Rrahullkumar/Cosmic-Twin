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

    console.log(`🎯 Processing quiz for user: ${user.name} (ID: ${user._id})`);

    const { answers } = await request.json();
    console.log('📊 Quiz answers:', answers);
    
    // Create personality profile
    const personalityProfile = answers.map((answerIndex, questionIndex) => {
      const questions = [
        "What kind of cosmic journey excites you the most?",
        "If you were a star, how would you shine?",
        "Which environment feels like 'home' to you?",
        "In a cosmic crew, what role would you play?",
        "How do you usually handle challenges?",
        "If you discovered a new planet, what would you name it after?",
        "What's your energy vibe?",
        "Which cosmic companion would you choose?",
        "What draws you the most in the night sky?",
        "How do you see your future?"
      ];

      const answerOptions = [
        ["Exploring unknown galaxies", "Floating peacefully among stars", "Surviving on a fiery volcanic world", "Building futuristic space colonies"],
        ["Bright and blazing", "Cool and distant", "Flickering mysteriously", "Constant and reliable"],
        ["Vast oceans", "Icy deserts", "Volcanic landscapes", "Dense, futuristic cities"],
        ["The fearless explorer", "The calm strategist", "The energetic motivator", "The visionary builder"],
        ["Head-on, with fire and passion", "Calm and thoughtful", "Adapt and improvise", "Logical and structured"],
        ["A powerful element", "A mythological figure", "A feeling or emotion", "Something futuristic"],
        ["Fiery & intense", "Calm & collected", "Adventurous & wild", "Curious & imaginative"],
        ["A loyal robot", "A mystical alien creature", "A powerful spaceship", "Just the stars themselves"],
        ["Brightest stars", "Silent dark void", "Shooting meteors", "Colorful nebulas"],
        ["Full of bold adventures", "Peaceful and stable", "Constantly changing & evolving", "Building something that lasts"]
      ];

      const question = questions[questionIndex];
      const answer = answerOptions[questionIndex][answerIndex];
      return `${question} ${answer}`;
    }).join('. ');

    console.log('🧠 Generating embedding...');
    const embedding = await generateEmbedding(personalityProfile);
    
    // Generate UUID for Qdrant point ID
    const qdrantPointId = uuidv4();
    console.log('📋 Generated Qdrant point ID:', qdrantPointId);
    
    // Store in Qdrant users collection
    console.log('💾 Storing user embedding in Qdrant...');
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
            created_at: new Date().toISOString()
          }
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Qdrant error: ${error}`);
    }

    console.log('✅ Qdrant embedding stored successfully');

    // ✅ UPDATE MONGODB WITH BETTER ERROR HANDLING
    await connectDB();
    const updateResult = await User.findByIdAndUpdate(
      user._id,
      {
        quiz_completed: true,
        quiz_answers: answers,
        quiz_completed_at: new Date(),
        qdrant_point_id: qdrantPointId
      },
      { new: true } // Return updated document
    );

    console.log('💾 MongoDB update result:', {
      userId: updateResult._id,
      qdrant_point_id: updateResult.qdrant_point_id,
      quiz_completed: updateResult.quiz_completed
    });

    if (!updateResult.qdrant_point_id) {
      throw new Error('Failed to save qdrant_point_id to MongoDB');
    }

    console.log('✅ Quiz results saved successfully!');

    return Response.json({
      success: true,
      message: 'Quiz results saved successfully',
      qdrant_point_id: qdrantPointId // Return for debugging
    });

  } catch (error) {
    console.error('💥 Quiz completion error:', error);
    return Response.json({ 
      error: 'Failed to save quiz results: ' + error.message 
    }, { status: 500 });
  }
}
