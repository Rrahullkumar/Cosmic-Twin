'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [planet, setPlanet] = useState(null);
    const [dailyFortune, setDailyFortune] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleCommunityClick = () => {
        router.push('/community');
    };

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                // 1. Fetch user info
                const userResponse = await fetch('/api/auth/me');
                if (!userResponse.ok) {
                    router.push('/auth/login');
                    return;
                }
                const userData = await userResponse.json();
                setUser(userData.user);

                // 2. Fetch matched planet data
                const planetResponse = await fetch('/api/user/planet');
                if (planetResponse.ok) {
                    const planetData = await planetResponse.json();
                    setPlanet(planetData.planet);
                }

                // 3. Fetch daily cosmic fortune
                const fortuneResponse = await fetch('/api/user/daily-fortune');
                if (fortuneResponse.ok) {
                    const fortuneData = await fortuneResponse.json();
                    setDailyFortune(fortuneData.fortune);
                }

            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b021d] flex items-center justify-center overflow-hidden">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mb-4"></div>
                    <div className="text-white text-xl">Loading your cosmic dashboard...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
    }

    return (
        <>
            <style jsx global>{`
                /* ✅ PREVENT HORIZONTAL SCROLL GLOBALLY */
                html, body {
                    overflow-x: hidden;
                    max-width: 100%;
                }
                
                :root {
                    --primary-purple: #a855f7;
                    --primary-blue: #60a5fa;
                    --primary-pink: #f472b6;
                }
                
                body {
                    font-family: 'Quicksand', sans-serif;
                    background-color: #0b021d;
                }
                
                .glow-text {
                    text-shadow: 0 0 8px rgba(255, 255, 255, 0.4), 0 0 20px var(--primary-pink), 0 0 30px var(--primary-blue);
                }
                
                .glow-button {
                    box-shadow: 0 0 15px var(--primary-purple), 0 0 25px var(--primary-purple);
                    transition: all 0.3s ease;
                }
                
                .glow-button:hover {
                    box-shadow: 0 0 25px var(--primary-purple), 0 0 40px var(--primary-purple);
                    transform: translateY(-2px);
                }
                
                .star {
                    position: absolute;
                    background-color: white;
                    border-radius: 50%;
                    animation: twinkle 5s infinite ease-in-out;
                    pointer-events: none; /* ✅ PREVENT INTERACTION */
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                
                .floating-planet {
                    position: absolute;
                    width: 80px;
                    height: 80px;
                    animation: float 15s infinite ease-in-out, rotate 20s infinite linear;
                    filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.6));
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-30px); }
                }
                
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* ✅ HIDE SCROLLBAR FOR COSMIC FRIENDS SECTION */
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* ✅ ROOT CONTAINER WITH OVERFLOW PREVENTION */}
            <div className="min-h-screen overflow-x-hidden w-full" style={{
                fontFamily: 'Quicksand, sans-serif',
                backgroundColor: '#0b021d',
                maxWidth: '100vw' // PREVENT VIEWPORT OVERFLOW
            }}>
                {/* ✅ CONSTRAINED STARS BACKGROUND */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                    {Array.from({ length: 150 }).map((_, i) => (
                        <div
                            key={i}
                            className="star"
                            style={{
                                width: `${Math.random() * 2 + 0.5}px`,
                                height: `${Math.random() * 2 + 0.5}px`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${Math.random() * 3 + 4}s`,
                            }}
                        />
                    ))}
                </div>

                {/* ✅ HEADER WITH CONTAINER CONSTRAINT */}
                <header className="relative z-10 w-full">
                    <div className="container mx-auto flex items-center justify-between px-4 py-6 max-w-6xl">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="text-2xl font-bold text-purple-400">CosmicTwin</div>
                        </Link>
                        <button
                            onClick={() => router.push('/auth/logout')}
                            className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* ✅ MAIN CONTENT WITH PROPER CONSTRAINTS */}
                <main className="relative z-10 w-full min-h-screen flex items-center justify-center py-8">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="space-y-8 w-full">

                            {/* Welcome Header */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center glow-text px-4">
                                Space Traveler {user.name} has arrived <span className="text-purple-400">✦</span>
                            </h1>

                            {/* ✅ PLANET INFORMATION - RESPONSIVE & CONTAINED */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center gap-6 w-full max-w-none">
                                <div className="flex-shrink-0">
                                    <img
                                        alt={planet?.name || "Your Planet"}
                                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full shadow-lg border-4 border-white/20 max-w-full"
                                        src={planet?.image || "/images/planet-xylos.jpg"}
                                    />
                                </div>
                                <div className="text-center md:text-left flex-1 min-w-0"> {/* ✅ min-w-0 prevents overflow */}
                                    <h2 className="text-xl sm:text-2xl font-bold break-words">{planet?.name || 'Your Cosmic Planet'}</h2>
                                    <p className="text-purple-300 font-medium">{planet?.type || 'Cosmic'} Type</p>
                                    <p className="mt-2 text-gray-300 text-sm sm:text-base leading-relaxed break-words">
                                        {planet?.description || 'Your cosmic journey awaits discovery...'}
                                    </p>
                                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                        {planet?.traits?.slice(0, 4).map((trait, index) => (
                                            <span
                                                key={index}
                                                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${index === 0 ? 'bg-pink-500/50' :
                                                        index === 1 ? 'bg-blue-500/50' :
                                                            index === 2 ? 'bg-purple-500/50' :
                                                                'bg-teal-500/50'
                                                    } text-white`}
                                            >
                                                {trait}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ✅ DAILY FORTUNE - RESPONSIVE TEXT */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-center mb-4">Message from the Stars ✨</h3>
                                <p className="text-center text-gray-300 text-sm sm:text-base leading-relaxed break-words px-2">
                                    {dailyFortune
                                        ? dailyFortune.replace(/\bRahul\b/g, user.name)
                                        : `${user.name}, the stars align to bring you clarity. Trust your intuition and embrace new opportunities.`
                                    }
                                </p>
                            </div>

                            {/* ✅ COSMIC FRIENDS - HORIZONTAL SCROLL CONTAINED */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-center mb-4">Meet Your Cosmic Friends 🌌</h3>
                                <div className="overflow-x-auto scrollbar-hide pb-2">
                                    <div className="flex items-center justify-center space-x-[-12px] min-w-max px-4">
                                        {[
                                            "https://lh3.googleusercontent.com/aida-public/AB6AXuDEBRx0PxIxIrj6euYj4-Hc65yc3VaXP7R6YS7vA9JHqNbCLZTemSdd2_Y68j3CBvLt_XQctKnjdI9cOqXHmyM1_hGJcJ-vxd_SyxYdrkBPGvbOKc6eVaucX9J7GvEV9XLqxQJmSmIyDesyoL85xf1TXOT5PAFIrHz-OuFcJO5Cdkd6XAd3RKnFMI7WLyin3EQnFt3L44PYdFhKnUQNESSeY0AInYB3MpnziRUX74GFVizzj-uNxVmuqx--poePKI22e_xPqhkLkXxk",
                                            "https://lh3.googleusercontent.com/aida-public/AB6AXuC4SOOFO6HwE80zz9I0BxRnnwNbKuxbr7hCgA_0WMmdYz_lfoMpWuTNW0nk7NYBAxo4aiQ_6BRtRWPwAvoYSkO-BNGvnFCXMo4S9Ys1k5EBWSu17pfk3m9yyNrNtBSKRRTjATY4hQ570obR2LGAETqhMVJ3oN7YEQSymPkFNvJaURcG5mON1NNplId2BTlMPzLvLJni-T8vuu6vDysajjQ5_lrN07oCJiS8_007YYldWSVN91Bhb7bJlvSFXYgFJT9W-uFLLvU9J7UJ",
                                            "https://lh3.googleusercontent.com/aida-public/AB6AXuCzyGT-atmKi9iO72XwU4m0uV2IC3H42wLPD4p_htOQNOmK35Yp8ffLQH8XhKD3mTEe0c9PJrZlRUdnBBGTtGb_tXh25toGaC5De3scX-bx_aihNZpgnu2tLK6XwT0jcdTWWYKbzV7Qj8Vx6lT6bUdzyBnOmYnRZXhQfaXFcJSCdu8T_lOGyjaiPVdBvkQiEDJsFtagJBbT3YcXMKN0vTkazbPTfbGDwBE7VK0x_Vh5CTPLdOaRsm5IrWIZjWRL1nvJjN1j1dUN_9TV",
                                            "https://lh3.googleusercontent.com/aida-public/AB6AXuAVU50mCNuQ87bdrw0kcRlD3cbmXVHLN53dNBEelF-nufUzUbERaguec5v4uVgI8nFY7Z3doTLfNXFX36TQt7Li2jxAC54lxyVn78djMUA6SJ6FPzpMdM2gre6XVwMDLmbSS8aRP-l_8Ye7FD9E9-zUDWiDzTWMO5uoE1RTPCA9yVZEmAgGDXbHAP1AThkVPAO73Ry48ir4omS8oGZbQH4bxHWOiUw9_FqHuvuW2QFuD6l-iiXApkPeCMOG1MHRbqIj2SoQwXkP390C",
                                            "https://lh3.googleusercontent.com/aida-public/AB6AXuBB_ro6jLUf0xI2XGKI0Fygi5HfNbuSz_NjoCoN7AAKUVd_yIuaUD0oMwMRKvTSdviQvEC2O55UKuYwfi0p8Ygn103zPRmKWQ9UT0VZfllkwDFIIGu7XhkG1ZmT2TwuXug68mszSUjBEOp2NVlSoNwUG9op3LFuGX3P1yDTOwnWMJSUaffFXudzVoBcjaLpJopu0849u4m2vKe7WKOzHvS6KjdG9GRLfWrrDP9qOmhDnEZpBGi41zn0ZRctgtpUuyb-893PzNULFnjY"
                                        ].map((src, index) => (
                                            <img
                                                key={index}
                                                alt={`Friend ${index + 1}`}
                                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 border-purple-900/50 object-cover flex-shrink-0"
                                                src={src}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ✅ ACTION BUTTONS - RESPONSIVE GRID */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                                {/* <button className="glow-button bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 sm:px-6 rounded-full transition-all duration-300 text-sm sm:text-base">
                                    Explore Planet 🌍
                                </button> */}
                                <Link href="/galaxy" className="glow-button bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 sm:px-6 rounded-full transition-all duration-300 text-center text-sm sm:text-base">
                                    Explore Planet 🌍
                                </Link>
                                <button onClick={handleCommunityClick} className="glow-button bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-4 sm:px-6 rounded-full transition-all duration-300 text-sm sm:text-base">
                                    Meet Community 💫
                                </button>
                                <Link
                                    href="/quiz"
                                    className="glow-button bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 px-4 sm:px-6 rounded-full transition-all duration-300 text-center text-sm sm:text-base"
                                >
                                    Retake Quiz 🔄
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
