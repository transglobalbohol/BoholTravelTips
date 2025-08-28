import React from 'react';
import { CheckCircle, DollarSign, Heart, Shield } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Widest Selection of Travel Products',
      description: 'Choose from thousands of top-rated tours in Bohol, expertly planned vacation bundles, and unique local experiences you won\'t find anywhere else.',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Best Value, Always',
      description: 'Get competitive prices across the widest range of activities, accommodations, and transport services—no hidden fees, no surprises.',
      color: 'text-green-600 bg-green-50'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Excellent Customer Service',
      description: 'Our local team is here for you every step of the way—from pre-booking questions to on-the-ground support during your trip.',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trusted and Accredited',
      description: 'Bohol Travel Tips is a registered travel agency, accredited by the Department of Tourism and backed by rave reviews from satisfied customers.',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-heading-2 mb-4">
            Why Choose Bohol Travel Tips?
          </h2>
          <p className="text-subheading max-w-2xl mx-auto">
            As Bohol's largest travel marketplace, we're committed to delivering exceptional travel experiences and customer service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card text-center p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`${feature.color} rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6`}>
                {feature.icon}
              </div>
              
              <h3 className="text-heading-3 text-xl mb-4">
                {feature.title}
              </h3>
              
              <p className="text-body">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 card p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">1,500+</div>
              <div className="text-gray-600">Tours & Activities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;