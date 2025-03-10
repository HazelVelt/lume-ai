
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 LumeAI Application Packager 🚀');

// Ask for target platform
rl.question('Select target platform (win, mac, linux, all) [win]: ', (platform) => {
  platform = platform || 'win';
  
  try {
    // Build React app with Vite
    console.log('🔨 Building React app...');
    execSync('npm run build', { stdio: 'inherit' });

    // Package with electron-builder
    console.log(`🔨 Packaging for ${platform}...`);
    
    let buildCommand;
    switch (platform.toLowerCase()) {
      case 'win':
        buildCommand = 'npx electron-builder --win --publish never';
        break;
      case 'mac':
        buildCommand = 'npx electron-builder --mac --publish never';
        break;
      case 'linux':
        buildCommand = 'npx electron-builder --linux --publish never';
        break;
      case 'all':
        buildCommand = 'npx electron-builder --win --mac --linux --publish never';
        break;
      default:
        buildCommand = 'npx electron-builder --win --publish never';
    }
    
    execSync(buildCommand, { stdio: 'inherit' });

    console.log('✅ Packaging complete! Check the release folder for your executables.');
    console.log('📁 Location: ' + path.resolve('./release'));
  } catch (error) {
    console.error('❌ Error during packaging:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
});
