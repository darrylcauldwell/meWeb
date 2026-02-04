#!/usr/bin/env node

/**
 * Image optimization script
 * Resizes and compresses images that exceed size or dimension limits
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
const JPEG_QUALITY = 85;
const PNG_QUALITY = 85;
const WEBP_QUALITY = 85;
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];

async function getImageMetadata(imagePath) {
  const stats = fs.statSync(imagePath);
  const metadata = await sharp(imagePath).metadata();
  return {
    sizeKB: stats.size / 1024,
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format,
  };
}

async function optimizeImage(imagePath, metadata) {
  const { width, height, format, sizeKB } = metadata;
  const relativePath = path.relative(publicDir, imagePath);

  let needsResize = width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX;
  let needsCompress = sizeKB > MAX_FILE_SIZE_KB;

  if (!needsResize && !needsCompress) {
    return { optimized: false };
  }

  console.log(`\nOptimizing: ${relativePath}`);
  console.log(`  Original: ${sizeKB.toFixed(1)}KB, ${width}x${height}`);

  let pipeline = sharp(imagePath);

  // Resize if needed
  if (needsResize) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION_PX,
      height: MAX_DIMENSION_PX,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Apply format-specific compression
  switch (format) {
    case 'jpeg':
    case 'jpg':
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true });
      break;
    case 'png':
      pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality: WEBP_QUALITY });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality: WEBP_QUALITY });
      break;
    case 'gif':
      // GIF optimization is limited, just resize if needed
      break;
    default:
      console.log(`  ⚠️  Unknown format: ${format}, skipping compression`);
  }

  // Save to temp file first
  const tempPath = imagePath + '.optimized';
  await pipeline.toFile(tempPath);

  // Get new metadata
  const newMetadata = await getImageMetadata(tempPath);

  // Only replace if the new file is smaller
  if (newMetadata.sizeKB < sizeKB) {
    fs.unlinkSync(imagePath);
    fs.renameSync(tempPath, imagePath);
    console.log(`  Optimized: ${newMetadata.sizeKB.toFixed(1)}KB, ${newMetadata.width}x${newMetadata.height}`);
    console.log(`  Saved: ${(sizeKB - newMetadata.sizeKB).toFixed(1)}KB (${((1 - newMetadata.sizeKB / sizeKB) * 100).toFixed(0)}%)`);
    return { optimized: true, saved: sizeKB - newMetadata.sizeKB };
  } else {
    fs.unlinkSync(tempPath);
    console.log(`  ⚠️  Optimization would increase size, skipping`);
    return { optimized: false };
  }
}

async function optimizeImages() {
  console.log('Optimizing images in public/ directory...');
  console.log(`Max file size: ${MAX_FILE_SIZE_KB}KB`);
  console.log(`Max dimension: ${MAX_DIMENSION_PX}px`);

  const pattern = `**/*.{${IMAGE_EXTENSIONS.join(',')}}`;
  const images = await fg(pattern, { cwd: publicDir, absolute: true });

  if (images.length === 0) {
    console.log('\nNo images found in public/ directory.');
    return;
  }

  console.log(`\nFound ${images.length} image(s) to process.`);

  let optimizedCount = 0;
  let totalSaved = 0;
  let errorCount = 0;

  for (const imagePath of images) {
    try {
      const metadata = await getImageMetadata(imagePath);
      const result = await optimizeImage(imagePath, metadata);

      if (result.optimized) {
        optimizedCount++;
        totalSaved += result.saved;
      }
    } catch (error) {
      errorCount++;
      const relativePath = path.relative(publicDir, imagePath);
      console.log(`\n❌ Error optimizing ${relativePath}: ${error.message}`);
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log(`Processed: ${images.length}`);
  console.log(`Optimized: ${optimizedCount}`);
  console.log(`Errors: ${errorCount}`);

  if (totalSaved > 0) {
    if (totalSaved > 1024) {
      console.log(`Total saved: ${(totalSaved / 1024).toFixed(2)}MB`);
    } else {
      console.log(`Total saved: ${totalSaved.toFixed(1)}KB`);
    }
  }

  console.log('\n✅ Image optimization complete.\n');
}

optimizeImages().catch((error) => {
  console.error('Error running image optimization:', error);
  process.exit(1);
});
