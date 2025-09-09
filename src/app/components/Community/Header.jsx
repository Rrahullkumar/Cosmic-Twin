// Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img 
              alt="CosmicTwin Logo" 
              className="h-8 w-8"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA36HmyvfrbRwXa7coGo-JOhXN6hk5gbjlXZ5XEN_FW3ewKRv-YpQZweyBo2QEBADcK6KMX55Dh6K4fBu4oh4XJ_YhksGgvDyCCNjPitITF-ct8aiYpVnrz1zpZ35xZNJ8VyIrKMkk2JmZ3VRqcojdYqDA0OGwWEJz1-K1_9b0pyDACkXZphqcRoBMeOfynpXcR9gScDY8lCVbkVwWAKwNGa9L3wjb9C19M1P0_diWPdvTamNobW68OYVq1pui_Tl1jJ-8vERmfNoE" 
            />
            <span className="text-xl font-bold text-[var(--dark-text)]">CosmicTwin</span>
          </div>
          
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
                <a 
                  className="block px-4 py-2 text-sm text-[var(--dark-text)] hover:bg-[var(--warm-lilac-gray)]"
                  href="#"
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
