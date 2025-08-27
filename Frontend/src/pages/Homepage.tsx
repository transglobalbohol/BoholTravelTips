import React from 'react';
import { SEOHead } from '../hooks/useSEO';
import { useStructuredData, generateBreadcrumbStructuredData, generateFAQStructuredData } from '../utils/structuredData';

// Components
import HeroSection from '../components/Homepage/HeroSection';
import FeaturedTours from '../components/Homepage/FeaturedTours';
import PopularDestinations from '../components/Homepage/PopularDestinations';
import TravelGuides from '../components/Homepage/TravelGuides';
import WhyChooseUs from '../components/Homepage/WhyChooseUs';
import CustomerTestimonials from '../components/Homepage/CustomerTestimonials';
import Newsletter from '../components/Homepage/Newsletter';

const Homepage: React.FC = () => {
  // FAQ data for structured markup
  const faqData = [
    {
      question: "What are the top attractions in Bohol?",
      answer: "Bohol's top attractions include the famous Chocolate Hills, Panglao Island beaches, Loboc River cruise, Philippine Tarsier Sanctuary, and Baclayon Church. Our tours cover all these iconic destinations."
    },
    {
      question: "When is the best time to visit Bohol?",
      answer: "The best time to visit Bohol is during the dry season from December to May. The weather is perfect for outdoor activities, island hopping, and exploring attractions."
    },
    {
      question: "How do I get to Bohol?",
      answer: "You can reach Bohol by flying to Tagbilaran Airport or taking a ferry from Cebu. We provide detailed transportation guides and can help arrange transfers."
    },
    {
      question: "What tours do you offer in Bohol?",
      answer: "We offer various tours including Chocolate Hills day trips, island hopping adventures, cultural tours, adventure activities, and multi-day packages covering all of Bohol's highlights."
    }
  ];

  // Inject FAQ structured data
  useStructuredData(generateFAQStructuredData(faqData));

  return (
    <>
      {/* SEO Head Component */}
      <SEOHead
        title="Ultimate Guide to Bohol Philippines - Tours, Hotels & Attractions"
        description="Discover Bohol Philippines with our comprehensive travel guide. Book tours to Chocolate Hills, Panglao Island, hotels, and activities. Your gateway to Bohol paradise."
        keywords="Bohol Philippines, Chocolate Hills, Panglao Island, Bohol tours, Philippines travel, Bohol hotels, island hopping, tarsier sanctuary, Loboc river"
        url="/"
        image="/images/bohol-hero-og.jpg"
        type="website"
      />

      <div className="homepage">
        {/* Hero Section with Search - H1 should be in HeroSection */}
        <HeroSection />
        
        {/* Key Features Section */}
        <section className="py-16 bg-gray-50" aria-labelledby="features-heading">
          <div className="container mx-auto px-4">
            <header className="text-center mb-12">
              <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Bohol Travel Tips?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your trusted guide to exploring the best of Bohol, Philippines
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <article className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" role="img" aria-label="Adventure discovery icon">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5M6 20.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Discover Adventures</h3>
                <p className="text-gray-600">Experience all the amazing adventures Bohol has to offer, from Chocolate Hills to pristine beaches</p>
              </article>

              <article className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" role="img" aria-label="Optimized itinerary icon">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Optimized Itineraries</h3>
                <p className="text-gray-600">Book carefully planned itineraries for a perfect vacation in Bohol with maximum experiences</p>
              </article>

              <article className="text-center">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" role="img" aria-label="Best tours icon">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Best Tours & Tickets</h3>
                <p className="text-gray-600">Find all the best tours, tickets, and experiences in Bohol at competitive prices</p>
              </article>

              <article className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" role="img" aria-label="Best places icon">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Amazing Destinations</h3>
                <p className="text-gray-600">Discover all the best places you can visit in Bohol with insider local knowledge</p>
              </article>
            </div>
          </div>
        </section>

        {/* Featured Tours Section */}
        <FeaturedTours />
        
        {/* Popular Destinations */}
        <PopularDestinations />
        
        {/* Travel Guides Preview */}
        <TravelGuides />
        
        {/* Why Choose Us */}
        <WhyChooseUs />
        
        {/* Customer Testimonials */}
        <CustomerTestimonials />

        {/* FAQ Section for SEO */}
        <section className="py-16 bg-white" aria-labelledby="faq-heading">
          <div className="container mx-auto px-4">
            <header className="text-center mb-12">
              <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions About Bohol
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about traveling to Bohol, Philippines
              </p>
            </header>

            <div className="max-w-4xl mx-auto">
              <dl className="space-y-8">
                {faqData.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-8">
                    <dt className="text-xl font-semibold text-gray-900 mb-4">
                      {faq.question}
                    </dt>
                    <dd className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
        
        {/* Newsletter Signup */}
        <Newsletter />
      </div>
    </>
  );
};

export default Homepage;
