const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning dist directory...');

const distDir = path.join(__dirname, '..', 'dist');

try {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log('✅ Dist directory cleaned successfully');
  } else {
    console.log('ℹ️  Dist directory doesn\'t exist (nothing to clean)');
  }
} catch (error) {
  console.error('❌ Error cleaning dist directory:', error.message);
  process.exit(1);
}

console.log('🎉 Clean completed!');
