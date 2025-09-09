// Poll.jsx - Debug version
'use client';
import React, { useState, useEffect } from 'react';

const Poll = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  
  // Fetch current poll
  useEffect(() => {
    fetchCurrentPoll();
    // Refresh every minute for testing
    const interval = setInterval(fetchCurrentPoll, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentPoll = async () => {
    try {
      console.log('🔄 Fetching poll from client...');
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/polls/current?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📊 Poll data received:', data);
      
      if (data.poll) {
        setPoll(data.poll);
        console.log('✅ Poll set:', data.poll.question);
      } else {
        console.log('❌ No poll in response');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching poll:', error);
      setLoading(false);
    }
  };

  const handleVote = async (optionIndex) => {
    if (hasVoted || !poll || poll.id === 'fallback') return;
    
    try {
      const response = await fetch('/api/polls/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pollId: poll.id, 
          optionIndex 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPoll(data.poll);
        setSelectedOption(optionIndex);
        setHasVoted(true);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-6 w-64 shrink-0" style={{ background: 'var(--lavender-purple)' }}>
        <div className="text-white text-center">Loading poll...</div>
      </div>
    );
  }

  // Debug log
  console.log('🎯 Current poll state:', poll);

  return (
    <div className="poll-container rounded-2xl" style={{ background: 'var(--lavender-purple)' }}>
      <div className="rounded-2xl p-6 shadow-sm relative overflow-hidden w-64 shrink-0">
        <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-3">
          Poll of the Day
        </h3>
        
        {/* Show both API data and fallback for debugging */}
        <p className="text-white/90 text-base font-medium mb-4">
          {poll?.question || "What's your favorite planet?"}
        </p>
        
        {/* Debug info */}
        {/* <p className="text-white/50 text-xs mb-2">
          Debug: {poll ? 'API Data' : 'Fallback'}
        </p> */}
        
        <div className="space-y-2">
          {(poll?.options || [
            { text: "Earth", votes: 0 },
            { text: "Mars", votes: 0 },
            { text: "Jupiter", votes: 0 },
            { text: "Saturn", votes: 0 }
          ]).map((option, index) => (
            <button
              key={index}
              onClick={() => handleVote(index)}
              disabled={hasVoted}
              className={`w-full text-left p-2 rounded-lg text-white text-sm transition-colors ${
                selectedOption === index 
                  ? 'bg-white/40' 
                  : hasVoted 
                    ? 'bg-white/10 cursor-not-allowed' 
                    : 'bg-white/20 hover:bg-white/40'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{option.text}</span>
                {hasVoted && (
                  <span className="text-xs opacity-75">
                    {option.votes} votes
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Poll;
