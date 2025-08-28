import React from 'react';
import { Star, Quote, CheckCircle, Shield, Phone, Award } from 'lucide-react';

const CustomerTestimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Maria Santos',
      location: 'Manila, Philippines',
      rating: 5,
      text: 'It was simply the best decision we ever made to set up our travel plans with Bohol Travel Tips. I highly recommend it especially because of their attention to details, high organization, professionalism, prompt responsiveness, and very friendly staff.',
      tour: 'Chocolate Hills & Tarsier Tour',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'John Anderson',
      location: 'Sydney, Australia',
      rating: 5,
      text: 'Right from the start, the staff at Bohol Travel Tips provided a great service. Everything was perfect. The organization went smoothly. A big compliment especially to the team with whom I wrote many emails. Highly recommend this agency!',
      tour: 'Panglao Island Hopping',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      location: 'Barcelona, Spain',
      rating: 5,
      text: 'What an incredible experience! Very well served by Bohol Travel Tips! They planned a personalized itinerary just as we wished. They took very good care of us and made sure that everything went well. Thank you for making our trip one to remember!',
      tour: 'Bohol Countryside Tour',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-heading-2 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-subheading max-w-2xl mx-auto">
            Don't just take our word for it - see what our satisfied customers have to say about their Bohol experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card p-6 hover:shadow-lg transition-shadow duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="w-8 h-8 text-gray-400" />
              </div>

              {/* Rating Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-body mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-small text-gray-500">{testimonial.location}</p>
                  <p className="text-small text-blue-600 font-medium">{testimonial.tour}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-heading-3 text-xl mb-2">Trusted by Thousands of Travelers</h3>
            <p className="text-body text-gray-600">Your peace of mind is our priority</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-600 font-medium">DOT Accredited</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600 font-medium">Verified Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-gray-600 font-medium">Secure Booking</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-orange-600" />
              <span className="text-gray-600 font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;