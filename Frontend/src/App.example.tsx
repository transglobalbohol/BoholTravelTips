// Example integration in your App.tsx or main component
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import SecurityMetaTags from './components/SecurityMetaTags';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <HelmetProvider>
      <SecurityMetaTags 
        title="Bohol Travel Tips - Discover Paradise Safely"
        description="Explore Bohol's beautiful destinations with our secure travel platform. Book tours, hotels, and experiences with confidence."
        apiUrl="https://api.boholtraveltips.com"
      />
      <Router>
        <AuthProvider>
          {/* Your existing app content */}
          <div className="App">
            {/* Your routes and components */}
          </div>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
