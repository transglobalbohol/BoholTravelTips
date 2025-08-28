import React from 'react';
import { MapPin, CheckCircle, Heart, Users, Award, Clock } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { number: '50,000+', label: 'Happy Customers', icon: <Users className="w-6 h-6" /> },
    { number: '1,500+', label: 'Tours & Activities', icon: <MapPin className="w-6 h-6" /> },
    { number: '4.8/5', label: 'Average Rating', icon: <Award className="w-6 h-6" /> },
    { number: '24/7', label: 'Customer Support', icon: <Clock className="w-6 h-6" /> }
  ];

  const values = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Local Expertise',
      description: 'Born and raised in Bohol, we know every corner of our beautiful island and share authentic local experiences.',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Trusted Partners',
      description: 'We work only with licensed, verified local operators and accommodations to ensure quality and safety.',
      color: 'text-green-600 bg-green-50'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We provide personalized service and support throughout your journey.',
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  const teamMembers = [
    {
      name: 'Maria Elena Santos',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      bio: 'A Bohol native passionate about showcasing the beauty of her homeland to the world.'
    },
    {
      name: 'Carlos Rodriguez',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      bio: 'Former tour guide turned operations expert, ensuring seamless travel experiences.'
    },
    {
      name: 'Ana Marie Dela Cruz',
      role: 'Customer Experience Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      bio: 'Dedicated to making every customer interaction exceptional and memorable.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container py-8">
          <h1 className="text-heading-1 mb-4">
            About Bohol Travel Tips
          </h1>
          <p className="text-subheading max-w-2xl">
            We're passionate about making your Bohol experience unforgettable through local expertise and personalized service.
          </p>
        </div>
      </div>

      <div className="container py-16">
        {/* Our Story Section */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-heading-2 mb-6">Our Story</h2>
              <p className="text-body mb-6">
                Bohol Travel Tips was founded with a simple mission: to make exploring 
                the beautiful island of Bohol easier and more accessible for everyone. 
                As locals who are passionate about our island, we understand what makes 
                Bohol special and want to share that with the world.
              </p>
              <p className="text-body mb-6">
                Since 2020, we've been connecting travelers with authentic local experiences, 
                from the iconic Chocolate Hills to hidden beach gems that only locals know about. 
                Our team of travel experts and local partners work together to ensure every 
                visitor has an amazing Bohol adventure.
              </p>
              <p className="text-body">
                We believe that travel should be more than just sightseeing – it should be 
                about creating meaningful connections with places and people. That's why we 
                focus on sustainable tourism practices that benefit both visitors and our local community.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Bohol Chocolate Hills"
                className="rounded-xl shadow-lg w-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="card text-center p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-gray-600">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-small text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-heading-2 mb-4">Our Values</h2>
              <p className="text-subheading max-w-2xl mx-auto">
                These core principles guide everything we do and shape how we serve our customers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="card text-center p-8">
                  <div className={`${value.color} rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6`}>
                    {value.icon}
                  </div>
                  <h3 className="text-heading-3 text-xl mb-4">{value.title}</h3>
                  <p className="text-body">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-heading-2 mb-4">Meet Our Team</h2>
              <p className="text-subheading max-w-2xl mx-auto">
                The passionate people behind Bohol Travel Tips, dedicated to making your trip extraordinary
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="card text-center p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    loading="lazy"
                  />
                  <h3 className="text-heading-3 text-lg mb-1">{member.name}</h3>
                  <p className="text-small text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-body text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Statement */}
          <div className="card p-8 md:p-12 text-center bg-gradient-to-br from-gray-50 to-white">
            <h2 className="text-heading-2 mb-4">Our Mission</h2>
            <p className="text-body-large max-w-3xl mx-auto mb-8">
              To showcase the natural beauty, rich culture, and warm hospitality of Bohol while 
              providing exceptional travel experiences that create lasting memories and support 
              our local community through sustainable tourism practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/tours" className="btn-primary">
                Explore Our Tours
              </a>
              <a href="/contact" className="btn-secondary">
                Plan Your Trip
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;