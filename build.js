
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔨 Building LumeAI Application...');

try {
  // Build React app with Vite
  console.log('Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build complete!');
  console.log('To package the app as an executable, run:');
  console.log('node package-app.js');
} catch (error) {
  console.error('❌ Error during build:', error.message);
  process.exit(1);
}
