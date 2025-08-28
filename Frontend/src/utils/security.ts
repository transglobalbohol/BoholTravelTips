// Content Security Policy configuration
export const CSP_CONFIG = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'", "data:", "https:", "blob:"],
  connectSrc: ["'self'", import.meta.env.VITE_API_URL || "http://localhost:5000"],
  mediaSrc: ["'self'"],
  objectSrc: ["'none'"],
  frameSrc: ["'none'"],
  workerSrc: ["'self'", "blob:"],
  childSrc: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  baseUri: ["'self'"],
  manifestSrc: ["'self'"]
};

// XSS Protection utilities (without DOMPurify dependency)
export const sanitizeHTML = (dirty: string): string => {
  // Basic HTML sanitization for client-side
  const div = document.createElement('div');
  div.textContent = dirty;
  return div.innerHTML;
};

export const sanitizeUserInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters and patterns
  let sanitized = input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/<[^>]*>/g, ''); // Remove all HTML tags
  
  // Additional XSS protection
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  return sanitized;
};

// Validate URLs to prevent XSS
export const isValidURL = (url: string): boolean => {
  try {
    const urlObject = new URL(url);
    return ['http:', 'https:'].includes(urlObject.protocol);
  } catch {
    return false;
  }
};

// Secure local storage with basic encoding (not encryption, but better than plain text)
class SecureStorage {
  private static encode(text: string): string {
    return btoa(encodeURIComponent(text));
  }
  
  private static decode(encoded: string): string {
    try {
      return decodeURIComponent(atob(encoded));
    } catch {
      return '';
    }
  }
  
  static setItem(key: string, value: string): void {
    try {
      const encoded = this.encode(value);
      sessionStorage.setItem(key, encoded);
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  }
  
  static getItem(key: string): string | null {
    try {
      const encoded = sessionStorage.getItem(key);
      return encoded ? this.decode(encoded) : null;
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  }
  
  static removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }
  
  static clear(): void {
    sessionStorage.clear();
  }
}

// CSRF Protection
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Input validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,15}$/;
  return phoneRegex.test(phone);
};

// File upload validation
export const validateFile = (file: File, allowedTypes: string[] = [], maxSize: number = 5 * 1024 * 1024): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }
  
  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  // Check for dangerous file extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.js', '.jar'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (dangerousExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: 'File type not allowed for security reasons'
    };
  }
  
  return { isValid: true };
};

// Security headers utility
export const setSecurityHeaders = (): void => {
  // Set CSP meta tag
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = Object.entries(CSP_CONFIG)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
  document.head.appendChild(cspMeta);
  
  // Set other security headers via meta tags
  const securityMetas = [
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    { httpEquiv: 'X-Frame-Options', content: 'DENY' },
    { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
    { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
  ];
  
  securityMetas.forEach(meta => {
    const metaTag = document.createElement('meta');
    metaTag.httpEquiv = meta.httpEquiv;
    metaTag.content = meta.content;
    document.head.appendChild(metaTag);
  });
};

// Rate limiting for client-side requests
class ClientRateLimit {
  private static requests = new Map<string, number[]>();
  
  static check(key: string, limit: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requestTimes = this.requests.get(key)!;
    
    // Remove old requests outside the window
    const validRequests = requestTimes.filter(time => time > windowStart);
    
    if (validRequests.length >= limit) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
}

// Security event logging
export const logSecurityEvent = (event: string, data: any = {}) => {
  const securityEvent = {
    event,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    data
  };
  
  console.warn('Security Event:', securityEvent);
  
  // In production, send to security monitoring endpoint
  if (import.meta.env.PROD) {
    fetch('/api/security/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(securityEvent)
    }).catch(() => {
      // Fail silently in production
    });
  }
};

export { SecureStorage, ClientRateLimit };
