
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
