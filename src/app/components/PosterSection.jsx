export default function PosterSection() {
  return (
    <section className="relative rounded-3xl overflow-hidden my-24 sm:my-32">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVUTa-Vz4bYTlttWkQ0lDmTVboxIWpBnx3C2Lx6qKvLpVawTV1ITMnJtbl86eJA7AB-IykMLt2HALIImf1ZdMWOQnAFKCO8gdI0jnecnqNT8gc509KlRLHYZsbXJV5KgWRwcOYelAZTX0G3v_bdQbMJ1BoAwfdBgOYpNyLXs7Z953WhfxcpFyXINENFTDWCMKaeHT5x_5c0Z1qB6wlLHe6h_NPuEom27PGNVQlHdDAuYHZcgmCe_dnLxoVEBFU4JLc1IoTSSAINqk")'}}>
      </div>
      <div className="relative flex flex-col items-center justify-center gap-8 min-h-[50vh] p-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tighter !leading-tight"
          style={{fontFamily: "'Orbitron', sans-serif"}}>Embrace Your Cosmic Journey</h2>
        <p className="max-w-xl text-lg text-slate-300">Connect with your cosmic twin and explore the
          universe within.</p>
        <button
          className="min-w-[150px] transform transition-transform hover:scale-105 items-center justify-center rounded-full h-12 px-8 bg-[var(--primary-color)] text-base font-bold tracking-wider hover:bg-opacity-90">
          <span className="truncate">Get Started</span>
        </button>
      </div>
    </section>
  );
}
