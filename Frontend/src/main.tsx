import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Performance optimization: Preload critical resources
const preloadCriticalResources = () => {
  // Preload critical images that actually exist
  const criticalImages = [
    '/images/boholLandingPage.webp'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onerror = () => console.warn(`Failed to preload image: ${src}`);
  });

  // Preload critical fonts
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
  link.as = 'style';
  link.onload = function() { (this as any).rel = 'stylesheet'; };
  document.head.appendChild(link);
};

// Performance optimization: Initialize app with micro-task scheduling
const initializeApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  // Performance: Create root with concurrent features
  const root = createRoot(rootElement, {
    // Enable concurrent features for better performance
    onRecoverableError: (error) => {
      console.error('Recoverable React error:', error);
    },
  });

  // Performance: Use time slicing for rendering
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

// Performance: Optimize initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    preloadCriticalResources();
    initializeApp();
  });
} else {
  // Document already loaded
  preloadCriticalResources();
  initializeApp();
}

// Performance monitoring
if (typeof window !== 'undefined') {
  // Monitor initial load performance
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      // Performance metrics calculated but not logged
      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        fullyLoaded: navigation.loadEventEnd - navigation.navigationStart,
        firstPaint: 0,
        firstContentfulPaint: 0
      };

      // Get paint metrics if available
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-paint') {
          metrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime;
        }
      });
      
      // Report to analytics if available (no console logging)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'performance_metrics', metrics);
      }
    }
  });
}
