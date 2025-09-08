import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-modern">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white text-gray-900 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Bohol Travel Tips</h3>
                <p className="text-sm text-gray-400">Your Bohol Guide</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Bohol's largest online marketplace for travel experiences. We make it easier than ever to plan, book, and enjoy your dream vacation on this beautiful island.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/16e1meZ7pq/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="footer-link">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/tours" className="footer-link">
                  Tours & Activities
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="footer-link">
                  Hotels & Resorts
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="footer-link">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/travel-guides" className="footer-link">
                  Travel Guides
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Popular Destinations</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/destinations/chocolate-hills" className="footer-link">
                  Chocolate Hills
                </Link>
              </li>
              <li>
                <Link to="/destinations/panglao" className="footer-link">
                  Panglao Island
                </Link>
              </li>
              <li>
                <Link to="/destinations/loboc-river" className="footer-link">
                  Loboc River
                </Link>
              </li>
              <li>
                <Link to="/destinations/anda" className="footer-link">
                  Anda Beaches
                </Link>
              </li>
              <li>
                <Link to="/destinations/tagbilaran" className="footer-link">
                  Tagbilaran City
                </Link>
              </li>
              <li>
                <Link to="/destinations/tarsier" className="footer-link">
                  Tarsier Sanctuary
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Suite 526 Cityland Shaw Tower, Shaw Boulevard Ortigas Center,</p>
                  <p className="text-gray-300">Mandaluyong, Philippines</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <p className="text-gray-300">reservations@transglobaltravelandtours.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <p className="text-gray-300">+63 123 456 7890</p>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-8">
              <h5 className="font-semibold mb-4">Stay Updated</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-l-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500"
                />
                <button className="bg-white text-gray-900 px-4 py-2 rounded-r-lg font-medium hover:bg-gray-100 transition duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2025 Bohol Travel Tips. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
              <Link to="/terms" className="footer-link">
                Terms of Service
              </Link>
              <Link to="/cookies" className="footer-link">
                Cookie Policy
              </Link>
              <Link to="/sitemap" className="footer-link">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;