import { useEffect, useRef, useCallback, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export interface ScrollToTopOptions {
  smooth?: boolean;
  preserveOnBack?: boolean;
  excludeRoutes?: string[];
  delay?: number;
}

const defaultOptions: ScrollToTopOptions = {
  smooth: true,
  preserveOnBack: true,
  excludeRoutes: [],
  delay: 0
};

/**
 * Enhanced hook for managing scroll-to-top behavior with more control options
 */
export function useScrollToTop(options: ScrollToTopOptions = {}) {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const prevPathname = useRef<string>('');
  const config = { ...defaultOptions, ...options };

  const scrollToTop = useCallback((smooth: boolean = true) => {
    const scrollOptions: ScrollToOptions = {
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'auto'
    };

    if (config.delay && config.delay > 0) {
      setTimeout(() => {
        window.scrollTo(scrollOptions);
      }, config.delay);
    } else {
      window.scrollTo(scrollOptions);
    }
  }, [config.delay]);

  const scrollToHash = useCallback((hashValue: string, smooth: boolean = true) => {
    const element = document.getElementById(hashValue.substring(1));
    if (element) {
      element.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'start'
      });
    }
  }, []);

  useEffect(() => {
    // Check if route should be excluded
    if (config.excludeRoutes?.some(route => pathname.includes(route))) {
      prevPathname.current = pathname;
      return;
    }

    // Handle hash navigation (anchor links)
    if (hash) {
      // Small delay to ensure the page has loaded
      setTimeout(() => {
        scrollToHash(hash, config.smooth);
      }, 100);
      return;
    }

    // Skip scroll to top if navigating back and preserveOnBack is enabled
    if (config.preserveOnBack && navigationType === 'POP') {
      prevPathname.current = pathname;
      return;
    }

    // Only scroll if pathname actually changed
    if (prevPathname.current !== pathname) {
      scrollToTop(config.smooth);
      prevPathname.current = pathname;
    }
  }, [pathname, hash, navigationType, config, scrollToTop, scrollToHash]);

  return {
    scrollToTop,
    scrollToHash,
    pathname,
    hash
  };
}

/**
 * Utility function to scroll to a specific element by ID
 */
export function scrollToElement(
  elementId: string, 
  smooth: boolean = true,
  offset: number = 0
) {
  const element = document.getElementById(elementId);
  if (element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    window.scrollTo({
      top: rect.top + scrollTop - offset,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }
}

/**
 * Hook for smooth scrolling to top with custom trigger
 */
export function useScrollToTopButton(threshold: number = 300) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrolled > threshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    // Throttle scroll events for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial state
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [toggleVisibility]);

  return { isVisible, scrollToTop };
}