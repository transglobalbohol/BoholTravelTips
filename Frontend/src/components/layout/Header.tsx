import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Home, Menu, X, ChevronDown, User } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Navigation items for SEO and structure
  const navigationItems = [
    { href: '/tours', label: 'Tours & Activities', description: 'Explore Bohol tours and activities' },
    { href: '/hotels', label: 'Hotels & Resorts', description: 'Find the best hotels in Bohol' },
    { href: '/car-rentals', label: 'Car Rentals', description: 'Rent a car for your Bohol trip' },
    { href: '/destinations', label: 'Destinations', description: 'Popular Bohol destinations' },
    { href: '/about', label: 'About', description: 'Learn about Bohol Travel Tips' },
  ];

  const travelGuideItems = [
    { href: '/travel-guides/best-time-to-visit', label: 'Best Time to Visit Bohol' },
    { href: '/travel-guides/attractions', label: 'Top Attractions Guide' },
    { href: '/travel-guides/itinerary', label: 'Sample Itineraries' },
    { href: '/travel-guides/food', label: 'Food & Dining Guide' },
    { href: '/travel-guides/transportation', label: 'Transportation Guide' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50" role="banner">
      <nav className="container mx-auto px-4" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center py-4">
          {/* Logo - SEO optimized */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-decoration-none"
            aria-label="Bohol Travel Tips - Home"
          >
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
              B
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 m-0">Bohol Travel Tips</h1>
              <p className="text-xs text-gray-500 m-0">Ultimate Bohol Guide</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6" role="menubar">
            {navigationItems.slice(0, -1).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                role="menuitem"
                className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 px-3 py-2 rounded-md ${
                  isActive(item.href) ? 'text-blue-600 bg-blue-50' : ''
                }`}
                title={item.description}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Travel Guides Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 flex items-center px-3 py-2 rounded-md ${
                  location.pathname.startsWith('/travel-guides') ? 'text-blue-600 bg-blue-50' : ''
                }`}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Travel Guides menu"
              >
                Travel Guides
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50"
                  role="menu"
                  aria-label="Travel guides submenu"
                >
                  {travelGuideItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      role="menuitem"
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              role="menuitem"
              className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 px-3 py-2 rounded-md ${
                isActive('/about') ? 'text-blue-600 bg-blue-50' : ''
              }`}
              title="Learn about Bohol Travel Tips"
            >
              About
            </Link>
          </div>

          {/* User Authentication */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-label={`User menu for ${user.name}`}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-gray-700 hover:text-blue-600 p-2"
            aria-expanded={isMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="px-4 py-4 space-y-2 max-h-96 overflow-y-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block py-3 px-2 text-gray-700 hover:text-blue-600 font-medium transition duration-200 ${
                    isActive(item.href) ? 'text-blue-600 bg-blue-50' : ''
                  }`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Travel Guides */}
              <div className="border-t pt-2 mt-2">
                <div className="font-medium text-gray-900 py-2 px-2">Travel Guides</div>
                {travelGuideItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block py-2 px-4 text-gray-600 hover:text-blue-600 transition duration-200"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              <hr className="my-4" />
              
              {/* Mobile Authentication */}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block py-3 px-2 text-gray-700 hover:text-blue-600 font-medium transition duration-200"
                    onClick={closeMenu}
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="block w-full text-left py-3 px-2 text-gray-700 hover:text-blue-600 font-medium transition duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-3 px-2 text-gray-700 hover:text-blue-600 font-medium transition duration-200"
                    onClick={closeMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block py-3 px-2 bg-blue-600 text-white text-center rounded-lg font-medium transition duration-200 mt-2"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
