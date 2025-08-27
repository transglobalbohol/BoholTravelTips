import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a minimal sitemap for Google
const minimalPages = [
  'https://www.boholtraveltips.com/',
  'https://www.boholtraveltips.com/tours',
  'https://www.boholtraveltips.com/hotels',
  'https://www.boholtraveltips.com/destinations',
  'https://www.boholtraveltips.com/travel-guides',
  'https://www.boholtraveltips.com/about',
  'https://www.boholtraveltips.com/contact'
];

function generateMinimalSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  minimalPages.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

try {
  const sitemap = generateMinimalSitemap();
  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapPath = path.join(publicDir, 'sitemap-minimal.xml');
  
  fs.writeFileSync(sitemapPath, sitemap);
  
  console.log('✅ Minimal sitemap created: sitemap-minimal.xml');
  console.log('📋 Pages included:', minimalPages.length);
  console.log('\nFirst few lines:');
  console.log(sitemap.split('\n').slice(0, 8).join('\n'));
  
} catch (error) {
  console.error('❌ Error:', error);
}
