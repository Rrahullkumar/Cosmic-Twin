// src/app/api/polls/vote/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import DailyPoll from '@/models/DailyPoll';

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pollId, optionIndex } = await request.json();
    
    await connectDB();
    
    const poll = await DailyPoll.findById(pollId);
    if (!poll || !poll.isActive || poll.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Poll not found or expired' }, { status: 404 });
    }

    // Check if user already voted
    const hasVoted = poll.options.some(option => 
      option.votedBy.includes(user._id)
    );

    if (hasVoted) {
      return NextResponse.json({ error: 'Already voted' }, { status: 400 });
    }

    // Add vote
    poll.options[optionIndex].votes += 1;
    poll.options[optionIndex].votedBy.push(user._id);
    
    await poll.save();

    return NextResponse.json({ 
      message: 'Vote recorded',
      poll: {
        id: poll._id.toString(),
        question: poll.question,
        options: poll.options.map(opt => ({
          text: opt.text,
          votes: opt.votes
        }))
      }
    });

  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
