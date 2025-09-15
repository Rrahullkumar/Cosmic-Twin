'use client';
import { useState } from 'react';
import TwinmateCard from './TwinmateCard';

export default function RightSidebar() {
  const [twinmates, setTwinmates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFindTwinmates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // console.log('🔍 Searching for cosmic twinmates...');
      
      const response = await fetch('/api/twinmates/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to search twinmates: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.twinmates) {
        setTwinmates(data.twinmates.slice(0, 5)); // Show top 2-5 results
        // console.log(' Found twinmates:', data.twinmates.length);
      } else {
        setError(data.error || 'No twinmates found');
        setTwinmates([]);
      }
      
    } catch (error) {
      console.error('Error finding twinmates:', error);
      setError('Failed to find twinmates. Please try again.');
      setTwinmates([]);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  return (
    <div className="w-80 flex-shrink-0 sticky top-0 h-screen bg-white shadow-sm overflow-y-auto scrollbar-hide">
      <div className="p-5">
        <h3 className="text-[var(--dark-text)] text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
          Find My Cosmic Twinmates
        </h3>
        
        <button
          onClick={handleFindTwinmates}
          disabled={isLoading}
          className="w-full flex items-center justify-center overflow-hidden rounded-xl h-11 px-4 text-white text-base font-bold shadow-md hover:shadow-lg transition-shadow disabled:opacity-70"
          style={{
            background: 'linear-gradient(to right, var(--muted-pink), var(--lavender-purple))'
          }}
        >
          <span>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⨳</span>
                Searching...
              </>
            ) : (
              'Find Twinmates ✨'
            )}
          </span>
        </button>

        {/* Results Section */}
        <div className="mt-6">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm text-center mb-4">
              {error}
            </div>
          )}

          {hasSearched && twinmates.length === 0 && !error && !isLoading && (
            <div className="text-center text-[var(--subtle-text)] text-sm py-8">
              <div className="mb-2">🌌</div>
              <div>No cosmic twinmates found</div>
              <div className="text-xs mt-1">Try completing your personality quiz first!</div>
            </div>
          )}

          {twinmates.length > 0 && (
            <>
              <div className="text-center text-[var(--subtle-text)] text-xs mb-3">
                Found {twinmates.length} cosmic twinmate{twinmates.length !== 1 ? 's' : ''}
              </div>
              <div className="space-y-2">
                {twinmates.map((twinmate, index) => (
                  <TwinmateCard key={`${twinmate.id}-${index}`} twinmate={twinmate} />
                ))}
              </div>
            </>
          )}

          {!hasSearched && !isLoading && (
            <div className="text-center text-[var(--subtle-text)] text-sm py-8">
              <div className="mb-2">✨</div>
              <div>Click the button above to discover</div>
              <div>your cosmic twinmates!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
