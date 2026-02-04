#!/usr/bin/env node

/**
 * Image validation script
 * Checks that all images in public/ are within size and dimension limits
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fg from 'fast-glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

// Configuration
const MAX_FILE_SIZE_KB = 500;
const MAX_DIMENSION_PX = 1600;
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];

async function checkImages() {
  console.log('Checking images in public/ directory...\n');

  const pattern = `**/*.{${IMAGE_EXTENSIONS.join(',')}}`;
  const images = await fg(pattern, { cwd: publicDir, absolute: true });

  if (images.length === 0) {
    console.log('No images found in public/ directory.');
    return { success: true, issues: [] };
  }

  console.log(`Found ${images.length} image(s) to check.\n`);

  const issues = [];
  let checked = 0;
  let passed = 0;

  for (const imagePath of images) {
    checked++;
    const relativePath = path.relative(publicDir, imagePath);
    const imageIssues = [];

    try {
      // Check file size
      const stats = fs.statSync(imagePath);
      const fileSizeKB = stats.size / 1024;

      if (fileSizeKB > MAX_FILE_SIZE_KB) {
        imageIssues.push(`File size ${fileSizeKB.toFixed(1)}KB exceeds ${MAX_FILE_SIZE_KB}KB limit`);
      }

      // Check dimensions
      const metadata = await sharp(imagePath).metadata();
      const width = metadata.width || 0;
      const height = metadata.height || 0;

      if (width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
        imageIssues.push(`Dimensions ${width}x${height}px exceed ${MAX_DIMENSION_PX}px limit`);
      }

      if (imageIssues.length > 0) {
        issues.push({
          path: relativePath,
          issues: imageIssues,
          size: fileSizeKB,
          width,
          height,
        });
        console.log(`❌ ${relativePath}`);
        imageIssues.forEach((issue) => console.log(`   └─ ${issue}`));
      } else {
        passed++;
        console.log(`✓ ${relativePath} (${fileSizeKB.toFixed(1)}KB, ${width}x${height})`);
      }
    } catch (error) {
      issues.push({
        path: relativePath,
        issues: [`Error reading image: ${error.message}`],
      });
      console.log(`❌ ${relativePath}`);
      console.log(`   └─ Error: ${error.message}`);
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log(`Checked: ${checked} | Passed: ${passed} | Issues: ${issues.length}`);

  if (issues.length > 0) {
    console.log('\n⚠️  Some images need optimization.');
    console.log('Run "npm run images:optimize" to fix automatically.\n');
    process.exit(1);
  } else {
    console.log('\n✅ All images are within limits.\n');
    process.exit(0);
  }
}

checkImages().catch((error) => {
  console.error('Error running image check:', error);
  process.exit(1);
});
