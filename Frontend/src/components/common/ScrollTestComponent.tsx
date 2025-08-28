import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollToTop, scrollToElement } from '../../hooks/useScrollToTop';
import ScrollToTopButton from './ScrollToTopButton';

/**
 * Test component for scroll behavior - only for development/testing
 * Remove this from production builds
 */
const ScrollTestComponent: React.FC = () => {
  const { scrollToTop, scrollToHash } = useScrollToTop();

  return (
    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg mb-8">
      <h3 className="text-lg font-bold mb-4">🧪 Scroll Behavior Test Panel</h3>
      <p className="text-sm text-gray-600 mb-4">
        This panel helps test scroll behavior. Remove in production.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="font-medium mb-2">Manual Controls</h4>
          <div className="space-y-2">
            <button 
              onClick={() => scrollToTop(true)}
              className="btn-secondary w-full text-sm"
            >
              Scroll to Top (Smooth)
            </button>
            <button 
              onClick={() => scrollToTop(false)}
              className="btn-secondary w-full text-sm"
            >
              Scroll to Top (Instant)
            </button>
            <button 
              onClick={() => scrollToElement('footer', true, 80)}
              className="btn-secondary w-full text-sm"
            >
              Scroll to Footer
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Navigation Test</h4>
          <div className="space-y-2">
            <Link to="/tours" className="btn-secondary w-full text-sm block text-center">
              Go to Tours (Auto-scroll)
            </Link>
            <Link to="/hotels" className="btn-secondary w-full text-sm block text-center">
              Go to Hotels (Auto-scroll)
            </Link>
            <Link to="/bookings" className="btn-secondary w-full text-sm block text-center">
              Go to Bookings (Auto-scroll)
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Scroll Status</h4>
          <div className="text-sm space-y-1">
            <p>Current scroll: <span id="scroll-position">0px</span></p>
            <p>Page height: <span id="page-height">0px</span></p>
            <p>Viewport height: <span id="viewport-height">0px</span></p>
          </div>
        </div>
      </div>

      {/* Long content to enable scrolling */}
      <div className="mt-8 p-4 bg-white rounded border">
        <p className="text-sm text-gray-500">
          Scroll down to test the floating scroll button and navigation behavior...
        </p>
        {[...Array(20)].map((_, i) => (
          <p key={i} className="mb-4 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Line {i + 1} of test content.
          </p>
        ))}
      </div>

      <script>{`
        // Update scroll position display
        const updateScrollInfo = () => {
          const scrollPos = document.getElementById('scroll-position');
          const pageHeight = document.getElementById('page-height');
          const viewportHeight = document.getElementById('viewport-height');
          
          if (scrollPos) scrollPos.textContent = Math.round(window.pageYOffset) + 'px';
          if (pageHeight) pageHeight.textContent = document.documentElement.scrollHeight + 'px';
          if (viewportHeight) viewportHeight.textContent = window.innerHeight + 'px';
        };

        window.addEventListener('scroll', updateScrollInfo, { passive: true });
        window.addEventListener('resize', updateScrollInfo);
        updateScrollInfo();
      `}</script>
    </div>
  );
};

export default ScrollTestComponent;