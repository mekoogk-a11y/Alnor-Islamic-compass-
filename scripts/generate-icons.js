import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

function createPNG(width, height, isMaskable = false) {
  // Generate RGBA buffer
  const rowSize = width * 4;
  const rawData = Buffer.alloc((rowSize + 1) * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.38 : 0.44);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep emerald background (#022c22)
      let r = 2;
      let g = 44;
      let b = 34;
      let a = 255;

      // Golden outer ring
      if (Math.abs(dist - radius) < width * 0.02) {
        r = 245; g = 158; b = 11; // Gold
      } else if (dist < radius) {
        // Inner gradient towards center
        const factor = 1 - (dist / radius);
        r = Math.min(255, Math.floor(2 + factor * 25));
        g = Math.min(255, Math.floor(44 + factor * 60));
        b = Math.min(255, Math.floor(34 + factor * 25));

        // Center golden Quran icon representation
        const nx = Math.abs(dx) / (width * 0.22);
        const ny = Math.abs(dy) / (height * 0.20);
        if (nx < 1 && ny < 1 && (nx > 0.08 || ny > 0.8)) {
          r = 251; g = 191; b = 36; // Amber gold
        }
      } else if (!isMaskable) {
        // Outside circular border for regular icon
        if (dist > radius + 4) {
          a = 0;
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG structure
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = createChunk('IDAT', deflated);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(len + 12);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, len + 8));
  chunk.writeUInt32BE(crc, len + 8);
  return chunk;
}

// CRC32 implementation
function crc32(buf) {
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[i] = c;
}

// Generate files
const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPNG(192, 192, false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPNG(512, 512, false));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPNG(180, 180, true));
fs.writeFileSync(path.join(outDir, 'favicon.ico'), createPNG(64, 64, false));

console.log('Successfully generated all PWA PNG icons!');
