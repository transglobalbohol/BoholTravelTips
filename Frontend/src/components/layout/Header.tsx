import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Menu, X, ChevronDown, User, MapPin } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  const navigationItems = [
    { href: '/tours', label: 'Tours', fullLabel: 'Tours & Activities' },
    { href: '/hotels', label: 'Hotels', fullLabel: 'Hotels & Resorts' },
    { href: '/car-rentals', label: 'Car Rentals', fullLabel: 'Car Rentals' },
    { href: '/destinations', label: 'Destinations', fullLabel: 'Destinations' },
    { href: '/about', label: 'About', fullLabel: 'About' },
  ];

  const travelGuideItems = [
    { href: '/travel-guides/best-time-to-visit', label: 'Best Time to Visit' },
    { href: '/travel-guides/attractions', label: 'Top Attractions' },
    { href: '/travel-guides/itinerary', label: 'Sample Itineraries' },
    { href: '/travel-guides/food', label: 'Food & Dining' },
    { href: '/travel-guides/transportation', label: 'Transportation' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200" role="banner">
      <nav className="container mx-auto px-4 lg:px-6" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center py-4">
          {/* Modern Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-decoration-none flex-shrink-0 group"
            aria-label="Bohol Travel Tips - Home"
          >
            <div className="relative">
              <div className="bg-gray-900 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-sm group-hover:shadow-md transition-all duration-200">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 m-0 leading-tight">
                Bohol Travel Tips
              </h1>
              <p className="text-xs text-gray-500 font-medium m-0">Your Bohol Guide</p>
            </div>
          </Link>

          {/* Modern Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1" role="menubar">
            {navigationItems.slice(0, -1).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                role="menuitem"
                className={`nav-link px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.href) 
                    ? 'nav-link-active bg-gray-100' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {item.fullLabel}
              </Link>
            ))}
            
            {/* Modern Travel Guides Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`nav-link px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 ${
                  location.pathname.startsWith('/travel-guides') 
                    ? 'nav-link-active bg-gray-100' 
                    : 'hover:bg-gray-50'
                }`}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <span>Travel Guides</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
                    {travelGuideItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link
              to="/about"
              className={`nav-link px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/about') 
                  ? 'nav-link-active bg-gray-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              About
            </Link>
          </div>

          {/* Compact Desktop Navigation */}
          <div className="hidden lg:flex xl:hidden items-center space-x-1">
            {navigationItems.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`nav-link px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.href) ? 'nav-link-active bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="nav-link px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 hover:bg-gray-50"
              >
                <span>More</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
                    <Link to="/destinations" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
                      Destinations
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                    {travelGuideItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Modern Authentication */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                  aria-expanded={isUserDropdownOpen}
                >
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-700 hidden xl:block">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                
                {isUserDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsUserDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/bookings"
                        className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="btn-ghost px-4 py-2 text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Modern Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Modern Mobile Menu */}
        {isMenuOpen && (
          <>
            <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30" onClick={closeMenu} />
            <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-40">
              <div className="p-6 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`block py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.href) 
                        ? 'nav-link-active bg-gray-100' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={closeMenu}
                  >
                    {item.fullLabel}
                  </Link>
                ))}
                
                <div className="border-t border-gray-200 my-4"></div>
                <div className="space-y-1">
                  <div className="px-4 py-2 text-sm font-semibold text-gray-900">
                    Travel Guides
                  </div>
                  {travelGuideItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block py-3 px-6 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 my-4"></div>
                
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-100 rounded-lg">
                      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-700">{user.name}</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block py-3 px-4 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="block w-full text-left py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block py-3 px-4 text-center rounded-lg border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 font-medium transition-all duration-200"
                      onClick={closeMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block py-3 px-4 text-center rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all duration-200"
                      onClick={closeMenu}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;