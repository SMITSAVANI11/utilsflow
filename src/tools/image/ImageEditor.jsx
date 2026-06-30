import { useState, useRef, useEffect } from "react";
import { formatBytes } from "../../utils/fileUtils";
import ToolLayout from "../../components/ToolLayout";

function ImageEditor({
  toolId,
  title,
  description,
  defaultTab = "crop", // "crop" | "resize" | "rotate" | "adjust"
}) {
  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Crop state (percentages)
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const [cropPreset, setCropPreset] = useState("free");

  // Resize state
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [originalDim, setOriginalDim] = useState({ w: 0, h: 0 });
  const [lockRatio, setLockRatio] = useState(true);

  // Rotate / Flip state
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Adjustments state
  const [brightness, setBrightness] = useState(100); // 0 - 200%
  const [contrast, setContrast] = useState(100);     // 0 - 200%
  const [saturation, setSaturation] = useState(100); // 0 - 200%
  const [blur, setBlur] = useState(0);               // 0 - 20px
  const [grayscale, setGrayscale] = useState(0);     // 0 - 100%
  const [sepia, setSepia] = useState(0);             // 0 - 100%
  const [sharpen, setSharpen] = useState(0);         // 0 - 100% (custom convolution)

  const [downloadFormat, setDownloadFormat] = useState("png");
  const [downloadQuality, setDownloadQuality] = useState(0.9);

  const fileInputRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const originalImageRef = useRef(null);

  // Handle image upload
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      loadImage(file);
    }
  }

  function loadImage(file) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    
    const url = URL.createObjectURL(file);
    setImageFile(file);
    setPreviewUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      originalImageRef.current = img;
      setOriginalDim({ w: img.naturalWidth, h: img.naturalHeight });
      setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
      // Reset editing states
      setCrop({ x: 0, y: 0, w: 100, h: 100 });
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setBlur(0);
      setGrayscale(0);
      setSepia(0);
      setSharpen(0);
    };
  }

  // Draw image to preview canvas with editing options applied
  useEffect(() => {
    if (!previewUrl || !originalImageRef.current || !previewCanvasRef.current) return;
    drawPreview();
  }, [previewUrl, crop, rotation, flipH, flipV, brightness, contrast, saturation, blur, grayscale, sepia, sharpen, dimensions]);

  function drawPreview() {
    const img = originalImageRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");

    // Calculate crop coordinates based on original size
    const cropX = (crop.x / 100) * img.naturalWidth;
    const cropY = (crop.y / 100) * img.naturalHeight;
    const cropW = (crop.w / 100) * img.naturalWidth;
    const cropH = (crop.h / 100) * img.naturalHeight;

    // Resizing dimensions
    let targetW = dimensions.w || cropW;
    let targetH = dimensions.h || cropH;

    // Set canvas dimensions
    // Swap width and height if rotated 90 or 270 degrees
    const is90or270 = rotation === 90 || rotation === 270;
    canvas.width = is90or270 ? targetH : targetW;
    canvas.height = is90or270 ? targetW : targetH;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply rotation & flip transforms
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Rotation
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Scale for flips
    const scaleX = flipH ? -1 : 1;
    const scaleY = flipV ? -1 : 1;
    ctx.scale(scaleX, scaleY);

    // Native filters (CSS-style)
    ctx.filter = `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
      blur(${blur}px)
      grayscale(${grayscale}%)
      sepia(${sepia}%)
    `;

    // Draw the cropped section
    ctx.drawImage(
      img,
      cropX, cropY, cropW, cropH, // Source crop rectangle
      -targetW / 2, -targetH / 2, targetW, targetH // Destination placement
    );

    ctx.restore();

    // Custom Sharpen Convolution Filter
    if (sharpen > 0) {
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        sharpenImageData(imageData, sharpen / 100);
        ctx.putImageData(imageData, 0, 0);
      } catch (e) {
        console.error("Local context error, failed sharpen", e);
      }
    }
  }

  // 3x3 Sharpen Kernel convolution
  function sharpenImageData(imageData, amount) {
    const w = imageData.width;
    const h = imageData.height;
    const src = imageData.data;
    const dst = new Uint8ClampedArray(src.length);
    dst.set(src); // copy standard channels

    const a = amount * 1.5; // Scale sharpness weight
    const b = 1 + 4 * a;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        for (let c = 0; c < 3; c++) { // R, G, B
          const val =
            b * src[idx + c] -
            a * (
              src[((y - 1) * w + x) * 4 + c] +
              src[((y + 1) * w + x) * 4 + c] +
              src[(y * w + x - 1) * 4 + c] +
              src[(y * w + x + 1) * 4 + c]
            );
          dst[idx + c] = Math.min(255, Math.max(0, val));
        }
      }
    }
    imageData.data.set(dst);
  }

  // Preset aspect ratio calculations for Crop
  function handlePresetChange(preset) {
    setCropPreset(preset);
    if (preset === "free") {
      setCrop({ x: 0, y: 0, w: 100, h: 100 });
      return;
    }

    let [ratioW, ratioH] = preset.split(":").map(Number);
    const imgAspect = originalDim.w / originalDim.h;
    const targetAspect = ratioW / ratioH;

    let w = 100;
    let h = 100;
    let x = 0;
    let y = 0;

    if (imgAspect > targetAspect) {
      // Image is wider than target aspect ratio
      w = (targetAspect / imgAspect) * 100;
      x = (100 - w) / 2;
    } else {
      // Image is taller than target aspect ratio
      h = (imgAspect / targetAspect) * 100;
      y = (100 - h) / 2;
    }

    setCrop({ x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) });
  }

  // Handle dimension changes for Resize (keeps ratio if locked)
  function handleDimensionChange(key, value) {
    const val = parseInt(value) || 0;
    if (lockRatio && originalDim.w > 0) {
      if (key === "w") {
        const ratio = originalDim.h / originalDim.w;
        setDimensions({ w: val, h: Math.round(val * ratio) });
      } else {
        const ratio = originalDim.w / originalDim.h;
        setDimensions({ w: Math.round(val * ratio), h: val });
      }
    } else {
      setDimensions(prev => ({ ...prev, [key]: val }));
    }
  }

  function downloadResult() {
    if (!previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    
    let mimeType = `image/${downloadFormat}`;
    if (downloadFormat === "jpeg") mimeType = "image/jpeg";

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const ext = downloadFormat === "jpeg" ? "jpg" : downloadFormat;
      const downloadName = (imageFile?.name.substring(0, imageFile.name.lastIndexOf(".")) || "edited_image") + `_edited.${ext}`;
      
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, mimeType, downloadFormat === "png" ? undefined : downloadQuality);
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
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎨</div>
            <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>Select or Drop an Image</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Upload any JPG, PNG, WebP, SVG, BMP, or GIF to edit
            </p>
          </div>
        ) : (
          <div>
            {/* Toolbar Tabs */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid var(--border)",
              marginBottom: "20px",
              gap: "8px",
              flexWrap: "wrap",
            }}>
              {[
                { id: "crop", label: "Crop Box", emoji: "✂️" },
                { id: "resize", label: "Resize", emoji: "📐" },
                { id: "rotate", label: "Rotate & Flip", emoji: "🔄" },
                { id: "adjust", label: "Adjustments", emoji: "🎨" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "10px 16px",
                    background: activeTab === tab.id ? "var(--primary-glow-heavy)" : "none",
                    border: "none",
                    borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "none",
                    color: activeTab === tab.id ? "var(--primary-light)" : "var(--text-secondary)",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {tab.emoji} {tab.label}
                </button>
              ))}
            </div>

            {/* Layout Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              gap: "24px",
            }} className="editor-grid">
              
              {/* Left Side: Preview Canvas */}
              <div style={{
                background: "rgba(0,0,0,0.2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "350px",
                position: "relative",
              }}>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "450px",
                    boxShadow: "var(--shadow)",
                    borderRadius: "4px",
                    objectFit: "contain",
                  }}
                />

                {/* Simulated Crop Bounding Box overlay */}
                {activeTab === "crop" && (
                  <div style={{
                    position: "absolute",
                    top: `calc(50% - ${(previewCanvasRef.current?.offsetHeight || 0) / 2}px + ${crop.y * (previewCanvasRef.current?.offsetHeight || 0) / 100}px)`,
                    left: `calc(50% - ${(previewCanvasRef.current?.offsetWidth || 0) / 2}px + ${crop.x * (previewCanvasRef.current?.offsetWidth || 0) / 100}px)`,
                    width: `${crop.w * (previewCanvasRef.current?.offsetWidth || 0) / 100}px`,
                    height: `${crop.h * (previewCanvasRef.current?.offsetHeight || 0) / 100}px`,
                    border: "2px dashed #a78bfa",
                    pointerEvents: "none",
                    boxSizing: "border-box",
                  }}>
                    <div style={{ position: "absolute", width: "8px", height: "8px", background: "#a78bfa", top: "-4px", left: "-4px" }} />
                    <div style={{ position: "absolute", width: "8px", height: "8px", background: "#a78bfa", top: "-4px", right: "-4px" }} />
                    <div style={{ position: "absolute", width: "8px", height: "8px", background: "#a78bfa", bottom: "-4px", left: "-4px" }} />
                    <div style={{ position: "absolute", width: "8px", height: "8px", background: "#a78bfa", bottom: "-4px", right: "-4px" }} />
                  </div>
                )}
              </div>

              {/* Right Side: Control Panels */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* 1. Crop box controls */}
                {activeTab === "crop" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label className="label" htmlFor="crop-aspect">Aspect Ratio Preset</label>
                      <select
                        id="crop-aspect"
                        className="input-field"
                        value={cropPreset}
                        onChange={e => handlePresetChange(e.target.value)}
                      >
                        <option value="free">Free Form (No Preset)</option>
                        <option value="1:1">1:1 (Square favicon)</option>
                        <option value="16:9">16:9 (HD Landscape)</option>
                        <option value="4:3">4:3 (Standard Video)</option>
                        <option value="9:16">9:16 (Portrait Story)</option>
                      </select>
                    </div>

                    <div>
                      <label className="label" htmlFor="crop-w-slider">Crop Width: {crop.w}%</label>
                      <input
                        id="crop-w-slider"
                        type="range"
                        min="10"
                        max="100"
                        value={crop.w}
                        onChange={e => {
                          const w = Number(e.target.value);
                          setCrop(prev => ({ ...prev, w, x: Math.min(prev.x, 100 - w) }));
                        }}
                      />
                    </div>

                    <div>
                      <label className="label" htmlFor="crop-h-slider">Crop Height: {crop.h}%</label>
                      <input
                        id="crop-h-slider"
                        type="range"
                        min="10"
                        max="100"
                        value={crop.h}
                        onChange={e => {
                          const h = Number(e.target.value);
                          setCrop(prev => ({ ...prev, h, y: Math.min(prev.y, 100 - h) }));
                        }}
                      />
                    </div>

                    <div>
                      <label className="label" htmlFor="crop-x-slider">X Position: {crop.x}%</label>
                      <input
                        id="crop-x-slider"
                        type="range"
                        min="0"
                        max={100 - crop.w}
                        value={crop.x}
                        onChange={e => setCrop(prev => ({ ...prev, x: Number(e.target.value) }))}
                      />
                    </div>

                    <div>
                      <label className="label" htmlFor="crop-y-slider">Y Position: {crop.y}%</label>
                      <input
                        id="crop-y-slider"
                        type="range"
                        min="0"
                        max={100 - crop.h}
                        value={crop.y}
                        onChange={e => setCrop(prev => ({ ...prev, y: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                )}

                {/* 2. Resize controls */}
                {activeTab === "resize" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label className="label" htmlFor="resize-w">Width (px)</label>
                      <input
                        id="resize-w"
                        type="number"
                        className="input-field"
                        value={dimensions.w}
                        onChange={e => handleDimensionChange("w", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="label" htmlFor="resize-h">Height (px)</label>
                      <input
                        id="resize-h"
                        type="number"
                        className="input-field"
                        value={dimensions.h}
                        onChange={e => handleDimensionChange("h", e.target.value)}
                      />
                    </div>

                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={lockRatio}
                        onChange={e => setLockRatio(e.target.checked)}
                        style={{ accentColor: "var(--primary)" }}
                      />
                      Lock Aspect Ratio
                    </label>

                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      Original size: {originalDim.w} × {originalDim.h} px
                    </p>
                  </div>
                )}

                {/* 3. Rotate & Flip controls */}
                {activeTab === "rotate" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <button className="btn-secondary" onClick={() => setRotation(r => (r - 90 + 360) % 360)} style={{ padding: "10px", fontSize: "13px" }}>
                        ↪️ Rotate -90°
                      </button>
                      <button className="btn-secondary" onClick={() => setRotation(r => (r + 90) % 360)} style={{ padding: "10px", fontSize: "13px" }}>
                        ↩️ Rotate +90°
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <button
                        className={`btn-secondary ${flipH ? "btn-primary" : ""}`}
                        onClick={() => setFlipH(f => !f)}
                        style={{ padding: "10px", fontSize: "13px", justifyContent: "center" }}
                      >
                        ↔️ Flip Horiz
                      </button>
                      <button
                        className={`btn-secondary ${flipV ? "btn-primary" : ""}`}
                        onClick={() => setFlipV(f => !f)}
                        style={{ padding: "10px", fontSize: "13px", justifyContent: "center" }}
                      >
                        ↕️ Flip Vert
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Adjustments sliders */}
                {activeTab === "adjust" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "350px", overflowY: "auto", paddingRight: "8px" }}>
                    <div>
                      <label className="label" htmlFor="brightness-slider">Brightness: {brightness}%</label>
                      <input id="brightness-slider" type="range" min="0" max="200" value={brightness} onChange={e => setBrightness(Number(e.target.value))} />
                    </div>

                    <div>
                      <label className="label" htmlFor="contrast-slider">Contrast: {contrast}%</label>
                      <input id="contrast-slider" type="range" min="0" max="200" value={contrast} onChange={e => setContrast(Number(e.target.value))} />
                    </div>

                    <div>
                      <label className="label" htmlFor="saturation-slider">Saturation: {saturation}%</label>
                      <input id="saturation-slider" type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} />
                    </div>

                    <div>
                      <label className="label" htmlFor="blur-slider">Blur: {blur}px</label>
                      <input id="blur-slider" type="range" min="0" max="20" value={blur} onChange={e => setBlur(Number(e.target.value))} />
                    </div>

                    <div>
                      <label className="label" htmlFor="sharpen-slider">Sharpen: {sharpen}%</label>
                      <input id="sharpen-slider" type="range" min="0" max="100" value={sharpen} onChange={e => setSharpen(Number(e.target.value))} />
                    </div>

                    <div>
                      <label className="label" htmlFor="grayscale-slider">Grayscale: {grayscale}%</label>
                      <input id="grayscale-slider" type="range" min="0" max="100" value={grayscale} onChange={e => setGrayscale(Number(e.target.value))} />
                    </div>

                    <div>
                      <label className="label" htmlFor="sepia-slider">Sepia: {sepia}%</label>
                      <input id="sepia-slider" type="range" min="0" max="100" value={sepia} onChange={e => setSepia(Number(e.target.value))} />
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }} />

                {/* Save Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <label className="label" htmlFor="dl-format">Format</label>
                      <select id="dl-format" className="input-field" value={downloadFormat} onChange={e => setDownloadFormat(e.target.value)} style={{ padding: "8px 12px", fontSize: "13px" }}>
                        <option value="png">PNG</option>
                        <option value="jpeg">JPG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                    {downloadFormat !== "png" && (
                      <div style={{ flex: 1.5 }}>
                        <label className="label" htmlFor="dl-quality">Quality: {Math.round(downloadQuality * 100)}%</label>
                        <input id="dl-quality" type="range" min="0.5" max="1.0" step="0.05" value={downloadQuality} onChange={e => setDownloadQuality(Number(e.target.value))} />
                      </div>
                    )}
                  </div>

                  <button className="btn-primary" onClick={downloadResult} style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
                    💾 Save Edited Image
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl(null);
                    }}
                    style={{ width: "100%", justifyContent: "center", padding: "8px", fontSize: "13px" }}
                  >
                    🗑️ Upload Different Image
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default ImageEditor;
