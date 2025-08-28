import React from 'react';
import { ChevronUp } from 'lucide-react';
import { useScrollToTopButton } from '../../hooks/useScrollToTop';

interface ScrollToTopButtonProps {
  className?: string;
  showAfter?: number;
  smooth?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

/**
 * Floating scroll-to-top button that appears when user scrolls down
 * Provides users with manual control over scrolling to top
 */
const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  className = '',
  showAfter = 300,
  smooth = true,
  position = 'bottom-right'
}) => {
  const { isVisible, scrollToTop } = useScrollToTopButton();

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  };

  const handleClick = () => {
    if (smooth) {
      scrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className={`
        fixed ${positionClasses[position]} z-50
        bg-gray-900 hover:bg-gray-800 text-white
        w-12 h-12 rounded-full shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:scale-110 focus:scale-110
        focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2
        ${className}
      `}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTopButton;