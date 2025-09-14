'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {

    const router = useRouter();

    useEffect(() => {
        // Particle animation script
        const particleContainer = document.getElementById('particle-container');
        const numParticles = 50;

        for (let i = 0; i < numParticles; i++) {
            createParticle();
        }

        function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            const containerRect = particleContainer.getBoundingClientRect();
            const startX = containerRect.width / 2;
            const startY = containerRect.height / 2;
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * (Math.min(containerRect.width, containerRect.height) / 2 - 50) + 50;
            const endX = Math.cos(angle) * radius;
            const endY = Math.sin(angle) * radius;
            particle.style.setProperty('--translate-end', `translate(${endX}px, ${endY}px)`);
            const duration = Math.random() * 3 + 2;
            particle.style.animationDuration = `${duration}s`;
            const delay = Math.random() * 5;
            particle.style.animationDelay = `${delay}s`;
            particleContainer.appendChild(particle);
            particle.addEventListener('animationend', () => {
                particle.remove();
                createParticle();
            });
        }

        // DNA animation script
        const dnaContainer = document.getElementById('dna-container');
        const numDnaParticles = 80;
        const radius = 120;
        const turns = 4;

        for (let i = 0; i < numDnaParticles; i++) {
            const angle = (i / numDnaParticles) * Math.PI * 2 * turns;
            const y = (i - numDnaParticles / 2) * 4;

            // Strand 1
            const particle1 = document.createElement('div');
            const x1 = Math.cos(angle) * (radius / 2.5);
            const z1 = Math.sin(angle) * (radius / 2.5);
            particle1.style.setProperty('--x-pos', x1);
            particle1.style.setProperty('--y-pos', y);
            particle1.style.animationDelay = `${(i / numDnaParticles) * 8}s`;
            dnaContainer.appendChild(particle1);

            // Strand 2
            const particle2 = document.createElement('div');
            const x2 = Math.cos(angle + Math.PI) * (radius / 2.5);
            const z2 = Math.sin(angle + Math.PI) * (radius / 2.5);
            particle2.style.setProperty('--x-pos', x2);
            particle2.style.setProperty('--y-pos', y);
            particle2.style.animationDelay = `${(i / numDnaParticles) * 8}s`;
            dnaContainer.appendChild(particle2);
        }
    }, []);

    return (
        <section className="relative">
            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]">
            </div>
            <div className="relative grid lg:grid-cols-2 items-center gap-8 rounded-3xl p-8 hero-glow">
                <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
                <div className="relative z-10 text-center lg:text-left">
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter !leading-tight"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        Find Your <span
                            style={{
                                background: 'linear-gradient(to right, #c084fc, #ec4899)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}>Cosmic
                            Twin</span>
                    </h1>
                    <p className="max-w-2xl text-lg text-slate-300 mt-6 mx-auto lg:mx-0">Discover your celestial
                        match and connect with your cosmic community through the stars. Our advanced algorithm
                        analyzes your personality to reveal your planetary counterpart.</p>
                    <button onClick={() => router.push('/auth/signup')}
                        className="mt-10 min-w-[200px] transform transition-transform hover:scale-105 items-center justify-center rounded-full h-14 px-10 text-lg font-bold tracking-wider hover:opacity-90 shadow-[0_0_20px_rgba(238,99,238,0.5)]"
                        style={{
                            background: 'linear-gradient(to right, #7c3aed, #ec4899)',
                            border: 'none'
                        }}
                    >
                        <span className="truncate">Begin Your Journey</span>
                    </button>

                </div>
                <div className="relative z-10 w-full h-[300px] lg:h-[500px]">
                    <div className="absolute inset-0 pointer-events-none" id="particle-container"></div>
                    <div className="dna-strand" id="dna-container"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="planet-ring border-purple-500/20 border-2 w-[80%] h-[80%] lg:w-[400px] lg:h-[400px]"
                            style={{ animationDuration: '25s' }}></div>
                        <div className="planet-ring border-cyan-400/20 border-2 w-[70%] h-[70%] lg:w-[350px] lg:h-[350px]"
                            style={{ animationDuration: '18s', animationDirection: 'reverse' }}></div>
                        <div className="planet-ring border-pink-500/20 border-2 w-[90%] h-[90%] lg:w-[450px] lg:h-[450px]"
                            style={{ animationDuration: '30s' }}></div>
                    </div>
                    <model-viewer ar="" ar-modes="webxr scene-viewer quick-look" auto-rotate=""
                        camera-controls="" enable-pan=""
                        poster="https://modelviewer.dev/shared-assets/models/poster-astronaut.png"
                        shadow-intensity="1" src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                        style={{ width: '100%', height: '100%', '--mv-target-exposure': '0.8', '--mv-environment-image': 'neutral', backgroundColor: 'transparent' }}></model-viewer>
                </div>
            </div>
        </section>
    );
}
