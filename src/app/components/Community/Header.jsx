// Header.jsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // console.log('🚪 Logging out...');

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // console.log('✅ Logout successful');
        // Redirect to login page
        router.push('/auth/login');
      } else {
        // console.error('❌ Logout failed:', data.message);
      }
    } catch (error) {
      // console.error('❌ Logout error:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* <div className="flex items-center gap-2">
            <img 
              alt="CosmicTwin Logo" 
              className="h-8 w-8"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA36HmyvfrbRwXa7coGo-JOhXN6hk5gbjlXZ5XEN_FW3ewKRv-YpQZweyBo2QEBADcK6KMX55Dh6K4fBu4oh4XJ_YhksGgvDyCCNjPitITF-ct8aiYpVnrz1zpZ35xZNJ8VyIrKMkk2JmZ3VRqcojdYqDA0OGwWEJz1-K1_9b0pyDACkXZphqcRoBMeOfynpXcR9gScDY8lCVbkVwWAKwNGa9L3wjb9C19M1P0_diWPdvTamNobW68OYVq1pui_Tl1jJ-8vERmfNoE" 
            />
            <span className="text-xl font-bold text-[var(--dark-text)]">CosmicTwin</span>
          </div> */}

          <Link href="/" className="flex items-center gap-3">
            <svg className="h-8 w-8 text-[var(--primary-color)]" fill="none" viewBox="0 0 50 50"
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
            <h2 className="text-2xl font-bold text-[var(--primary-color)] " style={{ fontFamily: "'Orbitron', sans-serif" }}>CosmicTwin</h2>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              className="text-[var(--dark-text)] hover:text-[var(--muted-pink)] font-medium transition-colors"
              href="/dashboard"
            >
              Dashboard
            </a>
            <a
              className="text-[var(--dark-text)] hover:text-[var(--muted-pink)] font-medium transition-colors"
              href="/quiz"
            >
              Quiz
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button
                className="flex items-center justify-center rounded-full h-10 w-10 bg-center bg-no-repeat bg-cover"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB0syBe1EZCoSucRuELziUBwjr8teKaJe8LyeK48KKimemeiCL1mvQf8yTSXHhaO7ag9ltlbMyGevevQu40F1MGRUNzSzbur-y1KG-2ounGq8Kr58zeosW_2yR-D_53WA7tXhnKC5WbDhdpzVOJY6GkxVAbzOODpv89JMhoK8G7wyuSuFTozHF2A7iQhprydg-7qcZtbRmh9cW8tufum4GzsVzwPiJjrLYfuOSZIKD-RSzQff5yyRRdnS-bizbBrNSrvg45ShR8t3I")'
                }}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                <a
                  className="block px-4 py-2 text-sm text-[var(--dark-text)] hover:bg-[var(--warm-lilac-gray)]"
                  href="#"
                >
                  User Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-[var(--dark-text)] hover:bg-[var(--warm-lilac-gray)] transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
