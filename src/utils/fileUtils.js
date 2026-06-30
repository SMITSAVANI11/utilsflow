/**
 * Formats bytes into a human-readable file size string.
 * @param {number} bytes 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Packages multiple PNG buffers into a single Windows ICO container.
 * @param {Array<{width: number, height: number, buffer: ArrayBuffer}>} pngs 
 * @returns {Blob}
 */
export function createIcoFromPngs(pngs) {
  const headerSize = 6;
  const entrySize = 16;
  const numImages = pngs.length;
  
  const totalHeaderSize = headerSize + (entrySize * numImages);
  
  let totalSize = totalHeaderSize;
  for (const img of pngs) {
    totalSize += img.buffer.byteLength;
  }
  
  const icoBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(icoBuffer);
  const uint8 = new Uint8Array(icoBuffer);
  
  // Header: Reserved (0), Type (1 = ICO), Count
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, numImages, true);
  
  let currentOffset = totalHeaderSize;
  
  for (let i = 0; i < numImages; i++) {
    const img = pngs[i];
    const entryOffset = headerSize + (i * entrySize);
    
    // Width & Height (0 means 256)
    view.setUint8(entryOffset + 0, img.width >= 256 ? 0 : img.width);
    view.setUint8(entryOffset + 1, img.height >= 256 ? 0 : img.height);
    view.setUint8(entryOffset + 2, 0); // Palette
    view.setUint8(entryOffset + 3, 0); // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Planes
    view.setUint16(entryOffset + 6, 32, true); // BPP
    view.setUint32(entryOffset + 8, img.buffer.byteLength, true); // Size
    view.setUint32(entryOffset + 12, currentOffset, true); // Offset
    
    // Copy bytes
    uint8.set(new Uint8Array(img.buffer), currentOffset);
    currentOffset += img.buffer.byteLength;
  }
  
  return new Blob([icoBuffer], { type: "image/x-icon" });
}
