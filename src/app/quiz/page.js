'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
  const [userName, setUserName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const logoutRef = useRef(null);

  // Quiz questions with emojis
  const questions = [
    {
      question: "What kind of cosmic journey excites you the most?",
      options: [
        "Exploring unknown galaxies 🚀",
        "Floating peacefully among stars ✨",
        "Surviving on a fiery volcanic world 🌋",
        "Building futuristic space colonies 🏙️"
      ]
    },
    {
      question: "If you were a star, how would you shine?",
      options: [
        "Bright and blazing 🔥",
        "Cool and distant ❄️",
        "Flickering mysteriously 🌌",
        "Constant and reliable 🌟"
      ]
    },
    {
      question: "Which environment feels like 'home' to you?",
      options: [
        "Vast oceans 🌊",
        "Icy deserts ❄️",
        "Volcanic landscapes 🌋",
        "Dense, futuristic cities 🏙️"
      ]
    },
    {
      question: "In a cosmic crew, what role would you play?",
      options: [
        "The fearless explorer 🧭",
        "The calm strategist 🧘‍♂️",
        "The energetic motivator ⚡",
        "The visionary builder 🛠️"
      ]
    },
    {
      question: "How do you usually handle challenges?",
      options: [
        "Head-on, with fire and passion 🔥",
        "Calm and thoughtful 🌙",
        "Adapt and improvise 🌠",
        "Logical and structured 🛰️"
      ]
    },
    {
      question: "If you discovered a new planet, what would you name it after?",
      options: [
        "A powerful element ⚡",
        "A mythological figure 🐉",
        "A feeling or emotion 💜",
        "Something futuristic 🚀"
      ]
    },
    {
      question: "What's your energy vibe?",
      options: [
        "Fiery & intense 🔥",
        "Calm & collected ❄️",
        "Adventurous & wild 🌪️",
        "Curious & imaginative 🌌"
      ]
    },
    {
      question: "Which cosmic companion would you choose?",
      options: [
        "A loyal robot 🤖",
        "A mystical alien creature 👽",
        "A powerful spaceship 🚀",
        "Just the stars themselves ✨"
      ]
    },
    {
      question: "What draws you the most in the night sky?",
      options: [
        "Brightest stars 🌟",
        "Silent dark void 🌑",
        "Shooting meteors ☄️",
        "Colorful nebulas 🌈"
      ]
    },
    {
      question: "How do you see your future?",
      options: [
        "Full of bold adventures 🌠",
        "Peaceful and stable 🌙",
        "Constantly changing & evolving 🌌",
        "Building something that lasts 🛠️"
      ]
    }
  ];

  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);

  // Fetch logged-in user's name
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.name);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/auth/login');
      }
    }
    fetchUser();
  }, [router]);

  // Close logout menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setShowLogoutMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = async () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setIsLoading(true);

        try {
          console.log('🎉 Quiz completed! Final answers:', newAnswers);
          console.log('📊 Answer count:', newAnswers.length);
          console.log('📊 Each answer:', newAnswers.map((ans, idx) => `Q${idx}: ${ans}`));

          const completeResponse = await fetch('/api/quiz/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers: newAnswers }),
          });

          if (!completeResponse.ok) {
            const errorData = await completeResponse.json();
            throw new Error(errorData.error || 'Failed to save quiz results');
          }

          console.log('✅ Quiz results saved, finding your cosmic twin...');

          // Step 2: Find matching planet
          const matchResponse = await fetch('/api/quiz/match-planet', {
            method: 'POST',
          });

          if (!matchResponse.ok) {
            const errorData = await matchResponse.json();
            throw new Error(errorData.error || 'Failed to find matching planet');
          }

          const matchData = await matchResponse.json();
          console.log('🪐 Matched planet:', matchData.matched_planet);

          // Step 3: Show results with better formatting
          const similarityPercent = Math.round(matchData.matched_planet.similarity_score * 100);

          alert(`🎉 Congratulations ${userName}!

🌌 Your Cosmic Twin: ${matchData.matched_planet.name}
✨ Type: ${matchData.matched_planet.type}
🎯 Match: ${similarityPercent}% compatible

${matchData.message}

Ready to explore your cosmic community?`);

          // Redirect to dashboard or results page
          router.push('/dashboard');

        } catch (error) {
          console.error('❌ Error processing quiz:', error);
          alert(`Sorry ${userName}, there was an error processing your cosmic alignment:

${error.message}

Please try again, or contact support if the issue persists.`);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // Important for cookies
      });

      // Always redirect on success, even if there were token issues
      if (response.ok) {

        // Clear any client-side state
        setUserName('');
        setShowLogoutMenu(false);

        // Force hard redirect to clear everything
        window.location.href = '/';
      } else {
        throw new Error('Logout API failed');
      }

    } catch (error) {
      // Still redirect on error to be safe
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  };



  if (!userName) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-4"></div>
          <div className="text-white text-xl">Loading your cosmic profile...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        :root {
          --primary-color: #00ffff;
          --secondary-color: #ff00ff;
        }
        
        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            radial-gradient(1px 1px at 20% 30%, white, rgba(255,255,255,0)),
            radial-gradient(1px 1px at 40% 20%, white, rgba(255,255,255,0)),
            radial-gradient(1px 1px at 80% 40%, white, rgba(255,255,255,0)),
            radial-gradient(2px 2px at 90% 70%, white, rgba(255,255,255,0)),
            radial-gradient(1px 1px at 30% 80%, white, rgba(255,255,255,0)),
            radial-gradient(1px 1px at 50% 60%, white, rgba(255,255,255,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: twinkle 10s infinite linear;
        }
        
        @keyframes twinkle {
          from { transform: translateY(0); }
          to { transform: translateY(-200px); }
        }
        
        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background-image:
            radial-gradient(circle at 15% 95%, rgba(0, 255, 255, 0.1), transparent 20%),
            radial-gradient(circle at 85% 5%, rgba(255, 0, 255, 0.1), transparent 20%);
          animation: drift 20s infinite alternate ease-in-out;
        }
        
        @keyframes drift {
          from { transform: translate(-10px, -10px); }
          to { transform: translate(10px, 10px); }
        }
        
        .glassmorphic {
          background: rgba(10, 5, 20, 0.5);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.1), 0 0 30px rgba(255, 0, 255, 0.1);
        }
        
        .glassmorphic::before {
          content: '';
          position: absolute;
          top: -1px; left: -1px; right: -1px; bottom: -1px;
          border-radius: 1.5rem;
          padding: 1px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        
        .glassmorphic:hover::before {
          opacity: 1;
        }
        
        .neon-button {
          background-color: transparent;
          border: 2px solid var(--primary-color);
          color: var(--primary-color);
          text-shadow: 0 0 5px var(--primary-color), 0 0 10px var(--primary-color);
          box-shadow: 0 0 5px var(--primary-color), inset 0 0 5px var(--primary-color);
          transition: all 0.3s ease-in-out;
          cursor: pointer;
        }
        
        .neon-button:hover {
          background-color: var(--primary-color);
          color: #100018;
          text-shadow: none;
          box-shadow: 0 0 20px var(--primary-color), 0 0 30px var(--primary-color);
        }
        
        .neon-button.selected {
          background-color: var(--secondary-color);
          border-color: var(--secondary-color);
          color: white;
          text-shadow: none;
          box-shadow: 0 0 20px var(--secondary-color), 0 0 30px var(--secondary-color);
        }
        
        .neon-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
        }
        
        .neon-next-button {
          background-color: transparent;
          border-image-slice: 1;
          border-image-source: linear-gradient(to right, var(--primary-color), var(--secondary-color));
          color: white;
          text-shadow: 0 0 5px var(--primary-color), 0 0 10px var(--secondary-color);
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.3), 0 0 20px rgba(255, 0, 255, 0.3);
          animation: pulse 2s infinite;
          transition: all 0.3s;
          cursor: pointer;
        }
        
        .neon-next-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.6);
        }
        
        .neon-next-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          animation: none;
        }
        
        .neon-next-button.loading {
          animation: processing 1.5s infinite ease-in-out;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        
        @keyframes processing {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        
        .constellation {
          position: relative;
          display: inline-block;
        }
        
        .constellation::after {
          content: '';
          position: absolute;
          width: 150%;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--primary-color), transparent);
          top: 50%;
          left: -25%;
          animation: shoot 5s infinite ease-in-out;
          opacity: 0.5;
        }
        
        @keyframes shoot {
          0% { transform: translateX(-50%); opacity: 0; }
          50% { opacity: 0.7; }
          100% { transform: translateX(50%); opacity: 0; }
        }
        
        .orbital-progress {
          position: relative;
          width: 100px;
          height: 100px;
        }
        
        .orbital-progress svg {
          position: absolute;
          top: 0; left: 0;
          transform: rotate(-90deg);
        }
        
        .orbital-progress-track {
          stroke: rgba(255, 255, 255, 0.1);
        }
        
        .orbital-progress-fill {
          stroke: url(#progressGradient);
          stroke-dasharray: 283;
          stroke-dashoffset: calc(283 - (283 * var(--progress, 0)) / 100);
          transition: stroke-dashoffset 0.5s ease-out;
        }
        
        .logout-menu {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 10px;
          background: rgba(10, 5, 20, 0.95);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
          min-width: 180px;
          z-index: 50;
          animation: fadeInScale 0.2s ease-out;
        }
        
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .logout-menu-item {
          padding: 12px 16px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .logout-menu-item:hover {
          background: rgba(0, 255, 255, 0.1);
          color: var(--primary-color);
        }
        
        .logout-menu-item:last-child {
          border-bottom: none;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-left: 12px;
        }
        
        .user-avatar:hover {
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: var(--primary-color);
          animation: spin 0.8s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        className="text-gray-200 relative flex size-full min-h-screen flex-col overflow-x-hidden"
        style={{
          fontFamily: 'Exo, sans-serif',
          background: 'linear-gradient(135deg, #000000, #100018, #1a0022)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div className="stars"></div>
        <div className="particles"></div>

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between whitespace-nowrap px-10 py-5">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-3">
            <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_319)">
                <path
                  d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                  fill="currentColor"></path>
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect fill="white" height="48" width="48"></rect>
                </clipPath>
              </defs>
            </svg>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>CosmicTwin</h2>
          </Link>


          {/* Right - User Profile with Logout */}
          <div className="relative" ref={logoutRef}>
            <div
              className="flex items-center text-white cursor-pointer"
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            >
              <span className="text-lg font-medium mr-2">{userName}</span>
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Logout Dropdown */}
            {showLogoutMenu && (
              <div className="logout-menu">
                <div className="logout-menu-item">
                  <div className="text-sm text-gray-300">Signed in as</div>
                  <div className="font-medium text-white">{userName}</div>
                </div>
                <div className="logout-menu-item" onClick={() => router.push('/profile')}>
                  My Profile
                </div>
                <div className="logout-menu-item" onClick={() => router.push('/dashboard')}>
                  Dashboard
                </div>
                <div className="logout-menu-item" onClick={handleLogout}>
                  🚀 Logout
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center justify-center p-4">
          <div className="text-center mb-12">
            <h1 className="text-white text-5xl font-bold mt-10 mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <span className="constellation">Hello</span>
            </h1>
            <p className="text-lg text-gray-300 tracking-wider">
              Welcome aboard, {userName}. Your cosmic alignment awaits ✨
            </p>
          </div>

          <div className="glassmorphic w-full max-w-2xl rounded-3xl p-8 text-center relative">
            {/* Centered Progress Bar */}
            <div className="flex justify-center mb-8">
              <div className="orbital-progress" style={{ '--progress': progress }}>
                <svg height="100" width="100">
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'var(--primary-color)', stopOpacity: 1 }}></stop>
                      <stop offset="100%" style={{ stopColor: 'var(--secondary-color)', stopOpacity: 1 }}></stop>
                    </linearGradient>
                  </defs>
                  <circle className="orbital-progress-track" cx="50" cy="50" fill="transparent" r="45" strokeWidth="4"></circle>
                  <circle className="orbital-progress-fill" cx="50" cy="50" fill="transparent" r="45" strokeLinecap="round" strokeWidth="4"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  {progress}%
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="mb-4 text-sm text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </div>

              <h2 className="text-white text-2xl font-medium leading-tight tracking-wide mb-8">
                {questions[currentQuestion].question}
              </h2>

              <div className="flex flex-col gap-4 items-center">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full max-w-md rounded-xl h-14 text-sm font-medium neon-button ${selectedAnswer === index ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isLoading}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-10">
                <button
                  className={`rounded-full h-14 w-40 text-lg font-bold tracking-widest neon-next-button ${isLoading ? 'loading' : ''}`}
                  onClick={handleNext}
                  disabled={selectedAnswer === null || isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="loading-spinner"></div>
                      Processing...
                    </span>
                  ) : (
                    currentQuestion === questions.length - 1 ? 'Finish' : 'Next'
                  )}
                </button>

                {/* Loading State UI */}
                {isLoading && (
                  <div className="mt-6 text-center space-y-2">
                    <div className="text-sm text-cyan-400 animate-pulse">
                      🌌 Analyzing your cosmic personality...
                    </div>
                    <div className="text-xs text-gray-400">
                      Finding your perfect planetary match ✨
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      This may take a moment as we consult the stars...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
