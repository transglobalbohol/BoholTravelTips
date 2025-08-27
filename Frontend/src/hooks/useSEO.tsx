import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  canonical?: string;
}

export const useSEO = ({
  title,
  description,
  keywords,
  image = '/images/og-image.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  canonical,
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Bohol Travel Tips`;

    // Helper function to update meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    if (author) updateMetaTag('author', author);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:image', `https://www.boholtraveltips.com${image}`, true);
    
    if (url) {
      updateMetaTag('og:url', `https://www.boholtraveltips.com${url}`, true);
    }

    // Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `https://www.boholtraveltips.com${image}`);

    // Article-specific tags
    if (type === 'article') {
      if (publishedTime) updateMetaTag('article:published_time', publishedTime, true);
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, true);
      if (author) updateMetaTag('article:author', author, true);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    
    const canonicalUrl = canonical || (url ? `https://www.boholtraveltips.com${url}` : 'https://www.boholtraveltips.com');
    canonicalLink.setAttribute('href', canonicalUrl);

  }, [title, description, keywords, image, url, type, publishedTime, modifiedTime, author, canonical]);
};

// Component wrapper for SEO
export const SEOHead: React.FC<SEOProps> = (props) => {
  useSEO(props);
  return null;
};

export default useSEO;
