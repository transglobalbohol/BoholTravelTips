import { useState, useEffect } from 'react';
import { optimizeImageUrl, ImageOptimizationOptions } from '../utils/imageOptimization';

/**
 * React hook for optimized image loading with performance benefits
 */
export function useOptimizedImage(
  src: string, 
  options?: ImageOptimizationOptions
) {
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const optimized = optimizeImageUrl(src, options);
    
    const img = new Image();
    img.onload = () => {
      setOptimizedSrc(optimized);
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    img.src = optimized;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, options]);

  return { 
    src: optimizedSrc, 
    isLoading, 
    hasError,
    // Convenience method to reset the image
    reload: () => {
      setIsLoading(true);
      setHasError(false);
      setOptimizedSrc('');
    }
  };
}