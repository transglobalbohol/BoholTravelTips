const fs = require('fs');
const path = require('path');

console.log('CommonJS Script starting...');
console.log('Script directory:', __dirname);

// Static pages configuration
const staticPages = [
  {
    url: 'https://www.boholtraveltips.com/',
    changefreq: 'daily',
    priority: 1.0
  },
  {
    url: 'https://www.boholtraveltips.com/tours',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: 'https://www.boholtraveltips.com/hotels',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: 'https://www.boholtraveltips.com/destinations',
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    url: 'https://www.boholtraveltips.com/travel-guides',
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    url: 'https://www.boholtraveltips.com/travel-guides/best-time-to-visit',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: 'https://www.boholtraveltips.com/travel-guides/attractions',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: 'https://www.boholtraveltips.com/travel-guides/itinerary',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: 'https://www.boholtraveltips.com/travel-guides/food',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: 'https://www.boholtraveltips.com/travel-guides/transportation',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: 'https://www.boholtraveltips.com/car-rentals',
    changefreq: 'weekly',
    priority: 0.7
  },
  {
    url: 'https://www.boholtraveltips.com/about',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    url: 'https://www.boholtraveltips.com/contact',
    changefreq: 'monthly',
    priority: 0.5
  }
];

// Generate XML sitemap
function generateSitemap(pages) {
  console.log('Generating XML content...');
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  pages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod || currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Main function
function generateSitemapFile() {
  try {
    console.log('Generating sitemap.xml...');
    
    const allPages = [...staticPages];
    const sitemap = generateSitemap(allPages);
    
    // Setup paths
    const distDir = path.join(__dirname, '..', 'dist');
    const publicDir = path.join(__dirname, '..', 'public');
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
    
    console.log('Creating directories if needed...');
    
    // Ensure directories exist
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
      console.log('Created dist directory');
    }
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      console.log('Created public directory');
    }
    
    // Write sitemap files
    console.log('Writing sitemap files...');
    fs.writeFileSync(sitemapPath, sitemap);
    fs.writeFileSync(publicSitemapPath, sitemap);
    
    console.log('Sitemap generated successfully!');
    console.log(`Location (dist): ${sitemapPath}`);
    console.log(`Location (public): ${publicSitemapPath}`);
    console.log(`Total pages: ${allPages.length}`);
    
    // Show the pages included
    console.log('\n Pages included in sitemap:');
    allPages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.url} (Priority: ${page.priority})`);
    });
    
    console.log('\n Sitemap generation completed successfully!');
    console.log(' After deployment, your sitemap will be available at:');
    console.log('   https://www.boholtraveltips.com/sitemap.xml');
    
  } catch (error) {
    console.error(' Error generating sitemap:', error);
    throw error;
  }
}

// Run the generator
if (require.main === module) {
  console.log(' Running CommonJS sitemap generator...');
  generateSitemapFile();
}

module.exports = { generateSitemapFile, generateSitemap, staticPages };
