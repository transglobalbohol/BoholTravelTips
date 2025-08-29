import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { initializePerformanceMonitoring, preloadComponent } from './utils/performance';
import { lazyWithRetry } from './utils/performance';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollToTopButton from './components/common/ScrollToTopButton';

// Optimized loading component with better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-pulse"></div>
    </div>
  </div>
);

// Performance: Lazy load pages with retry mechanism and preloading
const Homepage = lazyWithRetry(() => import('./pages/Homepage'));
const Tours = lazyWithRetry(() => import('./pages/Tours'));
const TourDetails = lazyWithRetry(() => import('./pages/TourDetails'));
const Hotels = lazyWithRetry(() => import('./pages/Hotels'));
const HotelDetails = lazyWithRetry(() => import('./pages/HotelDetails'));
const CarRentals = lazyWithRetry(() => import('./pages/CarRentals'));
const Destinations = lazyWithRetry(() => import('./pages/Destinations'));
const TravelGuides = lazyWithRetry(() => import('./pages/TravelGuides'));
const BookingConfirmation = lazyWithRetry(() => import('./pages/BookingConfirmation'));
const Login = lazyWithRetry(() => import('./pages/auth/Login'));
const Register = lazyWithRetry(() => import('./pages/auth/Register'));
const ForgotPassword = lazyWithRetry(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazyWithRetry(() => import('./pages/auth/ResetPassword'));
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const About = lazyWithRetry(() => import('./pages/About'));
const Contact = lazyWithRetry(() => import('./pages/Contact'));

// Import global styles
import './index.css';

function App(): JSX.Element {
  useEffect(() => {
    // Performance: Initialize monitoring early
    initializePerformanceMonitoring();
    
    // Performance: Preload critical resources
    if (typeof window !== 'undefined') {
      // Preload high-priority images with better error handling
      const criticalImages = [
        '/images/boholLandingPage.webp'
      ];
      
      criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onerror = () => console.warn(`Failed to preload image: ${src}`);
      });

      // Performance: Preload likely next pages based on current route
      const currentPath = window.location.pathname;
      
      // Preload components based on user journey patterns
      if (currentPath === '/') {
        // Homepage users likely go to tours or hotels
        setTimeout(() => {
          preloadComponent('tours', () => import('./pages/Tours'));
          preloadComponent('hotels', () => import('./pages/Hotels'));
        }, 2000);
      } else if (currentPath.startsWith('/tours')) {
        // Tour page users likely go to booking
        setTimeout(() => {
          preloadComponent('booking', () => import('./pages/BookingConfirmation'));
        }, 3000);
      } else if (currentPath.startsWith('/hotels')) {
        // Hotel page users might check tours or book
        setTimeout(() => {
          preloadComponent('tours', () => import('./pages/Tours'));
          preloadComponent('booking', () => import('./pages/BookingConfirmation'));
        }, 3000);
      }

      // Performance: Preload auth pages if user shows intent to login
      let mouseLeaveCount = 0;
      const handleMouseLeave = () => {
        mouseLeaveCount++;
        if (mouseLeaveCount === 2) {
          // User might be leaving, preload auth pages
          preloadComponent('login', () => import('./pages/auth/Login'));
          document.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
      
      document.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup
      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          {/* Performance: Optimized scroll restoration */}
          <ScrollToTop 
            smooth={true}
            preserveOnBack={true}
            excludeRoutes={['/travel-guides']}
            delay={0}
          />
          
          <div className="App min-h-screen flex flex-col bg-gray-50">
            <Header />
            
            <main className="flex-grow header-spacing" role="main">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public Routes - Ordered by likely access frequency */}
                  <Route path="/" element={<Homepage />} />
                  <Route path="/tours" element={<Tours />} />
                  <Route path="/tours/:id" element={<TourDetails />} />
                  <Route path="/hotels" element={<Hotels />} />
                  <Route path="/hotels/:id" element={<HotelDetails />} />
                  <Route path="/destinations" element={<Destinations />} />
                  <Route path="/travel-guides/*" element={<TravelGuides />} />
                  <Route path="/car-rentals" element={<CarRentals />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
                  
                  {/* Performance: Optimized 404 Route */}
                  <Route path="*" element={
                    <div className="container py-16 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="text-6xl mb-4">🏝️</div>
                        <h1 className="text-heading-2 mb-4">404 - Page Not Found</h1>
                        <p className="text-subheading mb-8">
                          Looks like you've wandered off the beaten path in Bohol!
                        </p>
                        <a 
                          href="/" 
                          className="btn-primary inline-flex items-center gap-2"
                        >
                          <span>🏠</span>
                          Return to Homepage
                        </a>
                      </div>
                    </div>
                  } />
                </Routes>
              </Suspense>
            </main>
            
            <Footer />
          </div>
          
          {/* Floating scroll to top button */}
          <ScrollToTopButton />
          
          {/* Performance: Optimized Toast Notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000, // Reduced from 4000ms for better UX
              style: {
                background: '#fff',
                color: '#1f2937',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                fontWeight: '500',
                maxWidth: '400px',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#059669',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000, // Keep errors visible longer
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#fff',
                },
              },
              loading: {
                duration: Infinity,
                iconTheme: {
                  primary: '#3b82f6',
                  secondary: '#fff',
                },
              }
            }}
            // Performance: Limit concurrent toasts
            containerStyle={{
              zIndex: 9999
            }}
            gutter={8}
          />
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
