export default function HowItWorks() {
  return (
    <section className="py-24 sm:py-32">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold" style={{fontFamily: "'Orbitron', sans-serif"}}>How It
          Works</h2>
        <p className="mt-4 text-lg text-[var(--secondary-color)]">A streamlined process to find your place
          in the cosmos.</p>
      </div>
      <div className="relative grid md:grid-cols-3 gap-8">
        <div className="absolute w-full top-1/2 -translate-y-1/2 hidden md:block">
          <svg className="text-slate-700" height="2" width="100%">
            <line stroke="currentColor" strokeDasharray="8 8" strokeWidth="2" x1="0" x2="100%"
              y1="1" y2="1"></line>
          </svg>
        </div>
        <div
          className="relative flex flex-col gap-4 items-center text-center p-8 rounded-2xl bg-transparent border-2 border-transparent">
          <div
            className="flex items-center justify-center h-20 w-20 rounded-full bg-[var(--card-background-color)] border border-[var(--border-color)] text-[var(--primary-color)] text-3xl font-bold shadow-lg shadow-purple-500/10 mb-4 z-10">
            1
          </div>
          <h3 className="text-2xl font-bold" style={{fontFamily: "'Orbitron', sans-serif"}}>Take the Quiz
          </h3>
          <p className="text-[var(--secondary-color)] text-sm max-w-xs">Answer our carefully crafted
            questions to reveal the essence of your personality.</p>
        </div>
        <div
          className="relative flex flex-col gap-4 items-center text-center p-8 rounded-2xl bg-transparent border-2 border-transparent">
          <div
            className="flex items-center justify-center h-20 w-20 rounded-full bg-[var(--card-background-color)] border border-[var(--border-color)] text-[var(--primary-color)] text-3xl font-bold shadow-lg shadow-purple-500/10 mb-4 z-10">
            2
          </div>
          <h3 className="text-2xl font-bold" style={{fontFamily: "'Orbitron', sans-serif"}}>Get Matched</h3>
          <p className="text-[var(--secondary-color)] text-sm max-w-xs">Our system matches you with a
            planet that resonates with your unique traits.</p>
        </div>
        <div
          className="relative flex flex-col gap-4 items-center text-center p-8 rounded-2xl bg-transparent border-2 border-transparent">
          <div
            className="flex items-center justify-center h-20 w-20 rounded-full bg-[var(--card-background-color)] border border-[var(--border-color)] text-[var(--primary-color)] text-3xl font-bold shadow-lg shadow-purple-500/10 mb-4 z-10">
            3
          </div>
          <h3 className="text-2xl font-bold" style={{fontFamily: "'Orbitron', sans-serif"}}>Join Your Tribe
          </h3>
          <p className="text-[var(--secondary-color)] text-sm max-w-xs">Connect with your cosmic community
            and explore a universe of possibilities.</p>
        </div>
      </div>
    </section>
  );
}
