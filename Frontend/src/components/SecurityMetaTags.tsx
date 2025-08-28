import React from 'react';
import { Helmet } from 'react-helmet';

interface SecurityMetaTagsProps {
  title?: string;
  description?: string;
  apiUrl?: string;
}

const SecurityMetaTags: React.FC<SecurityMetaTagsProps> = ({ 
  title = "Bohol Travel Tips - Secure Tourism Platform",
  description = "Discover Bohol's hidden gems with our secure, user-friendly travel platform. Book tours, hotels, and experiences safely.",
  apiUrl = "https://api.boholtraveltips.com"
}) => {
  const cspPolicy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
    "img-src 'self' data: https: blob:",
    `connect-src 'self' ${apiUrl} wss:${apiUrl.replace('https:', '')}`,
    "media-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta charSet="UTF-8" />
      
      {/* Security Meta Tags */}
      <meta httpEquiv="Content-Security-Policy" content={cspPolicy} />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="X-DNS-Prefetch-Control" content="off" />
      <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains; preload" />
      
      {/* Permissions Policy */}
      <meta 
        httpEquiv="Permissions-Policy" 
        content="geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=(), fullscreen=(self)" 
      />
      
      {/* Open Graph Security */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.boholtraveltips.com" />
      <meta property="og:image" content="https://www.boholtraveltips.com/og-image.jpg" />
      <meta property="og:site_name" content="Bohol Travel Tips" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Security */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://www.boholtraveltips.com/twitter-card.jpg" />
      
      {/* DNS Prefetch Control */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href={apiUrl} crossOrigin="use-credentials" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Theme and App Configuration */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="application-name" content="Bohol Travel Tips" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Bohol Travel Tips" />
      
      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          "name": "Bohol Travel Tips",
          "url": "https://www.boholtraveltips.com",
          "description": description,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "PH",
            "addressRegion": "Bohol"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "url": "https://www.boholtraveltips.com/contact"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SecurityMetaTags;
