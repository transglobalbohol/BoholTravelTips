import { useEffect } from 'react';

// Types for structured data
export interface TourStructuredData {
  name: string;
  description: string;
  url: string;
  image: string[];
  price: {
    amount: number;
    currency: string;
  };
  duration: string;
  location: {
    name: string;
    address: string;
  };
  rating?: {
    ratingValue: number;
    reviewCount: number;
  };
  provider: {
    name: string;
    url: string;
  };
}

export interface HotelStructuredData {
  name: string;
  description: string;
  url: string;
  image: string[];
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  telephone: string;
  priceRange: string;
  rating?: {
    ratingValue: number;
    reviewCount: number;
  };
  amenities: string[];
}

export interface ArticleStructuredData {
  headline: string;
  description: string;
  image: string[];
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
  url: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// Hook to inject structured data
export const useStructuredData = (structuredData: any) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    script.id = 'structured-data';
    
    // Remove existing structured data script if present
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);
    
    return () => {
      script.remove();
    };
  }, [structuredData]);
};

// Tour structured data generator
export const generateTourStructuredData = (tour: TourStructuredData) => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.name,
    "description": tour.description,
    "url": tour.url,
    "image": tour.image,
    "offers": {
      "@type": "Offer",
      "price": tour.price.amount,
      "priceCurrency": tour.price.currency,
      "availability": "https://schema.org/InStock",
      "url": tour.url
    },
    "duration": tour.duration,
    "touristType": "https://schema.org/Tourist",
    "itinerary": {
      "@type": "Place",
      "name": tour.location.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": tour.location.address
      }
    },
    ...(tour.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": tour.rating.ratingValue,
        "reviewCount": tour.rating.reviewCount
      }
    }),
    "provider": {
      "@type": "Organization",
      "name": tour.provider.name,
      "url": tour.provider.url
    }
  };
};

// Hotel structured data generator
export const generateHotelStructuredData = (hotel: HotelStructuredData) => {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": hotel.name,
    "description": hotel.description,
    "url": hotel.url,
    "image": hotel.image,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": hotel.address.streetAddress,
      "addressLocality": hotel.address.addressLocality,
      "addressRegion": hotel.address.addressRegion,
      "addressCountry": hotel.address.addressCountry
    },
    "telephone": hotel.telephone,
    "priceRange": hotel.priceRange,
    ...(hotel.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": hotel.rating.ratingValue,
        "reviewCount": hotel.rating.reviewCount
      }
    }),
    "amenityFeature": hotel.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    }))
  };
};

// Article structured data generator
export const generateArticleStructuredData = (article: ArticleStructuredData) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.headline,
    "description": article.description,
    "image": article.image,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified,
    "author": {
      "@type": "Person",
      "name": article.author.name,
      ...(article.author.url && { "url": article.author.url })
    },
    "publisher": {
      "@type": "Organization",
      "name": article.publisher.name,
      "logo": {
        "@type": "ImageObject",
        "url": article.publisher.logo
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };
};

// Breadcrumb structured data generator
export const generateBreadcrumbStructuredData = (breadcrumbs: BreadcrumbItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

// FAQ structured data generator
export interface FAQItem {
  question: string;
  answer: string;
}

export const generateFAQStructuredData = (faqs: FAQItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Review structured data generator
export interface ReviewData {
  itemName: string;
  reviewBody: string;
  reviewRating: number;
  author: string;
  datePublished: string;
}

export const generateReviewStructuredData = (review: ReviewData) => {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Thing",
      "name": review.itemName
    },
    "reviewBody": review.reviewBody,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.reviewRating,
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "datePublished": review.datePublished
  };
};
