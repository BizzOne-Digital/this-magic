import { FiArrowDown } from 'react-icons/fi';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import Button from '../Button';

const HeroSection = ({ content }) => {
  const hero = content?.hero || {};
  const parts = hero.headlineParts || {};

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={hero.imageUrl || 'https://images.unsplash.com/photo-1571266028247-4d2a4b4e4b3a?w=1920&q=80'}
          alt="DJ performing at a premium event"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-navy/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center px-4 pt-24 pb-16">
        <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in">
          <HiOutlineSpeakerWave className="text-teal text-3xl md:text-4xl" />
          <span className="text-teal text-sm md:text-base font-semibold uppercase tracking-[0.3em]">
            This Magic Moment
          </span>
        </div>

        <h1 className="text-white mb-6 animate-slide-up">
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none">
            {parts.line1 || 'the vibe'}
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none mt-1">
            {parts.line2 || 'the voice'}
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none mt-1">
            {parts.line3 || 'the dj'}
          </span>
          <span className="block heading-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-4 normal-case">
            {parts.scriptLine || 'your event needs'}
          </span>
        </h1>

        <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in">
          {hero.subheading ||
            'Weddings • Sweet 16s • Birthdays • Private Events • Photo Booth • Photography • Videography'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <Button to="/contact" variant="primary">
            {hero.primaryCta || 'Book Your Date'}
          </Button>
          <Button to="/contact" variant="outline">
            {hero.secondaryCta || 'Check Availability'}
          </Button>
        </div>

        <p className="mt-8 text-gray-400 text-sm animate-fade-in">
          Premium DJ & event entertainment across New Jersey & the Tri-State area
        </p>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#services"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-teal transition-colors animate-bounce"
        aria-label="Scroll to services"
      >
        <FiArrowDown className="text-2xl" />
      </a>
    </section>
  );
};

export default HeroSection;
