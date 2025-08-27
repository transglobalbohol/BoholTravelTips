// Sitemap generation utilities
export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (entries: SitemapEntry[]): string => {
  const header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const footer = '</urlset>';
  
  const urls = entries.map(entry => {
    const url = `  <url>
    <loc>${entry.url}</loc>${entry.lastmod ? `
    <lastmod>${entry.lastmod}</lastmod>` : ''}${entry.changefreq ? `
    <changefreq>${entry.changefreq}</changefreq>` : ''}${entry.priority ? `
    <priority>${entry.priority}</priority>` : ''}
  </url>`;
    return url;
  }).join('\n');
  
  return header + urls + '\n' + footer;
};

// Static pages sitemap
export const getStaticPagesSitemap = (): SitemapEntry[] => [
  {
    url: 'https://www.boholtraveltips.com/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 1.0
  },
  {
    url: 'https://www.boholtraveltips.com/tours',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: 'https://www.boholtraveltips.com/hotels',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: 'https://www.boholtraveltips.com/destinations',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    url: 'https://www.boholtraveltips.com/travel-guides',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    url: 'https://www.boholtraveltips.com/travel-guides/best-time-to-visit',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: 'https://www.boholtraveltips.com/travel-guides/attractions',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: 'https://www.boholtraveltips.com/travel-guides/itinerary',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: 'https://www.boholtraveltips.com/travel-guides/food',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: 'https://www.boholtraveltips.com/travel-guides/transportation',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: 'https://www.boholtraveltips.com/about',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    url: 'https://www.boholtraveltips.com/contact',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.5
  }
];

// Generate dynamic sitemap for tours
export const generateToursSitemap = (tours: any[]): SitemapEntry[] => {
  return tours.map(tour => ({
    url: `https://www.boholtraveltips.com/tours/${tour.id || tour.slug}`,
    lastmod: tour.updatedAt || new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  }));
};

// Generate dynamic sitemap for hotels
export const generateHotelsSitemap = (hotels: any[]): SitemapEntry[] => {
  return hotels.map(hotel => ({
    url: `https://www.boholtraveltips.com/hotels/${hotel.id || hotel.slug}`,
    lastmod: hotel.updatedAt || new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.7
  }));
};

// Generate robots.txt content
export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /login
Disallow: /register
Disallow: /profile

# Sitemap
Sitemap: https://www.boholtraveltips.com/sitemap.xml

# Crawl-delay for specific bots
User-agent: Googlebot
Crawl-delay: 1

User-agent: Bingbot
Crawl-delay: 1`;
};

// Generate complete sitemap with all content
export const generateCompleteSitemap = async (
  tours: any[] = [],
  hotels: any[] = []
): Promise<string> => {
  const staticPages = getStaticPagesSitemap();
  const tourPages = generateToursSitemap(tours);
  const hotelPages = generateHotelsSitemap(hotels);
  
  const allPages = [...staticPages, ...tourPages, ...hotelPages];
  
  return generateSitemap(allPages);
};

// SEO-friendly URL generator
export const generateSEOSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

// Canonical URL helper
export const getCanonicalURL = (path: string): string => {
  const baseURL = 'https://www.boholtraveltips.com';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return baseURL + cleanPath;
};

// Meta description generator for different content types
export const generateMetaDescription = (
  type: 'tour' | 'hotel' | 'destination' | 'guide' | 'general',
  title: string,
  location?: string
): string => {
  const descriptions = {
    tour: `Book ${title} in ${location || 'Bohol'}. Experience amazing adventures with Bohol Travel Tips - your trusted guide to Bohol Philippines.`,
    hotel: `Book ${title} in ${location || 'Bohol'}. Find the best accommodation deals with Bohol Travel Tips - your ultimate Bohol guide.`,
    destination: `Discover ${title} in Bohol, Philippines. Complete travel guide with tours, attractions, and tips for visiting ${title}.`,
    guide: `${title} - Complete guide for Bohol Philippines. Expert travel tips, recommendations, and insider knowledge for your Bohol trip.`,
    general: `${title} - Bohol Travel Tips. Your comprehensive guide to exploring Bohol, Philippines with the best tours, hotels, and experiences.`
  };
  
  return descriptions[type];
};

export default {
  generateSitemap,
  getStaticPagesSitemap,
  generateToursSitemap,
  generateHotelsSitemap,
  generateRobotsTxt,
  generateCompleteSitemap,
  generateSEOSlug,
  getCanonicalURL,
  generateMetaDescription
};
