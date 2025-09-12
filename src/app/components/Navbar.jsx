'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
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
          <h2 className="text-2xl font-bold" style={{fontFamily: "'Orbitron', sans-serif"}}>CosmicTwin</h2>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-medium hover:text-[var(--primary-color)] transition-colors" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:text-[var(--primary-color)] transition-colors" href="/about">
            About
          </Link>
          <Link className="text-sm font-medium hover:text-[var(--primary-color)] transition-colors" href="/galaxy">
            Planets
          </Link>
          <Link className="text-sm font-medium hover:text-[var(--primary-color)] transition-colors" href="/community">
            Community
          </Link>
        </nav>
        <Link href="/auth/signup" 
          className="hidden md:flex min-w-[100px] items-center justify-center rounded-full h-10 px-6 bg-[var(--primary-color)] text-sm font-bold tracking-wider hover:bg-opacity-80 transition-all">
          <span className="truncate">Get Started</span>
        </Link>
        <button className="md:hidden text-white">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round"
              strokeWidth="2"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}
