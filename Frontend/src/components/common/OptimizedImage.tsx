import React, { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Lazy loading image component with optimization
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = '/images/placeholder.jpg',
  sizes,
  onLoad,
  onError,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setImageError(true);
    setImageSrc(placeholder);
    onError?.();
  }, [onError, placeholder]);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !priority) {
      setImageSrc(src);
    }
  }, [src, priority]);

  // Lazy loading intersection observer
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (node && !priority && imageSrc === placeholder) {
      const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.1,
        rootMargin: '50px',
      });
      observer.observe(node);
      
      return () => observer.disconnect();
    }
  }, [handleIntersection, priority, imageSrc, placeholder]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={`
          transition-opacity duration-300 
          ${imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      )}
    </div>
  );
};

// Generate responsive image URLs
export const generateImageSizes = (basePath: string, filename: string, extension: string) => {
  const sizes = [320, 640, 768, 1024, 1280, 1600];
  return sizes.map(size => ({
    size,
    url: `${basePath}/${filename}-${size}w.${extension}`,
  }));
};

// Generate srcSet string for responsive images
export const generateSrcSet = (imageSizes: { size: number; url: string }[]) => {
  return imageSizes.map(({ size, url }) => `${url} ${size}w`).join(', ');
};

// WebP support detection
export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').startsWith('data:image/webp');
};

// Image format optimization
export const getOptimizedImageUrl = (
  originalUrl: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  // In a real implementation, you might use a service like Cloudinary or ImageKit
  // For now, we'll return the original URL with query parameters
  const url = new URL(originalUrl, window.location.origin);
  
  if (width) url.searchParams.set('w', width.toString());
  if (height) url.searchParams.set('h', height.toString());
  url.searchParams.set('q', quality.toString());
  
  // Add WebP format if supported
  if (supportsWebP()) {
    url.searchParams.set('f', 'webp');
  }
  
  return url.toString();
};

// Image preloader utility
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Bulk image preloader
export const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(preloadImage));
};

export default OptimizedImage;
