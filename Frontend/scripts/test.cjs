console.log('🚀 Node.js is working!');
console.log('📅 Current date:', new Date().toISOString());
console.log('📂 Current directory:', process.cwd());
console.log('🔢 Node.js version:', process.version);
console.log('💻 Platform:', process.platform);

// Test file operations
const fs = require('fs');
const path = require('path');

console.log('📁 Testing file operations...');

try {
  const testDir = path.join(__dirname, '..', 'public');
  console.log('📂 Test directory:', testDir);
  
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
    console.log('✅ Created public directory');
  } else {
    console.log('✅ Public directory exists');
  }
  
  const testFile = path.join(testDir, 'test.txt');
  fs.writeFileSync(testFile, 'Hello World!');
  console.log('✅ Test file written successfully');
  
  const content = fs.readFileSync(testFile, 'utf8');
  console.log('✅ Test file read successfully:', content);
  
  fs.unlinkSync(testFile);
  console.log('✅ Test file cleaned up');
  
  console.log('🎉 All tests passed! Node.js is working correctly.');
  
} catch (error) {
  console.error('❌ Test failed:', error);
}
