import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Homepage from './pages/Homepage';
import Tours from './pages/Tours';
import TourDetails from './pages/TourDetails';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import CarRentals from './pages/CarRentals';
import Destinations from './pages/Destinations';
import TravelGuides from './pages/TravelGuides';
import BookingConfirmation from './pages/BookingConfirmation';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';

// Import global styles
import './index.css';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/tours" element={<Tours />} />
                <Route path="/tours/:id" element={<TourDetails />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/hotels/:id" element={<HotelDetails />} />
                <Route path="/car-rentals" element={<CarRentals />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/travel-guides" element={<TravelGuides />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
              </Routes>
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
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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