import { useState, useRef } from "react";
import { formatBytes } from "../../utils/fileUtils";
import ToolLayout from "../../components/ToolLayout";

function ImageMetadataViewer() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dimensions, setDimensions] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      loadImage(file);
    }
  }

  function loadImage(file) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    
    setLoading(true);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMetadata({});

    // Read Dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };

    // Parse EXIF metadata
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const buffer = event.target.result;
        const exifData = parseExif(buffer);
        setMetadata(exifData);
      } catch (err) {
        console.warn("EXIF parsing failed or not present", err);
      }
      setLoading(false);
    };
    
    if (file.type === "image/jpeg" || file.type === "image/jpg") {
      reader.readAsArrayBuffer(file);
    } else {
      setLoading(false);
    }
  }

  // Pure JavaScript JPEG EXIF Parser
  function parseExif(arrayBuffer) {
    const dataView = new DataView(arrayBuffer);
    
    // Check JPEG SOI marker
    if (dataView.getUint16(0) !== 0xFFD8) {
      return {}; // Not a valid JPEG
    }

    let offset = 2;
    const length = arrayBuffer.byteLength;
    
    while (offset < length - 2) {
      const marker = dataView.getUint16(offset);
      const markerLength = dataView.getUint16(offset + 2);
      
      // Look for APP1 (0xFFE1) EXIF marker
      if (marker === 0xFFE1) {
        // Confirm EXIF Header "Exif\0\0"
        const header = dataView.getUint32(offset + 4);
        if (header === 0x45786966) { // "Exif" in ASCII
          return readTIFFData(dataView, offset + 10, markerLength - 8);
        }
        break;
      }
      
      offset += 2 + markerLength;
    }
    return {};
  }

  function readTIFFData(view, startOffset, size) {
    const tags = {};
    // TIFF Header: Byte order (Intel: 0x4949 "II" little-endian, Motorola: 0x4D4D "MM" big-endian)
    const isLittleEndian = view.getUint16(startOffset) === 0x4949;
    
    // Check magic number (42)
    if (view.getUint16(startOffset + 2, isLittleEndian) !== 42) {
      return {};
    }

    const ifdOffset = view.getUint32(startOffset + 4, isLittleEndian);
    readIFD(view, startOffset, ifdOffset, isLittleEndian, tags);
    return tags;
  }

  // EXIF tag definitions
  const EXIF_TAGS = {
    0x010F: "make",         // Camera maker
    0x0110: "model",        // Camera model
    0x0112: "orientation",  // Orientation
    0x0132: "dateTime",     // Date and time
    0x013B: "artist",       // Artist/Creator
    0x829A: "exposureTime", // Shutter speed
    0x829D: "fNumber",      // Aperture F-stop
    0x8827: "iso",          // ISO speed rating
    0x9003: "dateTaken",    // Date taken
    0x920A: "focalLength",  // Focal length (mm)
    0x8825: "gpsInfo",      // GPS Info Offset
  };

  function readIFD(view, startOffset, ifdOffset, isLittleEndian, tags) {
    const entriesCount = view.getUint16(startOffset + ifdOffset, isLittleEndian);
    let entryOffset = startOffset + ifdOffset + 2;

    for (let i = 0; i < entriesCount; i++) {
      const tag = view.getUint16(entryOffset, isLittleEndian);
      const type = view.getUint16(entryOffset + 2, isLittleEndian);
      const count = view.getUint32(entryOffset + 4, isLittleEndian);
      const valOffset = view.getUint32(entryOffset + 8, isLittleEndian);

      if (EXIF_TAGS[tag]) {
        const tagName = EXIF_TAGS[tag];
        const value = readTagValue(view, startOffset, type, count, valOffset, isLittleEndian);
        
        if (tagName === "gpsInfo") {
          // Parse GPS block at specific offset
          readGPSInfo(view, startOffset, value, isLittleEndian, tags);
        } else {
          tags[tagName] = value;
        }
      }
      entryOffset += 12;
    }
  }

  function readGPSInfo(view, startOffset, gpsOffset, isLittleEndian, tags) {
    try {
      const gpsEntriesCount = view.getUint16(startOffset + gpsOffset, isLittleEndian);
      let entryOffset = startOffset + gpsOffset + 2;

      let latRef = "N";
      let lonRef = "E";
      let latParts = null;
      let lonParts = null;

      for (let i = 0; i < gpsEntriesCount; i++) {
        const tag = view.getUint16(entryOffset, isLittleEndian);
        const type = view.getUint16(entryOffset + 2, isLittleEndian);
        const count = view.getUint32(entryOffset + 4, isLittleEndian);
        const valOffset = view.getUint32(entryOffset + 8, isLittleEndian);

        if (tag === 1) latRef = readTagValue(view, startOffset, type, count, valOffset, isLittleEndian); // N or S
        if (tag === 2) latParts = readTagValue(view, startOffset, type, count, valOffset, isLittleEndian); // Degrees, Minutes, Seconds
        if (tag === 3) lonRef = readTagValue(view, startOffset, type, count, valOffset, isLittleEndian); // E or W
        if (tag === 4) lonParts = readTagValue(view, startOffset, type, count, valOffset, isLittleEndian); // Degrees, Minutes, Seconds
        
        entryOffset += 12;
      }

      if (latParts && lonParts) {
        const lat = convertGPSToDecimal(latParts, latRef);
        const lon = convertGPSToDecimal(lonParts, lonRef);
        tags.gps = { latitude: lat.toFixed(6), longitude: lon.toFixed(6) };
      }
    } catch (e) {
      console.warn("GPS extraction failed", e);
    }
  }

  function convertGPSToDecimal(parts, ref) {
    if (!Array.isArray(parts) || parts.length < 3) return 0;
    const decimal = parts[0] + parts[1] / 60 + parts[2] / 3600;
    return (ref === "S" || ref === "W") ? -decimal : decimal;
  }

  function readTagValue(view, startOffset, type, count, valOffset, isLittleEndian) {
    // 2 = ASCII string, 3 = Short (16-bit), 4 = Long (32-bit), 5 = Rational (2x 32-bit: numerator/denominator)
    if (type === 2) {
      // ASCII
      let strOffset = valOffset;
      // If string fits in the 4 bytes value offset, read it directly
      if (count > 4) {
        strOffset = startOffset + valOffset;
      } else {
        strOffset = startOffset + 8;
      }
      let str = "";
      for (let i = 0; i < count - 1; i++) {
        str += String.fromCharCode(view.getUint8(strOffset + i));
      }
      return str.trim();
    }
    
    if (type === 3) {
      return count === 1 ? valOffset : view.getUint16(startOffset + valOffset, isLittleEndian);
    }
    
    if (type === 4) {
      return count === 1 ? valOffset : view.getUint32(startOffset + valOffset, isLittleEndian);
    }
    
    if (type === 5) {
      // Rational
      const ptr = startOffset + valOffset;
      if (count === 1) {
        const num = view.getUint32(ptr, isLittleEndian);
        const den = view.getUint32(ptr + 4, isLittleEndian);
        return den === 0 ? 0 : num / den;
      } else {
        const arr = [];
        for (let i = 0; i < count; i++) {
          const num = view.getUint32(ptr + i * 8, isLittleEndian);
          const den = view.getUint32(ptr + i * 8 + 4, isLittleEndian);
          arr.push(den === 0 ? 0 : num / den);
        }
        return arr;
      }
    }
    return valOffset;
  }

  return (
    <ToolLayout
      toolId="image-metadata-viewer"
      title="Image Metadata Viewer"
      description="View EXIF metadata of your images online. Inspect camera model, exposure settings, ISO, date taken, and GPS locations client-side."
      path="/tools/image-metadata-viewer"
      category="image"
      categoryPath="/?cat=image"
    >
      <div className="tool-box">
        {!imageFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed var(--border)",
              borderRadius: "var(--radius)",
              padding: "50px 20px",
              textAlign: "center",
              cursor: "pointer",
              background: "rgba(255,255,255,0.02)",
              transition: "var(--transition)",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🔭</div>
            <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>Select Image to Inspect</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Upload any photo. JPEGs support full camera EXIF lookup.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="editor-grid">
            {/* Left side preview */}
            <div style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "300px",
            }}>
              <img
                src={previewUrl}
                alt={imageFile.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "350px",
                  boxShadow: "var(--shadow)",
                  borderRadius: "var(--radius-sm)",
                  objectFit: "contain",
                }}
              />
              <button
                className="btn-secondary"
                onClick={() => {
                  setImageFile(null);
                  setPreviewUrl("");
                  setDimensions(null);
                  setMetadata({});
                }}
                style={{ marginTop: "16px", padding: "8px 16px", fontSize: "13px" }}
              >
                🗑️ Upload Another Image
              </button>
            </div>

            {/* Right side Metadata tables */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxHeight: "480px", overflowY: "auto", paddingRight: "8px" }}>
              {loading && <p style={{ color: "var(--primary-light)", animation: "pulse 1.5s infinite" }}>🔄 Parsing metadata...</p>}
              
              {/* 1. File info */}
              <div>
                <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  📁 File Information
                </h4>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <tbody>
                    {[
                      { l: "Name", v: imageFile.name },
                      { l: "Format", v: imageFile.type || "Unknown" },
                      { l: "File Size", v: formatBytes(imageFile.size) },
                      { l: "Dimensions", v: dimensions ? `${dimensions.w} × ${dimensions.h} px` : "Loading..." },
                      { l: "Aspect Ratio", v: dimensions ? `${(dimensions.w / dimensions.h).toFixed(2)}:1` : "Loading..." },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                        <td style={{ padding: "8px 0", color: "var(--text-secondary)", fontWeight: 500, width: "120px" }}>{row.l}</td>
                        <td style={{ padding: "8px 0", color: "var(--text-primary)", wordBreak: "break-all" }}>{row.v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 2. EXIF data */}
              {Object.keys(metadata).length > 0 ? (
                <>
                  {/* Camera info */}
                  <div>
                    <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      📸 Camera & Lens
                    </h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                      <tbody>
                        {[
                          { l: "Camera Make", v: metadata.make || "N/A" },
                          { l: "Camera Model", v: metadata.model || "N/A" },
                          { l: "Date Taken", v: metadata.dateTaken || metadata.dateTime || "N/A" },
                          { l: "Shutter Speed", v: metadata.exposureTime ? `1/${Math.round(1 / metadata.exposureTime)}s` : "N/A" },
                          { l: "Aperture", v: metadata.fNumber ? `f/${metadata.fNumber.toFixed(1)}` : "N/A" },
                          { l: "ISO Rating", v: metadata.iso || "N/A" },
                          { l: "Focal Length", v: metadata.focalLength ? `${metadata.focalLength} mm` : "N/A" },
                        ].map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                            <td style={{ padding: "8px 0", color: "var(--text-secondary)", fontWeight: 500, width: "120px" }}>{row.l}</td>
                            <td style={{ padding: "8px 0", color: "var(--text-primary)" }}>{row.v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* GPS Coordinates */}
                  {metadata.gps && (
                    <div>
                      <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        📍 GPS Location
                      </h4>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", marginBottom: "12px" }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: "8px 0", color: "var(--text-secondary)", fontWeight: 500, width: "120px" }}>Latitude</td>
                            <td style={{ padding: "8px 0", color: "var(--text-primary)" }}>{metadata.gps.latitude}</td>
                          </tr>
                          <tr>
                            <td style={{ padding: "8px 0", color: "var(--text-secondary)", fontWeight: 500, width: "120px" }}>Longitude</td>
                            <td style={{ padding: "8px 0", color: "var(--text-primary)" }}>{metadata.gps.longitude}</td>
                          </tr>
                        </tbody>
                      </table>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${metadata.gps.latitude},${metadata.gps.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ fontSize: "12px", padding: "6px 12px", width: "100%", justifyContent: "center" }}
                      >
                        🗺️ View on Google Maps
                      </a>
                    </div>
                  )}
                </>
              ) : (
                !loading && (
                  <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px dashed var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "16px",
                    textAlign: "center",
                  }}>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      No EXIF camera metadata found. EXIF details are typically found in raw photographs taken with cameras or smartphones in JPG/JPEG formats.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default ImageMetadataViewer;
