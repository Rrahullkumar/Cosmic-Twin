'use client';
import { useState, useEffect } from 'react';

export default function CosmicPrompt() {
  const [prompt, setPrompt] = useState({
    title: 'Cosmic Prompt',
    question: 'What does your cosmic twin mean to you?',
    description: 'Share your thoughts and reflections on the significance of finding your cosmic twin.'
  });

  useEffect(() => {
    // TODO: Fetch daily cosmic prompt from backend
    // fetchDailyPrompt().then(setPrompt);
  }, []);

  return (
    <div className="bg-[var(--soft-mint-green)] rounded-2xl p-6 shadow-sm relative overflow-hidden">
      <h3 className="text-[var(--dark-text)] text-lg font-bold leading-tight tracking-[-0.015em] mb-2">
        {prompt.title}
      </h3>
      <p className="text-[var(--dark-text)]/80 text-xl font-medium mb-3">
        {prompt.question}
      </p>
      <p className="text-[var(--subtle-text)] text-sm font-normal leading-normal">
        {prompt.description}
      </p>
    </div>
  );
}
