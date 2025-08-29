import { lazy, ComponentType } from 'react';

// Performance: Enhanced lazy loading with preloading capability
export const lazyWithRetry = <T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  maxRetries: number = 3
) => {
  return lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );
    
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const component = await componentImport();
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
        return component;
      } catch (error) {
        retryCount++;
        
        if (retryCount >= maxRetries) {
          if (!pageHasAlreadyBeenForceRefreshed) {
            window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
            return window.location.reload() as never;
          }
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
      }
    }
    
    throw new Error('Max retries exceeded');
  });
};

// Performance: Component preloading
const preloadedComponents = new Map<string, Promise<any>>();

export const preloadComponent = <T extends ComponentType<any>>(
  name: string,
  componentImport: () => Promise<{ default: T }>
): void => {
  if (!preloadedComponents.has(name)) {
    preloadedComponents.set(name, componentImport());
  }
};

// Performance monitoring class with enhanced metrics
export class PerformanceMonitor {
  private static observers: PerformanceObserver[] = [];
  private static metrics: Map<string, number[]> = new Map();

  // Enhanced Web Vitals monitoring
  static observeWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.recordMetric('LCP', lastEntry.startTime);
      this.sendToAnalytics('LCP', lastEntry.startTime);
    });
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (error) {
      // LCP observation not supported - silent
    }

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fid = entry.processingStart - entry.startTime;
        this.recordMetric('FID', fid);
        this.sendToAnalytics('FID', fid);
      });
    });
    
    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (error) {
      // FID observation not supported - silent
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      // CLS value tracked silently
      this.recordMetric('CLS', clsValue);
      this.sendToAnalytics('CLS', clsValue);
    });
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      // CLS observation not supported - silent
    }

    // Time to First Byte (TTFB)
    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const ttfb = entry.responseStart - entry.requestStart;
        // TTFB tracked silently
        this.recordMetric('TTFB', ttfb);
        this.sendToAnalytics('TTFB', ttfb);
      });
    });
    
    try {
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);
    } catch (error) {
      // Navigation observation not supported - silent
    }
  }

  // Performance: Enhanced resource monitoring
  static observeResources() {
    if (typeof window === 'undefined') return;

    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const slowResources: any[] = [];
      let totalSize = 0;
      
      entries.forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;
        
        // Track slow resources (>1 second)
        if (resource.duration > 1000) {
          slowResources.push({
            url: resource.name,
            duration: resource.duration,
            type: resource.initiatorType,
            size: resource.transferSize || 0
          });
        }
        
        totalSize += resource.transferSize || 0;
      });
      
      if (slowResources.length > 0) {
        // Slow resources tracked silently
        slowResources.forEach(resource => {
          this.sendToAnalytics('SlowResource', resource.duration, {
            url: resource.url,
            type: resource.type,
            size: resource.size
          });
        });
      }
    });
    
    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (error) {
      // Resource observation not supported - silent
    }
  }

  // Performance: Long task monitoring
  static observeLongTasks() {
    if (typeof window === 'undefined') return;

    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        // Long task detected - tracked silently
        this.sendToAnalytics('LongTask', entry.duration);
      });
    });
    
    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (error) {
      // Long task observation not supported - silent
    }
  }

  // Performance: Record metrics for analysis
  private static recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  // Performance: Get performance statistics
  static getPerformanceStats() {
    const stats: Record<string, any> = {};
    
    this.metrics.forEach((values, name) => {
      if (values.length > 0) {
        const sorted = [...values].sort((a, b) => a - b);
        stats[name] = {
          count: values.length,
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          p50: sorted[Math.floor(sorted.length * 0.5)],
          p75: sorted[Math.floor(sorted.length * 0.75)],
          p95: sorted[Math.floor(sorted.length * 0.95)]
        };
      }
    });
    
    return stats;
  }

  // Enhanced analytics reporting
  private static sendToAnalytics(metric: string, value: number, extra?: any) {
    const roundedValue = Math.round(value * 100) / 100;
    
    // Analytics reporting without console logging
    
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: metric,
        metric_value: roundedValue,
        custom_map: { metric_1: metric },
        ...extra,
      });
    }
    
    // Custom analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('Performance Metric', {
        metric,
        value: roundedValue,
        timestamp: Date.now(),
        url: window.location.pathname,
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

// Performance: Resource preloading utilities
export const preloadResource = (href: string, as: string, crossorigin?: string) => {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = crossorigin;
  
  link.onerror = () => {}; // Silent error handling
  document.head.appendChild(link);
};

export const preloadImage = (src: string) => {
  if (typeof document === 'undefined') return Promise.resolve();
  
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadFont = (href: string, crossorigin = 'anonymous') => {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = crossorigin;
  document.head.appendChild(link);
};

// Performance: Critical CSS inlining
export const loadCriticalCSS = (css: string) => {
  if (typeof document === 'undefined') return;
  
  const style = document.createElement('style');
  style.textContent = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
};

// Performance: Non-critical CSS lazy loading
export const loadCSS = (href: string) => {
  if (typeof document === 'undefined') return Promise.resolve();
  
  return new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = function() {
      (this as any).media = 'all';
      resolve();
    };
    link.onerror = reject;
    document.head.appendChild(link);
  });
};

// Performance: Script lazy loading with intersection observer
export const lazyLoadScript = (src: string, condition: () => boolean = () => true) => {
  if (typeof document === 'undefined' || !condition()) {
    return Promise.resolve();
  }
  
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Performance: Enhanced memory monitoring
export const monitorMemoryUsage = () => {
  if (typeof performance === 'undefined' || !('memory' in performance)) {
    return null;
  }
  
  const memory = (performance as any).memory;
  const usage = {
    used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
    total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
    usedPercentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
  };
  
  // Memory usage tracking - no console output
  if (usage.usedPercentage > 80) {
    // High memory usage tracked silently
  } else if (usage.usedPercentage > 60) {
    // Memory usage tracked silently
  }
  
  return usage;
};

// Performance: Service Worker registration with update handling
export const registerServiceWorker = async () => {
  // Disabled - no console logs
  return null;
};

// Performance: Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Performance: Initialize all monitoring
export const initializePerformanceMonitoring = () => {
  // Performance monitoring disabled - no console output
  return;
};

// Export all utilities
export default {
  lazyWithRetry,
  preloadComponent,
  PerformanceMonitor,
  preloadResource,
  preloadImage,
  preloadFont,
  loadCriticalCSS,
  loadCSS,
  lazyLoadScript,
  monitorMemoryUsage,
  registerServiceWorker,
  createIntersectionObserver,
  initializePerformanceMonitoring,
};
