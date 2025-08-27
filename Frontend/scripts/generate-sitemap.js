import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Script starting...');
console.log('📁 Script directory:', __dirname);

// Static pages configuration - These are guaranteed to exist
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

console.log(`📋 Found ${staticPages.length} static pages to include`);

// Generate XML sitemap
function generateSitemap(pages) {
  console.log('🔧 Generating XML content...');
  const currentDate = new Date().toISOString().split('T')[0];
  console.log('📅 Using date:', currentDate);
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  pages.forEach((page, index) => {
    console.log(`  Processing page ${index + 1}: ${page.url}`);
    xml += '  <url>\n';
    xml += `    <loc>${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod || currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  console.log('✅ XML content generated');
  return xml;
}

// Main function
async function generateSitemapFile() {
  try {
    console.log('🗺️  Starting sitemap generation...');
    
    // Use static pages (always available)
    const allPages = [...staticPages];
    console.log(`📊 Total pages to process: ${allPages.length}`);
    
    const sitemap = generateSitemap(allPages);
    
    // Setup paths
    const distDir = path.join(__dirname, '..', 'dist');
    const publicDir = path.join(__dirname, '..', 'public');
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
    
    console.log('📁 Paths:');
    console.log('   Dist dir:', distDir);
    console.log('   Public dir:', publicDir);
    console.log('   Sitemap path (dist):', sitemapPath);
    console.log('   Sitemap path (public):', publicSitemapPath);
    
    // Ensure directories exist
    console.log('🔧 Ensuring directories exist...');
    if (!fs.existsSync(distDir)) {
      console.log('📁 Creating dist directory...');
      fs.mkdirSync(distDir, { recursive: true });
    } else {
      console.log('✅ Dist directory exists');
    }
    
    if (!fs.existsSync(publicDir)) {
      console.log('📁 Creating public directory...');
      fs.mkdirSync(publicDir, { recursive: true });
    } else {
      console.log('✅ Public directory exists');
    }
    
    // Write sitemap files
    console.log('💾 Writing sitemap files...');
    
    try {
      fs.writeFileSync(sitemapPath, sitemap);
      console.log('✅ Sitemap written to dist directory');
    } catch (distError) {
      console.error('❌ Error writing to dist:', distError.message);
    }
    
    try {
      fs.writeFileSync(publicSitemapPath, sitemap);
      console.log('✅ Sitemap written to public directory');
    } catch (publicError) {
      console.error('❌ Error writing to public:', publicError.message);
    }
    
    // Verify files were created
    console.log('🔍 Verifying files...');
    if (fs.existsSync(sitemapPath)) {
      const stats = fs.statSync(sitemapPath);
      console.log(`✅ Dist sitemap exists (${stats.size} bytes)`);
    } else {
      console.log('❌ Dist sitemap not found');
    }
    
    if (fs.existsSync(publicSitemapPath)) {
      const stats = fs.statSync(publicSitemapPath);
      console.log(`✅ Public sitemap exists (${stats.size} bytes)`);
    } else {
      console.log('❌ Public sitemap not found');
    }
    
    // Show first few lines of the sitemap
    console.log('\n📋 First few lines of generated sitemap:');
    const lines = sitemap.split('\n').slice(0, 10);
    lines.forEach((line, index) => {
      console.log(`${index + 1}: ${line}`);
    });
    
    console.log('\n🎉 SITEMAP GENERATION COMPLETED SUCCESSFULLY!');
    console.log(`📊 Total pages included: ${allPages.length}`);
    console.log('📍 Files created:');
    console.log(`   - ${sitemapPath}`);
    console.log(`   - ${publicSitemapPath}`);
    console.log('\n🔗 After deployment, your sitemap will be available at:');
    console.log('   https://www.boholtraveltips.com/sitemap.xml');
    
    return { 
      success: true, 
      totalPages: allPages.length, 
      sitemapPath,
      publicSitemapPath 
    };
    
  } catch (error) {
    console.error('💥 CRITICAL ERROR in generateSitemapFile:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

// Add process error handlers
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Check if running directly
console.log('🔍 Checking execution context...');
console.log('import.meta.url:', import.meta.url);
console.log('process.argv[1]:', process.argv[1]);

const isDirectExecution = import.meta.url === `file://${process.argv[1]}`;
console.log('Is direct execution:', isDirectExecution);

// Run the generator if this file is executed directly
if (isDirectExecution) {
  console.log('🏃‍♂️ Running sitemap generator...');
  generateSitemapFile()
    .then((result) => {
      console.log('\n🎊 SUCCESS! Sitemap generation completed!');
      console.log('Result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💀 FAILURE! Sitemap generation failed:');
      console.error(error);
      process.exit(1);
    });
} else {
  console.log('📦 Script loaded as module (not executed directly)');
}

// Export for use in other modules
export { generateSitemapFile, generateSitemap, staticPages };
