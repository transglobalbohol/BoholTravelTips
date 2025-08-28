import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { initializePerformanceMonitoring } from './utils/performance';
import { lazyWithRetry } from './utils/performance';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollToTopButton from './components/common/ScrollToTopButton';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
  </div>
);

// Lazy load pages for better performance
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
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const About = lazyWithRetry(() => import('./pages/About'));
const Contact = lazyWithRetry(() => import('./pages/Contact'));

// Import global styles
import './index.css';

function App(): JSX.Element {
  useEffect(() => {
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Preload critical resources
    if (typeof window !== 'undefined') {
      // Preload important images
      const criticalImages = [
        '/images/hero-bohol.jpg',
        '/images/chocolate-hills.jpg',
        '/images/panglao-island.jpg'
      ];
      
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    }
  }, []);

  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          {/* Automatically scroll to top on route changes */}
          <ScrollToTop 
            smooth={true}
            preserveOnBack={false}
            excludeRoutes={[]} // Add routes here if needed: ['/travel-guides']
            delay={0}
          />
          
          <div className="App min-h-screen flex flex-col bg-gray-50">
            <Header />
            
            <main className="flex-grow header-spacing" role="main">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Homepage />} />
                  <Route path="/tours" element={<Tours />} />
                  <Route path="/tours/:id" element={<TourDetails />} />
                  <Route path="/hotels" element={<Hotels />} />
                  <Route path="/hotels/:id" element={<HotelDetails />} />
                  <Route path="/car-rentals" element={<CarRentals />} />
                  <Route path="/destinations" element={<Destinations />} />
                  <Route path="/travel-guides/*" element={<TravelGuides />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={
                    <div className="container py-16 text-center">
                      <h1 className="text-heading-2 mb-4">404 - Page Not Found</h1>
                      <p className="text-subheading mb-8">
                        The page you're looking for doesn't exist.
                      </p>
                      <a 
                        href="/" 
                        className="btn-primary"
                      >
                        Return to Homepage
                      </a>
                    </div>
                  } />
                </Routes>
              </Suspense>
            </main>
            
            <Footer />
          </div>
          
          {/* Floating scroll to top button */}
          <ScrollToTopButton />
          
          {/* Toast Notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1f2937',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                duration: 4000,
                iconTheme: {
                  primary: '#059669',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;