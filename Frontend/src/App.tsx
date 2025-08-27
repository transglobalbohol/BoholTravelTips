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

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <div className="App min-h-screen flex flex-col bg-white">
            <Header />
            
            <main className="flex-grow" role="main">
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
                    <div className="container mx-auto px-4 py-16 text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                      <p className="text-lg text-gray-600 mb-8">
                        The page you're looking for doesn't exist.
                      </p>
                      <a 
                        href="/" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
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
          
          {/* Toast Notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#363636',
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              },
              success: {
                duration: 4000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
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
