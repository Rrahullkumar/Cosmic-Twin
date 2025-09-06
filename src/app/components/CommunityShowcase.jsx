export default function CommunityShowcase() {
    return (
        <section className="py-24 sm:py-32">
            <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    <span
                        style={{
                            background: 'linear-gradient(to right, #8b5cf6, #06b6d4)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}>Community </span>
                    Showcase
                </h2>

                <p className="mt-4 text-lg text-[var(--secondary-color)] max-w-3xl mx-auto">Witness the diversity of
                    lifeforms and civilizations that call our universe home. Each community is a testament to
                    the infinite possibilities of the cosmos.</p>
            </div>
            <div className="community-grid">
                <div className="holo-card group">
                    <div className="p-6 relative z-10">
                        <div className="holo-image-container overflow-hidden rounded-xl mb-4">
                            <img alt="Planet Xylos" className="w-full h-64 object-cover holo-image"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpHGcqMtB827VXFY_KL7ic_YeOSaRMpu3ktsTygFTMmUjOfHqskfnHDyZQMwCOogmuvx9fmx_hQQ02D7dH-k8PBIFyvIm5VFKCKcbQT53bchOrWJc0kfURuKRgZ_oefAXxyNBwSVUB55Bc3SRHbizYVEN9xi-KJaE_ngGHf668Qi47ocD2IcIW97Ik8pk8gcnBOCXSWmQhC-yJNUmNj_whRroR7yA6S2x32ZE19oEGBHvU4sqVlIh4GZI3Hrg9hvFug6hesseOS4" />
                        </div>
                        <span
                            className="holo-tag absolute top-9 left-0 px-4 py-1 text-xs font-bold uppercase tracking-widest">Type:
                            Visionary</span>
                        <h3 className="text-3xl font-bold mt-4 text-white"
                            style={{ fontFamily: "'Orbitron', sans-serif" }}>Planet Xylos</h3>
                        <p className="text-[var(--secondary-color)] text-sm mt-2 font-light leading-relaxed h-12">
                            The planet of dreamers, artists, and architects of ethereal realities.</p>
                        <button
                            className="mt-6 w-full text-center rounded-lg h-11 px-6 bg-transparent border border-purple-400 text-purple-300 text-sm font-bold tracking-wider hover:bg-purple-400/20 hover:text-white transition-all">
                            Explore Community
                        </button>
                    </div>
                </div>
                <div className="holo-card group">
                    <div className="p-6 relative z-10">
                        <div className="holo-image-container overflow-hidden rounded-xl mb-4">
                            <img alt="Planet Zylos" className="w-full h-64 object-cover holo-image"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANb0M4rFzqjogSku8o_9HoOhZ57Vjp6YAAEsj2QPtA-qwGqaFAlvlCVfK3JkMKXiDcLdIxFyiLIVyj6i4N0rGtBiTeKkZJ-aL3TzlVhNt0qzFF3sV9cLz2NHTesszgvPV-2vaQUOQxfHJA_owtx71TOoaHP_GPufIDF9ZmojQ9UMasj9Ic8Z3-1OBJe0ZgYMQpHtEssiOZ7XrbbkNXAgA2ut_K2hi_ilb0Wv2_KmGkxJet2tpQLqSJEqNkG4G75Rk4Jh6HNtd3dJE" />
                        </div>
                        <span
                            className="holo-tag absolute top-9 left-0 px-4 py-1 text-xs font-bold uppercase tracking-widest">Type:
                            Pioneer</span>
                        <h3 className="text-3xl font-bold mt-4 text-white"
                            style={{ fontFamily: "'Orbitron', sans-serif" }}>Planet Zylos</h3>
                        <p className="text-[var(--secondary-color)] text-sm mt-2 font-light leading-relaxed h-12">
                            Home to intrepid adventurers charting the unknown frontiers of the galaxy.</p>
                        <button
                            className="mt-6 w-full text-center rounded-lg h-11 px-6 bg-transparent border border-purple-400 text-purple-300 text-sm font-bold tracking-wider hover:bg-purple-400/20 hover:text-white transition-all">
                            Explore Community
                        </button>
                    </div>
                </div>
                <div className="holo-card group">
                    <div className="p-6 relative z-10">
                        <div className="holo-image-container overflow-hidden rounded-xl mb-4">
                            <img alt="Planet Nilos" className="w-full h-64 object-cover holo-image"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVUTa-Vz4bYTlttWkQ0lDmTVboxIWpBnx3C2Lx6qKvLpVawTV1ITMnJtbl86eJA7AB-IykMLt2HALIImf1ZdMWOQnAFKCO8gdI0jnecnqNT8gc509KlRLHYZsbXJV5KgWRwcOYelAZTX0G3v_bdQbMJ1BoAwfdBgOYpNyLXs7Z953WhfxcpFyXINENFTDWCMKaeHT5x_5c0Z1qB6wlLHe6h_NPuEom27PGNVQlHdDAuYHZcgmCe_dnLxoVEBFU4JLc1IoTSSAINqk" />
                        </div>
                        <span
                            className="holo-tag absolute top-9 left-0 px-4 py-1 text-xs font-bold uppercase tracking-widest">Type:
                            Scholar</span>
                        <h3 className="text-3xl font-bold mt-4 text-white"
                            style={{ fontFamily: "'Orbitron', sans-serif" }}>Planet Nilos</h3>
                        <p className="text-[var(--secondary-color)] text-sm mt-2 font-light leading-relaxed h-12">A
                            civilization of thinkers, innovators, and keepers of cosmic knowledge.</p>
                        <button
                            className="mt-6 w-full text-center rounded-lg h-11 px-6 bg-transparent border border-purple-400 text-purple-300 text-sm font-bold tracking-wider hover:bg-purple-400/20 hover:text-white transition-all">
                            Explore Community
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
