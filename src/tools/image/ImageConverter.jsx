import { useState, useRef } from "react";
import { formatBytes, createIcoFromPngs } from "../../utils/fileUtils";
import ToolLayout from "../../components/ToolLayout";

function ImageConverter({
  toolId,
  title,
  description,
  allowedFrom = "any", // "any", "png", "webp", etc.
  defaultTo = "png",   // "png", "jpeg", "webp", "ico"
}) {
  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState(defaultTo);
  const [quality, setQuality] = useState(0.85);
  const [converting, setConverting] = useState(false);
  const [icoSizes, setIcoSizes] = useState({
    16: true,
    32: true,
    48: true,
    128: true,
    256: false,
  });

  const fileInputRef = useRef(null);

  // Filter allowed file formats based on props
  const acceptedTypes = allowedFrom === "any" 
    ? "image/png, image/jpeg, image/webp, image/gif, image/svg+xml, image/bmp, image/x-icon"
    : `image/${allowedFrom}`;

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    addFiles(selected);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    const selected = Array.from(e.dataTransfer.files || []).filter(file => file.type.startsWith("image/"));
    addFiles(selected);
  }

  function addFiles(selectedFiles) {
    const newFiles = selectedFiles.map(file => {
      // Check if file type matches allowedFrom if restricted
      if (allowedFrom !== "any" && !file.type.endsWith(allowedFrom) && !file.name.toLowerCase().endsWith(`.${allowedFrom}`)) {
        return null;
      }
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        status: "idle", // "idle" | "converting" | "done" | "error"
        progress: 0,
        previewUrl: URL.createObjectURL(file),
        convertedUrl: null,
        convertedSize: null,
        convertedName: null,
        error: null,
      };
    }).filter(Boolean);

    setFiles(prev => [...prev, ...newFiles]);
  }

  function removeFile(id) {
    setFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target) {
        if (target.previewUrl) URL.revokeObjectURL(target.previewUrl);
        if (target.convertedUrl) URL.revokeObjectURL(target.convertedUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  }

  function clearAll() {
    files.forEach(f => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl);
    });
    setFiles([]);
  }

  async function convertSingleFile(fileObj) {
    return new Promise((resolve) => {
      updateFileState(fileObj.id, { status: "converting", progress: 30 });

      const img = new Image();
      img.src = fileObj.previewUrl;
      img.onload = async () => {
        try {
          updateFileState(fileObj.id, { progress: 60 });
          
          if (outputFormat === "ico") {
            // ICO Conversion: Bundle multiple sizes
            const sizesToGenerate = Object.keys(icoSizes).filter(s => icoSizes[s]).map(Number);
            if (sizesToGenerate.length === 0) {
              throw new Error("Select at least one size for ICO");
            }
            
            const pngParts = [];
            for (const size of sizesToGenerate) {
              const canvas = document.createElement("canvas");
              canvas.width = size;
              canvas.height = size;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, size, size);
              
              const sizeBlob = await new Promise(r => canvas.toBlob(r, "image/png"));
              const sizeBuffer = await sizeBlob.arrayBuffer();
              pngParts.push({ width: size, height: size, buffer: sizeBuffer });
            }
            
            const icoBlob = createIcoFromPngs(pngParts);
            const convertedUrl = URL.createObjectURL(icoBlob);
            const convertedName = fileObj.name.substring(0, fileObj.name.lastIndexOf(".")) + ".ico";
            
            updateFileState(fileObj.id, {
              status: "done",
              progress: 100,
              convertedUrl,
              convertedSize: icoBlob.size,
              convertedName,
            });
            resolve();
          } else {
            // Standard conversions: png, jpeg, webp
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            let mimeType = `image/${outputFormat}`;
            if (outputFormat === "jpeg") mimeType = "image/jpeg";
            
            canvas.toBlob((blob) => {
              if (!blob) {
                updateFileState(fileObj.id, { status: "error", error: "Conversion failed" });
                resolve();
                return;
              }
              
              const convertedUrl = URL.createObjectURL(blob);
              const extension = outputFormat === "jpeg" ? "jpg" : outputFormat;
              const convertedName = fileObj.name.substring(0, fileObj.name.lastIndexOf(".")) + `.${extension}`;

              updateFileState(fileObj.id, {
                status: "done",
                progress: 100,
                convertedUrl,
                convertedSize: blob.size,
                convertedName,
              });
              resolve();
            }, mimeType, outputFormat === "png" ? undefined : quality);
          }
        } catch (err) {
          updateFileState(fileObj.id, { status: "error", error: err.message || "Conversion failed" });
          resolve();
        }
      };

      img.onerror = () => {
        updateFileState(fileObj.id, { status: "error", error: "Failed to load image" });
        resolve();
      };
    });
  }

  function updateFileState(id, updates) {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }

  async function convertAll() {
    if (files.length === 0) return;
    setConverting(true);
    
    // Process sequentially to keep browser responsive
    for (const f of files) {
      if (f.status !== "done") {
        await convertSingleFile(f);
      }
    }
    
    setConverting(false);
  }

  function downloadFile(fileObj) {
    if (!fileObj.convertedUrl) return;
    const a = document.createElement("a");
    a.href = fileObj.convertedUrl;
    a.download = fileObj.convertedName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function downloadAll() {
    files.forEach(f => {
      if (f.status === "done") {
        downloadFile(f);
      }
    });
  }

  return (
    <ToolLayout
      toolId={toolId}
      title={title}
      description={description}
      path={`/tools/${toolId}`}
      category="image"
      categoryPath="/?cat=image"
    >
      <div className="tool-box">
        {/* Upload Zone */}
        <div
          id="dropzone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: "2px dashed var(--border)",
            borderRadius: "var(--radius)",
            padding: "40px 20px",
            textAlign: "center",
            cursor: "pointer",
            background: "rgba(255,255,255,0.02)",
            transition: "var(--transition)",
            marginBottom: "24px",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <input
            type="file"
            id="file-input"
            ref={fileInputRef}
            multiple
            accept={acceptedTypes}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📸</div>
          <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>Drag & drop files here</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Or click to upload. Supports {allowedFrom === "any" ? "PNG, JPG, WebP, SVG, GIF, BMP" : allowedFrom.toUpperCase()}
          </p>
        </div>

        {/* Options Panel */}
        {files.length > 0 && (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "16px",
            marginBottom: "24px",
          }}>
            <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              🛠️ Conversion Settings
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              {/* Output format selector */}
              <div>
                <label className="label" htmlFor="output-format">Convert To</label>
                <select
                  id="output-format"
                  className="input-field"
                  value={outputFormat}
                  onChange={e => setOutputFormat(e.target.value)}
                  style={{ background: "var(--bg-dark)", border: "1px solid var(--border)" }}
                >
                  <option value="png">PNG (Lossless)</option>
                  <option value="jpeg">JPG (Compressed)</option>
                  <option value="webp">WebP (Next-Gen)</option>
                  <option value="ico">ICO (Favicon/Windows Icon)</option>
                </select>
              </div>

              {/* Quality slider for jpeg/webp */}
              {(outputFormat === "jpeg" || outputFormat === "webp") && (
                <div>
                  <label className="label" htmlFor="quality-slider">Quality: {Math.round(quality * 100)}%</label>
                  <input
                    id="quality-slider"
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={e => setQuality(parseFloat(e.target.value))}
                    style={{ marginTop: "12px" }}
                  />
                </div>
              )}

              {/* Multi-size checkbox selector for ICO */}
              {outputFormat === "ico" && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="label">Included Favicon Sizes</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
                    {[16, 32, 48, 128, 256].map(size => (
                      <label key={size} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={icoSizes[size]}
                          onChange={e => setIcoSizes(prev => ({ ...prev, [size]: e.target.checked }))}
                          style={{ accentColor: "var(--primary)" }}
                        />
                        {size} × {size}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                Selected: {files.length} file{files.length !== 1 ? "s" : ""}
              </span>
              <button className="btn-danger" onClick={clearAll} style={{ fontSize: "12px", padding: "6px 12px" }}>
                🗑️ Clear All
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {files.map(f => (
                <div
                  key={f.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "12px",
                  }}
                >
                  {/* Thumbnail Preview */}
                  <img
                    src={f.previewUrl}
                    alt={f.name}
                    style={{
                      width: "48px",
                      height: "48px",
                      objectFit: "cover",
                      borderRadius: "var(--radius-xs)",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  />

                  {/* Name and File Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {f.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {formatBytes(f.size)}
                      {f.convertedSize && ` → ${formatBytes(f.convertedSize)}`}
                    </p>
                  </div>

                  {/* Conversion Status / Progress */}
                  <div style={{ textAlign: "right" }}>
                    {f.status === "converting" && (
                      <span style={{ fontSize: "13px", color: "var(--primary-light)", animation: "pulse 1.5s infinite" }}>
                        Converting ({f.progress}%)
                      </span>
                    )}
                    {f.status === "error" && (
                      <span style={{ fontSize: "13px", color: "var(--danger)" }}>
                        ❌ {f.error || "Failed"}
                      </span>
                    )}
                    {f.status === "done" && (
                      <button
                        className="btn-secondary"
                        onClick={() => downloadFile(f)}
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        💾 Download
                      </button>
                    )}
                    {f.status === "idle" && (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Ready</span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(f.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      fontSize: "16px",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                    aria-label={`Remove ${f.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Action Buttons */}
        {files.length > 0 && (
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              className="btn-primary"
              onClick={convertAll}
              disabled={converting}
              style={{ flex: 1, justifyContent: "center" }}
            >
              {converting ? "🔄 Converting..." : "⚡ Convert All"}
            </button>
            {files.some(f => f.status === "done") && (
              <button
                className="btn-secondary"
                onClick={downloadAll}
                style={{ flex: 1, justifyContent: "center" }}
              >
                📥 Download All
              </button>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default ImageConverter;
