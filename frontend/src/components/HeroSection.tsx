import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides, featuredAchievement } from '../data/homePageData';

// TODO: Replace static heroSlides with GET /api/carousel-slides
// TODO: Replace static featuredAchievement with GET /api/achievements?featured=true

interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
}

/**
 * HeroSection
 * Outer section: bg-gray-50, py-6 px-4 → gives the "framed" look from the reference image.
 * Inner layout: max-w-7xl container, rounded-lg overflow-hidden, shadow.
 *
 * Two columns inside the frame (~60/40):
 *   LEFT  — image carousel (crossfade, 5 slides, dot indicators, prev/next arrows)
 *   RIGHT — achievement card (badge, title, image, body text, "Read more" link)
 *
 * On mobile the columns stack vertically (carousel first, then card).
 */
const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const total = heroSlides.length;

  const goPrev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total]
  );
  const goNext = useCallback(
    () => setCurrent((c) => (c + 1) % total),
    [total]
  );

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const slide = (heroSlides as HeroSlide[])[current];

  return (
    <section
      className="bg-gray-50 py-8 px-4 md:px-8"
      aria-label="Featured event and achievement"
    >
      {/* ── Framed card container ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto rounded-xl overflow-hidden shadow-md flex flex-col lg:flex-row">

        {/* ── LEFT: Carousel ─────────────────────────────────────── */}
        <div
          className="relative lg:w-3/5 w-full overflow-hidden"
          style={{ minHeight: '320px' }}
          aria-label="Event carousel"
          aria-roledescription="carousel"
        >
          {/* Slide images with crossfade */}
          {(heroSlides as HeroSlide[]).map((s, i: number) => (
            <img
              key={s.id}
              src={s.imageUrl}
              alt={s.imageAlt}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${i === current ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
              aria-hidden={i !== current}
            />
          ))}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 pointer-events-none" />

          {/* Badge top-left */}
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-ieee-teal text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              {slide.badge}
            </span>
          </div>

          {/* Title + subtitle — bottom left */}
          <div className="absolute bottom-14 left-4 right-14 z-10">
            <h1 className="text-white text-3xl font-bold leading-tight mb-2">
              {slide.title}
            </h1>
            <p className="text-white/80 text-sm leading-relaxed">
              {slide.subtitle}
            </p>
          </div>

          {/* Dot indicators */}
          <div
            className="absolute bottom-4 left-4 flex items-center gap-2 z-10"
            role="tablist"
            aria-label="Carousel slide indicators"
          >
            {(heroSlides as HeroSlide[]).map((_, i: number) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current
                    ? 'w-6 bg-ieee-teal shadow-[0_0_8px_rgba(0,178,169,0.8)]'
                    : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
              />
            ))}
          </div>

          {/* Prev arrow */}
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/25 hover:bg-white/40 border border-white/30 flex items-center justify-center text-white transition-colors duration-150"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>

          {/* Next arrow */}
          <button
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/25 hover:bg-white/40 border border-white/30 flex items-center justify-center text-white transition-colors duration-150"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        {/* ── RIGHT: Achievement card ──────────────────────────── */}
        <div
          className="lg:w-2/5 w-full bg-gradient-to-b from-white to-gray-50/50 p-6 flex flex-col border-l border-gray-100 relative group"
          aria-label="Featured achievement"
        >
          {/* Subtle top border glow for the group card */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ieee-teal to-ieee-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge */}
          <span className="self-start text-xs font-semibold text-ieee-teal bg-ieee-light px-3 py-1 rounded uppercase tracking-widest mb-3">
            {featuredAchievement.badge}
          </span>

          {/* Heading */}
          <h2 className="text-xl font-bold text-gray-900 mb-4 leading-snug">
            {featuredAchievement.title}
          </h2>

          {/* Image Container with Zoom */}
          <div className="w-full h-40 overflow-hidden rounded-md mb-4">
            <img
              src={featuredAchievement.imageUrl}
              alt={featuredAchievement.imageAlt}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="eager"
            />
          </div>

          {/* Body text */}
          <p className="text-sm text-gray-600 leading-relaxed flex-1">
            {featuredAchievement.body}
          </p>

          {/* Read more with moving arrow */}
          <a
            href={featuredAchievement.linkHref}
            className="mt-4 text-sm text-ieee-blue hover:text-ieee-dark font-semibold inline-flex items-center gap-1 group/link cursor-pointer"
            aria-label="Read more about this achievement"
          >
            <span>Learn about our journey</span>
            <span className="transform transition-transform duration-200 group-hover/link:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
