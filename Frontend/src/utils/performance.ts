import { lazy, ComponentType } from 'react';

// Lazy loading with retry mechanism
export const lazyWithRetry = <T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) => {
  return lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );
    
    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload() as never;
      }
      throw error;
    }
  });
};

// Performance monitoring utilities
export class PerformanceMonitor {
  private static observers: PerformanceObserver[] = [];

  // Monitor Core Web Vitals
  static observeWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      console.log('LCP:', lastEntry.startTime);
      
      // Send to analytics
      this.sendToAnalytics('LCP', lastEntry.startTime);
    });
    
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
        this.sendToAnalytics('FID', entry.processingStart - entry.startTime);
      });
    });
    
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.push(fidObserver);

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      console.log('CLS:', clsValue);
      this.sendToAnalytics('CLS', clsValue);
    });
    
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);
  }

  // Monitor navigation timing
  static observeNavigation() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics = {
        DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
        TCP: navigation.connectEnd - navigation.connectStart,
        SSL: navigation.connectEnd - navigation.secureConnectionStart,
        TTFB: navigation.responseStart - navigation.requestStart,
        DOMParse: navigation.domInteractive - navigation.responseEnd,
        DOMReady: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        WindowLoad: navigation.loadEventEnd - navigation.navigationStart,
      };
      
      console.log('Navigation Metrics:', metrics);
      
      // Send to analytics
      Object.entries(metrics).forEach(([key, value]) => {
        this.sendToAnalytics(`Navigation_${key}`, value);
      });
    });
  }

  // Monitor resource loading
  static observeResources() {
    if (typeof window === 'undefined') return;

    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;
        
        // Monitor slow resources (>2 seconds)
        if (resource.duration > 2000) {
          console.warn('Slow resource:', resource.name, resource.duration);
          this.sendToAnalytics('SlowResource', resource.duration, {
            url: resource.name,
            type: resource.initiatorType,
          });
        }
      });
    });
    
    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.push(resourceObserver);
  }

  // Send metrics to analytics (customize based on your analytics provider)
  private static sendToAnalytics(metric: string, value: number, extra?: any) {
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: metric,
        metric_value: Math.round(value),
        ...extra,
      });
    }
    
    // Example: Custom analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('Performance Metric', {
        metric,
        value: Math.round(value),
        ...extra,
      });
    }
  }

  // Clean up observers
  static disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Resource preloading utilities
export const preloadResource = (href: string, as: string, crossorigin?: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = crossorigin;
  document.head.appendChild(link);
};

export const preloadImage = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = src;
  link.as = 'image';
  document.head.appendChild(link);
};

export const preloadFont = (href: string, crossorigin = 'anonymous') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = crossorigin;
  document.head.appendChild(link);
};

// Critical CSS detection
export const loadCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Non-critical CSS lazy loading
export const loadCSS = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print';
  link.onload = function() {
    (this as any).media = 'all';
  };
  document.head.appendChild(link);
};

// JavaScript lazy loading with intersection observer
export const lazyLoadScript = (src: string, condition: () => boolean = () => true) => {
  if (!condition()) return Promise.resolve();
  
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('Memory Usage:', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB',
    });
  }
};

// Bundle size monitoring
export const reportBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available at build time');
  }
};

// Initialize all performance monitoring
export const initializePerformanceMonitoring = () => {
  if (typeof window !== 'undefined') {
    PerformanceMonitor.observeWebVitals();
    PerformanceMonitor.observeNavigation();
    PerformanceMonitor.observeResources();
    
    // Monitor memory usage every 30 seconds
    setInterval(monitorMemoryUsage, 30000);
    
    // Register service worker
    registerServiceWorker();
  }
};

export default {
  lazyWithRetry,
  PerformanceMonitor,
  preloadResource,
  preloadImage,
  preloadFont,
  loadCriticalCSS,
  loadCSS,
  lazyLoadScript,
  registerServiceWorker,
  monitorMemoryUsage,
  reportBundleSize,
  initializePerformanceMonitoring,
};
