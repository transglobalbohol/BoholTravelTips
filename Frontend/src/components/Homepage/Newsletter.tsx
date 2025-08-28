import React, { useState } from 'react';
import { CheckCircle, Mail, Gift, BookOpen, Users } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }, 1000);
  };

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-8 md:p-12 bg-gradient-to-br from-gray-50 to-white">
            <h2 className="text-heading-2 mb-4">
              Stay Updated with Bohol Travel Tips
            </h2>
            <p className="text-subheading mb-8 max-w-2xl mx-auto">
              Get the latest travel guides, exclusive deals, and insider tips for your Bohol adventure delivered straight to your inbox.
            </p>

            {isSubscribed ? (
              <div className="card bg-green-50 border-green-200 p-6 mb-6 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Successfully subscribed!</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="input flex-1 rounded-r-none border-r-0 focus:border-r focus:z-10"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary rounded-l-none px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Subscribing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Subscribe</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Exclusive Deals</h3>
                  <p className="text-body text-sm">Get access to subscriber-only discounts and early bird offers.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Travel Guides</h3>
                  <p className="text-body text-sm">Receive comprehensive guides and itineraries for Bohol.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Insider Tips</h3>
                  <p className="text-body text-sm">Local insights and hidden gems from our Bohol experts.</p>
                </div>
              </div>
            </div>

            <p className="text-small text-gray-500 mt-6">
              We respect your privacy. Unsubscribe at any time. No spam, just awesome Bohol content!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;