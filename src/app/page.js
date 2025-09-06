import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import CommunityShowcase from './components/CommunityShowcase';
import PosterSection from './components/PosterSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 star-bg z-0 opacity-50"></div>
      <div className="relative z-10 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-6 py-16 sm:py-24 lg:py-32">
          <HeroSection />
          <HowItWorks />
          <CommunityShowcase />
          <PosterSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
