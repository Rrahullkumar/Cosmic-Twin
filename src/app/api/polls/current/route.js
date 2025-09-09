// src/app/api/polls/current/route.js - No fallback version
export const dynamic = 'force-dynamic'; 
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { generatePollQuestion } from '@/lib/mistral';
import DailyPoll from '@/models/DailyPoll';

export async function GET() {
  try {
    console.log('🎯 Poll API called at:', new Date().toISOString());
    
    await connectDB();
    
    // Check database for active poll
    const currentPoll = await DailyPoll.findOne({
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (currentPoll) {
      console.log('📋 Found active poll in database');
      const pollData = {
        id: currentPoll._id.toString(),
        question: currentPoll.question,
        options: currentPoll.options.map(opt => ({
          text: opt.text,
          votes: opt.votes
        })),
        expiresAt: currentPoll.expiresAt
      };
      
      return NextResponse.json({ poll: pollData }, {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    // No active poll, generate new one
    console.log('🎯 Generating new poll with Mistral AI...');
    const pollData = await generatePollQuestion();
    
    // Deactivate old polls
    await DailyPoll.updateMany({}, { isActive: false });

    // Create new poll (expires in 6 hours)
    const newPoll = new DailyPoll({
      question: pollData.question,
      options: pollData.options.map(text => ({ text, votes: 0, votedBy: [] })),
      isActive: true,
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000)
    });

    await newPoll.save();
    
    const responseData = {
      id: newPoll._id.toString(),
      question: newPoll.question,
      options: newPoll.options.map(opt => ({
        text: opt.text,
        votes: opt.votes
      })),
      expiresAt: newPoll.expiresAt
    };
    
    console.log('✅ New poll created:', pollData.question);

    return NextResponse.json({ poll: responseData }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('❌ Poll generation failed:', error);
    
    // Return error instead of fallback
    return NextResponse.json(
      { error: 'Failed to generate poll', details: error.message }, 
      { status: 500 }
    );
  }
}
