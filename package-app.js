
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('📦 Packaging AI Character Creator as a standalone application...');

try {
  // Build React app with Vite
  console.log('🔨 Building React app...');
  execSync('npm run build', { stdio: 'inherit' });

  // Package with electron-builder
  console.log('🔨 Packaging with electron-builder...');
  execSync('npx electron-builder --publish never', { stdio: 'inherit' });

  console.log('✅ Packaging complete! Check the release folder for your executables.');
  console.log('📁 Location: ' + path.resolve('./release'));
} catch (error) {
  console.error('❌ Error during packaging:', error.message);
  process.exit(1);
}
