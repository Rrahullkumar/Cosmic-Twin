'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InnerHeader({ userName }) {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const logoutRef = useRef(null);

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

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        console.log('✅ Logout successful');
        setShowLogoutMenu(false);
        
        // Force hard redirect to clear everything
        window.location.href = '/';
      } else {
        throw new Error('Logout API failed');
      }

    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect on error to be safe
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if no user (parent handles auth)
  if (!userName) {
    return (
      <header className="relative z-10 w-full">
        <div className="container mx-auto flex items-center justify-between px-4 py-6 max-w-6xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-2xl font-bold text-purple-400">CosmicTwin</div>
          </Link>
          <div className="flex items-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <style jsx>{`
        .logout-menu {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 10px;
          background: rgba(10, 5, 20, 0.95);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
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
          background: rgba(168, 85, 247, 0.1);
          color: #a855f7;
        }
        
        .logout-menu-item:last-child {
          border-bottom: none;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #f472b6);
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
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #a855f7;
          animation: spin 0.8s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <header className="relative z-10 w-full">
        <div className="container mx-auto flex items-center justify-between px-4 py-6 max-w-6xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-2xl font-bold text-purple-400">CosmicTwin</div>
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
                <div 
                  className="logout-menu-item" 
                  onClick={handleLogout}
                  style={{ opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="loading-spinner"></div>
                      Logging out...
                    </span>
                  ) : (
                    '🚀 Logout'
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
