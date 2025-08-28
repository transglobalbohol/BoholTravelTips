/**
 * Image optimization utilities for faster loading
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  blur?: number;
}

/**
 * Optimizes image URLs for faster loading
 * Currently supports Unsplash URLs - can be extended for other services
 */
export function optimizeImageUrl(
  url: string, 
  options: ImageOptimizationOptions = {}
): string {
  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    blur
  } = options;

  try {
    // Handle Unsplash images
    if (url.includes('unsplash.com')) {
      const urlObj = new URL(url);
      
      // Add optimization parameters
      if (width) urlObj.searchParams.set('w', width.toString());
      if (height) urlObj.searchParams.set('h', height.toString());
      if (quality !== 80) urlObj.searchParams.set('q', quality.toString());
      if (format !== 'auto') urlObj.searchParams.set('fm', format);
      if (blur) urlObj.searchParams.set('blur', blur.toString());
      
      // Always add these for better performance
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'crop');
      urlObj.searchParams.set('ixlib', 'rb-4.0.3');
      
      return urlObj.toString();
    }

    // Return original URL if no optimization available
    return url;
  } catch (error) {
    console.warn('Failed to optimize image URL:', error);
    return url;
  }
}

/**
 * Preloads critical images for faster rendering
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  const promises = urls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  });

  return Promise.all(promises);
}

/**
 * Lazy load images with Intersection Observer
 */
export function setupLazyLoading(
  selector: string = 'img[data-src]'
): () => void {
  const images = document.querySelectorAll(selector);
  
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    images.forEach((img) => {
      if (img instanceof HTMLImageElement && img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
    return () => {};
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = optimizeImageUrl(img.dataset.src, {
            width: img.width || undefined,
            height: img.height || undefined
          });
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));

  // Return cleanup function
  return () => imageObserver.disconnect();
}

/**
 * Get optimized image srcset for responsive images
 */
export function getResponsiveSrcSet(
  baseUrl: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1600]
): string {
  return sizes
    .map(size => {
      const optimizedUrl = optimizeImageUrl(baseUrl, { width: size });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Common image sizes for consistent optimization
 */
export const ImageSizes = {
  // Thumbnails
  THUMB_SMALL: { width: 80, height: 80 },
  THUMB_MEDIUM: { width: 120, height: 120 },
  THUMB_LARGE: { width: 200, height: 200 },
  
  // Cards
  CARD_SMALL: { width: 300, height: 200 },
  CARD_MEDIUM: { width: 400, height: 300 },
  CARD_LARGE: { width: 600, height: 400 },
  
  // Hero/Featured
  HERO_MOBILE: { width: 768, height: 400 },
  HERO_DESKTOP: { width: 1200, height: 600 },
  
  // Gallery
  GALLERY_THUMB: { width: 150, height: 150 },
  GALLERY_FULL: { width: 800, height: 600 }
} as const;

// React hook is available in a separate file: hooks/useOptimizedImage.ts
// This keeps the utility functions pure and framework-agnostic