
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Packaging AI Character Creator as a standalone application...');

// Build React app with Vite
console.log('🔨 Building React app...');
execSync('npm run build', { stdio: 'inherit' });

// Package with electron-builder
console.log('🔨 Packaging with electron-builder...');
execSync('npx electron-builder --win --mac --linux', { stdio: 'inherit' });

console.log('✅ Packaging complete! Check the release folder for your executables.');
