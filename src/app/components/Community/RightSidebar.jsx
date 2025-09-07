'use client';
import { useState, useEffect } from 'react';
import TwinmateCard from './TwinmateCard';

export default function RightSidebar() {
  const [twinmates, setTwinmates] = useState([
    { name: "Stella", planet: "Venus", compatibility: "92%", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAyIoCrkqW0lKLhGHweyKk_fedis1aHHMIjfe4cHqdfqe8dFF_Ud_qIBQK_pEjsR6zEN7i1NQgyn2ZpUVyYE18Pmbj3AtN72lBxdAvTR1a4Z5lfTGG1xeXLEZgk-vKVaSujO9nGS3qNZrA_GoBZ26o92LlU910EgHOfLOrgk2cre_NmjFPHhD4pvUH3rFA4ijQUDJ6Q1zOx3K0Nhp9VLwKDaxu1Arc7cgyFiqV0WzvH30koWaWL2Wf1GCMelj6qSwNfq4bhJQLcPA" },
    { name: "Leo", planet: "Mars", compatibility: "88%", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuYaxiWP9zWwu-TbBS4rxetxWbBBSh1pQ_27w_FLONClupLwIEYWevERtH6QeCmJ7akl2khSOVf0suMbjzxGj4bw8XMKgr2ma8OFTnzl-6ucTyi-NJvQMjIov1lUzKwb7hxqBDKhmBQoqnUQyhA6aA0TlsP1rGq6Ml05m2jgV2AOjwuefRMIuwAHUTD8-oBwalzkGFximdV7F5ADnVCnE4NbLn3yii5D58gYoQ78Vx9HuRQ5FCgG7oTBZmgvS6An_fzZDDXAkSsNA" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindTwinmates = async () => {
    setIsLoading(true);
    try {
      // TODO: Call Qdrant similarity search API
      // const newTwinmates = await findCosmicTwinmates();
      // setTwinmates(newTwinmates);
      console.log('Finding cosmic twinmates...');
    } catch (error) {
      console.error('Error finding twinmates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:col-span-3 order-3">
      <div className="bg-white rounded-2xl shadow-sm p-5">
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
          <span>{isLoading ? 'Searching...' : 'Find Twinmates ✨'}</span>
        </button>

        <div className="mt-6 space-y-2">
          {twinmates.map((twinmate, index) => (
            <TwinmateCard key={index} twinmate={twinmate} />
          ))}
        </div>
      </div>
    </div>
  );
}
