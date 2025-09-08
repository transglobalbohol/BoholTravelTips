import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Culinary Heritage',
      description: 'Experience Bohol\'s signature sweets like Peanut Kisses, Calamay, and Ube Kinampay showcasing rich local flavors',
      cta: 'Food Tours'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Baclayon Church',
      description: 'A historical site where traditional heritage treats are still sold and Spanish colonial history comes alive',
      cta: 'Cultural Tours'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Baclayon Heritage Houses',
      description: 'A collection of Spanish colonial houses preserved through community-led efforts by the Bahandi Association',
      cta: 'Heritage Walking Tour'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Sandugo Festival',
      description: 'Annual celebration in Tagbilaran City commemorating the historic Blood Compact between Datu Sikatuna and Miguel López de Legazpi',
      cta: 'Festival Events'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'National Museum of the Philippines - Bohol',
      description: 'A cultural institution where visitors can explore and learn about the province\'s rich heritage and history',
      cta: 'Museum Tours'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      title: 'Loay Watchtower',
      description: 'A historic structure built for defense during the Spanish colonial era, now standing as a cultural landmark',
      cta: 'Historical Sites'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      {/* Media Slider */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {slide.type === 'video' ? (
              <div className="relative w-full h-full">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={slide.poster}
                >
                  <source src={slide.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
              </div>
            ) : (
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${slide.url}')`
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="container px-4">
          <div className="hero-content text-white text-center">
            {/* Slide-specific Content */}
            <div className="mb-8 slide-in">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                {slides[currentSlide]?.title}
              </h2>
              
              {/* Separation Line */}
              <div className="w-2/3 h-0.5 bg-white/60 mx-auto mb-6"></div>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
                {slides[currentSlide]?.description}
              </p>
              
              {/* Text-only CTA */}
              <Link 
                to="/tours" 
                className="text-white hover:text-orange-300 font-medium text-lg transition-colors duration-200 underline underline-offset-4 hover:underline-offset-8"
              >
                {slides[currentSlide]?.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-2">
          <ChevronDown className="w-6 h-6 text-white/70" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;