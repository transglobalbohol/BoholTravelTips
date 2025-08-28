import React from 'react';
import { useScrollToTop } from '../../hooks/useScrollToTop';

interface ScrollToTopProps {
  smooth?: boolean;
  preserveOnBack?: boolean;
  excludeRoutes?: string[];
  delay?: number;
}

/**
 * ScrollToTop component that automatically scrolls to the top of the page
 * whenever the route changes. This ensures a consistent user experience
 * where each new page starts at the top.
 */
const ScrollToTop: React.FC<ScrollToTopProps> = ({
  smooth = true,
  preserveOnBack = false, // Changed default to false for better UX
  excludeRoutes = [],
  delay = 0
}) => {
  // Use the enhanced scroll hook
  useScrollToTop({
    smooth,
    preserveOnBack,
    excludeRoutes,
    delay
  });

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;