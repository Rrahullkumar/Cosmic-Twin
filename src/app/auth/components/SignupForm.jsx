'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // Added for error handling
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous errors
    
    try {
      // Call your authentication API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to quiz
        console.log('Account created successfully:', data);
        router.push('/auth/login');
      } else {
        // Show error from API
        setError(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Inline Styles */}
      <style jsx>{`
        @keyframes stars {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-2000px); }
        }
        
        @keyframes warp {
          from { transform: translateZ(-10px) }
          to { transform: translateZ(1000px) }
        }
        
        .stars {
          background-image:
            radial-gradient(3px 3px at 20px 30px, #eee, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(3px 3px at 50px 160px, #ddd, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 150px 120px, #ddd, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 160px 100px, #fff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: stars 200s linear infinite;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 0;
        }
        
        .shooting-star {
          position: absolute;
          left: 50%;
          top: 50%;
          height: 8px;
          background: linear-gradient(-45deg, #8013ec, rgba(0, 0, 0, 0));
          border-radius: 999em;
          filter: drop-shadow(0 0 6px #8013ec);
          animation: tail 3s ease-in-out infinite, shooting 3s ease-in-out infinite;
        }
        
        .shooting-star::before, .shooting-star::after {
          content: '';
          position: absolute;
          top: calc(50% - 1px);
          right: 0;
          height: 2px;
          background: linear-gradient(-45deg, rgba(0, 0, 0, 0), #8013ec, rgba(0, 0, 0, 0));
          transform: translateX(50%) rotateZ(45deg);
          border-radius: 100%;
          animation: shining 3s ease-in-out infinite;
        }
        
        @keyframes tail {
          0% { width: 0; }
          30% { width: 100px; }
          100% { width: 0; }
        }
        
        @keyframes shining {
          0% { width: 0; }
          50% { width: 30px; }
          100% { width: 0; }
        }
        
        @keyframes shooting {
          0% { transform: translateX(0); }
          100% { transform: translateX(300px); }
        }
      `}</style>

      <div className="relative flex min-h-screen flex-col items-center justify-center bg-transparent p-4 overflow-hidden"
           style={{backgroundColor: '#000000', color: '#ffffff', fontFamily: 'Exo, sans-serif'}}>
        
        {/* Animated Background */}
        <div className="stars"></div>
        <div className="shooting-star" style={{top: '20%', left: '-50px', animationDelay: '1s'}}></div>
        <div className="shooting-star" style={{top: '80%', left: '-100px', animationDelay: '2.5s'}}></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1122] via-black to-[#100c22] opacity-80"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/">
              <h1
                className="text-5xl font-bold text-white cursor-pointer hover:opacity-80 transition-opacity"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  textShadow: '0 0 10px #8013ec, 0 0 20px #8013ec' 
                }}
              >
                CosmicTwin
              </h1>
            </Link>
          </div>
          
          <form
            onSubmit={handleSubmit}
            className="backdrop-blur-md border rounded-2xl"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderColor: 'rgba(128, 19, 236, 0.5)',
              boxShadow: '0 0 30px rgba(128, 19, 236, 0.5)'
            }}
          >
            {/* Tab Headers */}
            <div className="flex border-b" style={{borderColor: 'rgba(128, 19, 236, 0.5)'}}>
              <Link
                href="/auth/login"
                className="flex-1 py-3 text-center text-lg font-bold text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center"
                style={{
                  ':hover': {
                    backgroundColor: 'rgba(128, 19, 236, 0.2)'
                  }
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(128, 19, 236, 0.2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Login
              </Link>
              <button
                type="button"
                className="flex-1 py-3 text-center text-lg font-bold text-white border-b-2 transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(128, 19, 236, 0.3)',
                  borderBottomColor: '#00e5ff',
                  textShadow: '0 0 5px #00e5ff' 
                }}
              >
                Sign Up
              </button>
            </div>
            
            {/* Form Fields */}
            <div className="p-8 space-y-6">
              {/* Error Display */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-center text-sm">
                  {error}
                </div>
              )}

              <div className="relative group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 bg-transparent border-2 rounded-xl px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{ 
                    borderColor: 'rgba(128, 19, 236, 0.5)',
                    boxShadow: 'inset 0 0 10px rgba(0, 229, 255, 0.2)',
                    caretColor: '#00e5ff'
                  }}
                  onFocus={(e) => {
                    e.target.style.ringColor = '#00e5ff';
                    e.target.style.borderColor = 'transparent';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(128, 19, 236, 0.5)';
                  }}
                  onMouseEnter={(e) => e.target.style.borderColor = 'rgba(0, 229, 255, 0.8)'}
                  onMouseLeave={(e) => e.target.style.borderColor = 'rgba(128, 19, 236, 0.5)'}
                  required
                  disabled={isLoading}
                />
                <div 
                  className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-10"
                  style={{background: 'linear-gradient(to right, #8013ec, #00e5ff)'}}
                ></div>
              </div>

              <div className="relative group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-transparent border-2 rounded-xl px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{ 
                    borderColor: 'rgba(128, 19, 236, 0.5)',
                    boxShadow: 'inset 0 0 10px rgba(0, 229, 255, 0.2)',
                    caretColor: '#00e5ff'
                  }}
                  onFocus={(e) => {
                    e.target.style.ringColor = '#00e5ff';
                    e.target.style.borderColor = 'transparent';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(128, 19, 236, 0.5)';
                  }}
                  onMouseEnter={(e) => e.target.style.borderColor = 'rgba(0, 229, 255, 0.8)'}
                  onMouseLeave={(e) => e.target.style.borderColor = 'rgba(128, 19, 236, 0.5)'}
                  required
                  disabled={isLoading}
                />
                <div 
                  className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-10"
                  style={{background: 'linear-gradient(to right, #8013ec, #00e5ff)'}}
                ></div>
              </div>
              
              <div className="relative group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-transparent border-2 rounded-xl px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{ 
                    borderColor: 'rgba(128, 19, 236, 0.5)',
                    boxShadow: 'inset 0 0 10px rgba(0, 229, 255, 0.2)',
                    caretColor: '#00e5ff'
                  }}
                  onFocus={(e) => {
                    e.target.style.ringColor = '#00e5ff';
                    e.target.style.borderColor = 'transparent';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(128, 19, 236, 0.5)';
                  }}
                  onMouseEnter={(e) => e.target.style.borderColor = 'rgba(0, 229, 255, 0.8)'}
                  onMouseLeave={(e) => e.target.style.borderColor = 'rgba(128, 19, 236, 0.5)'}
                  required
                  disabled={isLoading}
                />
                <div 
                  className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-10"
                  style={{background: 'linear-gradient(to right, #8013ec, #00e5ff)'}}
                ></div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-14 rounded-full text-lg font-bold text-white transition-all duration-300 transform active:scale-100 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                style={{
                  background: 'linear-gradient(to right, #8013ec, #4c00a4)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'linear-gradient(to right, #9c27b0, #673ab7)';
                    e.target.style.boxShadow = '0 0 20px #8013ec';
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'linear-gradient(to right, #8013ec, #4c00a4)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                <span className="relative z-10">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </span>
              </button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-400 hover:text-[#00e5ff] hover:underline transition-all duration-300 relative group"
                >
                  Already have an account? Sign in
                  <span 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{background: 'linear-gradient(to right, transparent, #00e5ff)'}}
                  ></span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
