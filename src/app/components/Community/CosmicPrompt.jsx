'use client';
import { useState, useEffect } from 'react';

export default function CosmicPrompt() {
  const [prompt, setPrompt] = useState({
    title: 'Cosmic Prompt',
    question: 'Generating your cosmic prompt...',
    description: 'Please wait while your unique cosmic prompt is being created.'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCosmicPrompt = async () => {
      try {
        setError(null);
        const response = await fetch('/api/cosmic-prompt');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch prompt: ${response.status}`);
        }
        
        const data = await response.json();
        setPrompt(data);
        console.log('✅ Cosmic prompt loaded:', data.question);
        
      } catch (err) {
        console.error('Cosmic prompt error:', err);
        setError(err.message);
        setPrompt({
          title: 'Cosmic Prompt',
          question: 'What cosmic wisdom do you seek today?',
          description: 'Even when the stars are hidden, your inner light continues to shine. Share your cosmic thoughts with the community.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately on mount
    fetchCosmicPrompt();

    // Set up interval to refresh every hour (3600000ms)
    const interval = setInterval(fetchCosmicPrompt, 3600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[var(--soft-mint-green)] rounded-2xl p-6 shadow-sm relative overflow-hidden">
      {/* Decorative cosmic elements */}
      <span className="material-symbols-outlined text-white/20 absolute -top-2 -left-2 text-5xl">
        Break The Ice
      </span>
      <span className="material-symbols-outlined text-white/20 absolute top-10 right-4 text-3xl">
        Icebreaker
      </span>
      <span className="material-symbols-outlined text-white/20 absolute bottom-2 right-12 text-5xl">
        IceBreaker
      </span>

      <h3 className="text-[var(--dark-text)] text-lg font-bold leading-tight tracking-[-0.015em] mb-2 relative z-10">
        {prompt.title} {isLoading && '⨳'}
      </h3>
      
      <p className="text-[var(--dark-text)]/80 text-xl font-medium mb-3 relative z-10">
        {prompt.question}
      </p>
      
      <p className="text-[var(--subtle-text)] text-sm font-normal leading-normal relative z-10">
        {prompt.description}
      </p>

      {error && (
        <p className="text-red-600/80 text-xs mt-2 relative z-10">
          Note: Using fallback prompt due to API issue
        </p>
      )}
    </div>
  );
}
