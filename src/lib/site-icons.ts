// SOURCE: zurp-astronomics-site — site icons (favicon, apple-touch-icon, 192 px icon) and the GitHub organisation avatar, rendered at build time from one drawing
// AUTHOR: engineer
// DATE: 2026-10-03
// STATUS: active
//
// SOURCE DRAWING. src/assets/brand/Low_tech_DIY.png — the « Low-Tech & DIY » sticker of zUrp
// Embedded (a Nyan Cat on its rainbow, in an orange frame): 1187 × 739 PNG, RGBA, copied as is from
// the site of 8c2fc77 (public/Low_tech_DIY.png, also its favicon). Every file below is derived from it
// at build time: nothing is cropped or resized by hand, so a new drawing is one file to replace.
//
// TWO TREATMENTS OF THE SAME DRAWING (the drawing is not square):
//   - small sizes (16 and 32 px, the browser tab): a SQUARE CROP on the Nyan Cat and its pop-tart,
//     without the lettering and the frame, which would be lost at 16 px. ICON_CROP below is measured
//     on the 1187 × 739 source: the cat and its pop-tart run from x ≈ 725 to 1057 and y ≈ 318 to 530.
//     If the source drawing changes, re-measure: these numbers belong to THIS drawing;
//   - large sizes (≥ 48 px: apple-touch-icon 180 px, icon 192 px, the avatar itself): the COMPLETE
//     drawing, scaled to fit a white square (its transparent margins flattened on white).
//
// PUBLISHED FILES (static endpoints, src/pages/…; scripts/check-dist.mjs mirrors this list — change
// both together, or never):
//   /favicon.ico            16 + 32 px, crop     the file browsers and tools request on their own
//   /favicon-16.png         16 × 16, crop        <link rel="icon" sizes="16x16">
//   /favicon-32.png         32 × 32, crop        <link rel="icon" sizes="32x32">
//   /icon-192.png           192 × 192, complete  <link rel="icon" sizes="192x192"> (Android, pinned tabs)
//   /apple-touch-icon.png   180 × 180, complete  <link rel="apple-touch-icon"> (iOS home screen; iOS
//                                                also requests this path on its own)
//   /brand/avatar.png       480 × 480, complete  STABLE URL, the GitHub organisation avatar (uploaded
//                                                by hand: readme-kit/README.md says where). Never
//                                                move or rename it.
// Declared in the <head> of every page by src/layouts/V2Layout.astro.
//
// HOW. sharp (the image library Astro uses, declared in package.json; see src/lib/social-card.ts),
// reading the source through the import's `fsPath` only — reading any other property of an image
// import would make Astro copy the original into dist/_astro (src/lib/brand-images.ts explains why).
// No web app manifest: nothing on this site is installable, the 192 px icon is declared directly.

import sharp from 'sharp';
import type { ImageMetadata } from 'astro';
import sticker from '../assets/brand/Low_tech_DIY.png';

/** Size of the avatar (/brand/avatar.png), the largest icon published. */
export const AVATAR_SIZE = 480;

/** Size of the source drawing, checked at build time (the crop below is measured on it). */
export const SOURCE_SIZE = { width: 1187, height: 739 } as const;

/** Square crop on the Nyan Cat, in source pixels (see the header). */
export const ICON_CROP = { left: 718, top: 272, width: 348, height: 348 } as const;

/** The square the complete drawing is fitted in, for the large icons. */
const BACKGROUND = { r: 255, g: 255, b: 255, alpha: 1 } as const;

function sourcePath(): string {
  const fsPath = (sticker as ImageMetadata & { fsPath?: string }).fsPath;
  if (!fsPath) {
    throw new Error('site icons: no fsPath on the imported drawing — Astro internals changed?');
  }
  return fsPath;
}

/** The source as a sharp pipeline, after checking it is still the 1187 × 739 drawing. */
async function source(): Promise<sharp.Sharp> {
  const path = sourcePath();
  const { width, height } = await sharp(path).metadata();
  if (width !== SOURCE_SIZE.width || height !== SOURCE_SIZE.height) {
    throw new Error(
      `site icons: src/assets/brand/Low_tech_DIY.png is ${width} × ${height}, expected ${SOURCE_SIZE.width} × ${SOURCE_SIZE.height} — re-measure ICON_CROP`,
    );
  }
  return sharp(path);
}

const PNG_OPTIONS = { compressionLevel: 9, adaptiveFiltering: true } as const;

/** Small icon: the Nyan Cat crop at `size` px, as PNG bytes (RGBA, as ICO containers expect). */
export async function croppedIcon(size: number): Promise<Buffer> {
  return (await source())
    .extract(ICON_CROP)
    .resize(size, size, { kernel: 'lanczos3' })
    .ensureAlpha()
    .png(PNG_OPTIONS)
    .toBuffer();
}

/** Large icon: the complete drawing, fitted in a white `size` px square, as PNG bytes. */
export async function fullIcon(size: number): Promise<Buffer> {
  return (await source())
    .resize(size, size, { kernel: 'lanczos3', fit: 'contain', background: BACKGROUND })
    .flatten({ background: BACKGROUND })
    .png(PNG_OPTIONS)
    .toBuffer();
}

/**
 * A Windows ICO holding one PNG image per entry (PNG-in-ICO, read by every current browser and by
 * Windows since Vista). The container is 6 + 16 × n header bytes followed by the PNGs as they are.
 */
export function icoFromPngs(images: { size: number; png: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e); // width (0 = 256)
    header.writeUInt8(size >= 256 ? 0 : size, e + 1); // height
    header.writeUInt8(0, e + 2); // palette colours: none
    header.writeUInt8(0, e + 3); // reserved
    header.writeUInt16LE(1, e + 4); // colour planes
    header.writeUInt16LE(32, e + 6); // bits per pixel
    header.writeUInt32LE(png.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.png)]);
}

export const pngResponse = (data: Buffer) => new Response(data, { headers: { 'Content-Type': 'image/png' } });
