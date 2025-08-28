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

      <div className="homepage min-h-screen">
        {/* Hero Section with Search */}
        <HeroSection />
        
        {/* Modern Key Features Section */}
        <section className="section-padding bg-gray-50" aria-labelledby="features-heading">          
          <div className="container">
            <header className="text-center mb-16">
              <h2 id="features-heading" className="text-heading-2 mb-6">
                Why Choose Bohol Travel Tips?
              </h2>
              <p className="text-subheading max-w-3xl mx-auto">
                Your trusted guide to exploring the best of Bohol, Philippines with modern convenience and local expertise
              </p>
            </header>

            <div className="feature-grid">
              {[
                {
                  title: "Discover Adventures",
                  description: "Experience all the amazing adventures Bohol has to offer, from Chocolate Hills to pristine beaches"
                },
                {
                  title: "Optimized Itineraries", 
                  description: "Book carefully planned itineraries for a perfect vacation in Bohol with maximum experiences"
                },
                {
                  title: "Best Tours & Tickets",
                  description: "Find all the best tours, tickets, and experiences in Bohol at competitive prices"
                },
                {
                  title: "Amazing Destinations",
                  description: "Discover all the best places you can visit in Bohol with insider local knowledge"
                }
              ].map((feature, index) => (
                <article 
                  key={index} 
                  className="feature-card fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="feature-icon">
                    <div className="w-6 h-6 bg-gray-900 rounded" />
                  </div>
                  <h3 className="text-heading-3 text-xl mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-body">
                    {feature.description}
                  </p>
                </article>
              ))}
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

        {/* Modern FAQ Section */}
        <section className="section-padding bg-gray-50" aria-labelledby="faq-heading">
          <div className="container">
            <header className="text-center mb-16">
              <h2 id="faq-heading" className="text-heading-2 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-subheading max-w-3xl mx-auto">
                Everything you need to know about traveling to Bohol, Philippines
              </p>
            </header>

            <div className="max-w-4xl mx-auto">
              <dl className="space-y-8">
                {faqData.map((faq, index) => (
                  <div 
                    key={index} 
                    className="card p-8 fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <dt className="text-heading-3 text-xl mb-4 flex items-start">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded-lg font-bold text-sm mr-4 mt-1 flex-shrink-0">
                        Q
                      </span>
                      {faq.question}
                    </dt>
                    <dd className="text-body ml-12">
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