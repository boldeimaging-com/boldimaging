/**
 * Width and height of an uploaded JPEG, PNG or WebP, read from its header.
 *
 * The portfolio page sets width/height on its hero <img> so the layout does
 * not jump while it loads, so an upload has to arrive with real dimensions.
 * Reading them here keeps that from depending on the admin's browser.
 * Returns null for anything else, which the admin reports as unsupported.
 */
export interface ImageInfo {
  width: number;
  height: number;
  type: 'image/jpeg' | 'image/png' | 'image/webp';
  ext: 'jpg' | 'png' | 'webp';
}

export function imageInfo(buf: ArrayBuffer): ImageInfo | null {
  const b = new Uint8Array(buf);
  const v = new DataView(buf);
  const ascii = (at: number, len: number) => String.fromCharCode(...b.subarray(at, at + len));

  // PNG: signature, then the IHDR chunk's width and height, big-endian.
  if (b.length >= 24 && b[0] === 0x89 && ascii(1, 3) === 'PNG') {
    return { width: v.getUint32(16), height: v.getUint32(20), type: 'image/png', ext: 'png' };
  }

  // JPEG: walk the segments to the first start-of-frame marker.
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      if (marker === 0xff) {
        i++;
        continue;
      }
      const len = v.getUint16(i + 2);
      // SOF0..SOF15, except DHT (C4), JPG (C8) and DAC (CC), which share the range.
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: v.getUint16(i + 5), width: v.getUint16(i + 7), type: 'image/jpeg', ext: 'jpg' };
      }
      i += 2 + len;
    }
    return null;
  }

  // WebP: RIFF container holding a lossy (VP8), lossless (VP8L) or extended (VP8X) image.
  if (b.length >= 30 && ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
    const chunk = ascii(12, 4);
    const info = (width: number, height: number): ImageInfo => ({ width, height, type: 'image/webp', ext: 'webp' });
    if (chunk === 'VP8 ') return info(v.getUint16(26, true) & 0x3fff, v.getUint16(28, true) & 0x3fff);
    if (chunk === 'VP8L') {
      const bits = v.getUint32(21, true);
      return info((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1);
    }
    if (chunk === 'VP8X') {
      const w = b[24] | (b[25] << 8) | (b[26] << 16);
      const h = b[27] | (b[28] << 8) | (b[29] << 16);
      return info(w + 1, h + 1);
    }
  }
  return null;
}
