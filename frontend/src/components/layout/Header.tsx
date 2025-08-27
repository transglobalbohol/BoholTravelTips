import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-md relative z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
              B
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Guide to Bohol</h1>
              <p className="text-xs text-gray-500">and Beyond</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/tours"
              className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 ${
                isActive('/tours') ? 'text-blue-600' : ''
              }`}
            >
              Tours & Activities
            </Link>
            <Link
              to="/hotels"
              className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 ${
                isActive('/hotels') ? 'text-blue-600' : ''
              }`}
            >
              Hotels & Resorts
            </Link>
            <Link
              to="/car-rentals"
              className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 ${
                isActive('/car-rentals') ? 'text-blue-600' : ''
              }`}
            >
              Car Rentals
            </Link>
            <Link
              to="/destinations"
              className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 ${
                isActive('/destinations') ? 'text-blue-600' : ''
              }`}
            >
              Destinations
            </Link>
            
            {/* Travel Guides Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 flex items-center ${
                  isActive('/travel-guides') ? 'text-blue-600' : ''
                }`}
              >
                Travel Guides
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2">
                  <Link
                    to="/travel-guides/best-time-to-visit"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Best Time to Visit Bohol
                  </Link>
                  <Link
                    to="/travel-guides/attractions"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Top Attractions Guide
                  </Link>
                  <Link
                    to="/travel-guides/itinerary"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Sample Itineraries
                  </Link>
                  <Link
                    to="/travel-guides/food"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Food & Dining Guide
                  </Link>
                  <Link
                    to="/travel-guides/transportation"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Transportation Guide
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 ${
                isActive('/about') ? 'text-blue-600' : ''
              }`}
            >
              About
            </Link>
          </div>

          {/* User Menu / Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{user.name}</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
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
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
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
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
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
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-2">
              <Link
                to="/tours"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={closeMenu}
              >
                Tours & Activities
              </Link>
              <Link
                to="/hotels"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={closeMenu}
              >
                Hotels & Resorts
              </Link>
              <Link
                to="/car-rentals"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={closeMenu}
              >
                Car Rentals
              </Link>
              <Link
                to="/destinations"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={closeMenu}
              >
                Destinations
              </Link>
              <Link
                to="/travel-guides"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={closeMenu}
              >
                Travel Guides
              </Link>
              <Link
                to="/about"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                onClick={closeMenu}
              >
                About
              </Link>
              <hr className="my-2" />
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={closeMenu}
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={closeMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 bg-blue-600 text-white text-center rounded-lg font-medium"
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