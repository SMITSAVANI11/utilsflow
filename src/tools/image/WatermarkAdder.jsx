import { useState, useRef, useEffect } from "react";
import ToolLayout from "../../components/ToolLayout";

function WatermarkAdder() {
  const [baseImage, setBaseImage] = useState(null);
  const [baseImageUrl, setBaseImageUrl] = useState("");
  const [baseDim, setBaseDim] = useState({ w: 0, h: 0 });

  // Watermark Type: "text" | "image"
  const [wmType, setWmType] = useState("text");
  
  // Text Watermark Options
  const [wmText, setWmText] = useState("CONFIDENTIAL");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(36);
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [textOpacity, setTextOpacity] = useState(0.4);

  // Image Watermark Options
  const [wmImage, setWmImage] = useState(null);
  const [wmImageUrl, setWmImageUrl] = useState("");
  const [wmScale, setWmScale] = useState(20); // % of base image width
  const [imageOpacity, setImageOpacity] = useState(0.5);

  // General Positioning
  const [position, setPosition] = useState("center"); // "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right" | "custom"
  const [customX, setCustomX] = useState(10); // %
  const [customY, setCustomY] = useState(10); // %

  const fileInputRef = useRef(null);
  const wmFileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (baseImageUrl) URL.revokeObjectURL(baseImageUrl);
      if (wmImageUrl) URL.revokeObjectURL(wmImageUrl);
    };
  }, [baseImageUrl, wmImageUrl]);

  function handleBaseFile(e) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (baseImageUrl) URL.revokeObjectURL(baseImageUrl);
      const url = URL.createObjectURL(file);
      setBaseImage(file);
      setBaseImageUrl(url);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        setBaseDim({ w: img.naturalWidth, h: img.naturalHeight });
      };
    }
  }

  function handleWmFile(e) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (wmImageUrl) URL.revokeObjectURL(wmImageUrl);
      const url = URL.createObjectURL(file);
      
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setWmImage(img);
        setWmImageUrl(url);
      };
    }
  }

  // Draw base image and watermark
  useEffect(() => {
    if (!baseImageUrl || !canvasRef.current) return;

    const baseImgEl = new Image();
    baseImgEl.src = baseImageUrl;
    baseImgEl.onload = () => {
      drawCanvas(baseImgEl);
    };
  }, [baseImageUrl, wmType, wmText, fontColor, fontSize, fontFamily, textOpacity, wmImage, wmImageUrl, wmScale, imageOpacity, position, customX, customY]);

  function drawCanvas(baseImgEl) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = baseImgEl.naturalWidth;
    canvas.height = baseImgEl.naturalHeight;

    // Draw original image
    ctx.drawImage(baseImgEl, 0, 0);

    // Calculate Coordinates
    let x = 0;
    let y = 0;
    const margin = 20;

    if (wmType === "text") {
      ctx.save();
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = fontColor;
      ctx.globalAlpha = textOpacity;
      ctx.textBaseline = "middle";

      const textWidth = ctx.measureText(wmText).width;
      const textHeight = fontSize;

      if (position === "center") {
        x = canvas.width / 2 - textWidth / 2;
        y = canvas.height / 2;
      } else if (position === "top-left") {
        x = margin;
        y = margin + textHeight / 2;
      } else if (position === "top-right") {
        x = canvas.width - textWidth - margin;
        y = margin + textHeight / 2;
      } else if (position === "bottom-left") {
        x = margin;
        y = canvas.height - textHeight - margin;
      } else if (position === "bottom-right") {
        x = canvas.width - textWidth - margin;
        y = canvas.height - textHeight - margin;
      } else {
        x = (customX / 100) * canvas.width;
        y = (customY / 100) * canvas.height;
      }

      ctx.fillText(wmText, x, y);
      ctx.restore();
    } else if (wmType === "image" && wmImage) {
      ctx.save();
      ctx.globalAlpha = imageOpacity;

      // Scale watermark relative to base image width
      const targetWidth = (wmScale / 100) * canvas.width;
      const aspect = wmImage.naturalHeight / wmImage.naturalWidth;
      const targetHeight = targetWidth * aspect;

      if (position === "center") {
        x = canvas.width / 2 - targetWidth / 2;
        y = canvas.height / 2 - targetHeight / 2;
      } else if (position === "top-left") {
        x = margin;
        y = margin;
      } else if (position === "top-right") {
        x = canvas.width - targetWidth - margin;
        y = margin;
      } else if (position === "bottom-left") {
        x = margin;
        y = canvas.height - targetHeight - margin;
      } else if (position === "bottom-right") {
        x = canvas.width - targetWidth - margin;
        y = canvas.height - targetHeight - margin;
      } else {
        x = (customX / 100) * canvas.width;
        y = (customY / 100) * canvas.height;
      }

      ctx.drawImage(wmImage, x, y, targetWidth, targetHeight);
      ctx.restore();
    }
  }

  function downloadImage() {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = (baseImage?.name.substring(0, baseImage.name.lastIndexOf(".")) || "watermarked") + "_wm.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <ToolLayout
      toolId="watermark-adder"
      title="Watermark Adder"
      description="Add customizable text or image watermarks to your photos. Adjust placement, size, and transparency client-side."
      path="/tools/watermark-adder"
      category="image"
      categoryPath="/?cat=image"
    >
      <div className="tool-box">
        {!baseImage ? (
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
              onChange={handleBaseFile}
              style={{ display: "none" }}
            />
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🔒</div>
            <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>Select main image</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Upload any JPG, PNG, WebP or other image to protect
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }} className="editor-grid">
            {/* Live Canvas Preview */}
            <div style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "350px",
            }}>
              <canvas
                ref={canvasRef}
                style={{
                  maxWidth: "100%",
                  maxHeight: "450px",
                  boxShadow: "var(--shadow)",
                  borderRadius: "4px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Sidebar Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Type selection */}
              <div>
                <label className="label">Watermark Type</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className={`btn-secondary ${wmType === "text" ? "btn-primary" : ""}`}
                    onClick={() => setWmType("text")}
                    style={{ flex: 1, padding: "8px", fontSize: "13px", justifyContent: "center" }}
                  >
                    ✍️ Text
                  </button>
                  <button
                    className={`btn-secondary ${wmType === "image" ? "btn-primary" : ""}`}
                    onClick={() => setWmType("image")}
                    style={{ flex: 1, padding: "8px", fontSize: "13px", justifyContent: "center" }}
                  >
                    🖼️ Logo Image
                  </button>
                </div>
              </div>

              {/* Text options */}
              {wmType === "text" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label className="label" htmlFor="wm-text-input">Watermark Text</label>
                    <input
                      id="wm-text-input"
                      type="text"
                      className="input-field"
                      value={wmText}
                      onChange={e => setWmText(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div>
                      <label className="label" htmlFor="text-color">Color</label>
                      <input
                        id="text-color"
                        type="color"
                        value={fontColor}
                        onChange={e => setFontColor(e.target.value)}
                        style={{ width: "100%", height: "42px", padding: 0, border: "1px solid var(--border)", background: "none", cursor: "pointer", borderRadius: "var(--radius-sm)" }}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="font-size">Size (px)</label>
                      <input
                        id="font-size"
                        type="number"
                        className="input-field"
                        value={fontSize}
                        onChange={e => setFontSize(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="font-family">Font Family</label>
                    <select
                      id="font-family"
                      className="input-field"
                      value={fontFamily}
                      onChange={e => setFontFamily(e.target.value)}
                    >
                      <option value="sans-serif">Sans-Serif</option>
                      <option value="serif">Serif</option>
                      <option value="monospace">Monospace</option>
                      <option value="Impact">Impact</option>
                      <option value="Georgia">Georgia</option>
                    </select>
                  </div>

                  <div>
                    <label className="label" htmlFor="text-opacity-range">Opacity: {Math.round(textOpacity * 100)}%</label>
                    <input
                      id="text-opacity-range"
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={textOpacity}
                      onChange={e => setTextOpacity(parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              )}

              {/* Logo options */}
              {wmType === "image" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {!wmImage ? (
                    <button
                      className="btn-secondary"
                      onClick={() => wmFileInputRef.current?.click()}
                      style={{ width: "100%", justifyContent: "center", borderStyle: "dashed" }}
                    >
                      📁 Upload Logo PNG
                      <input
                        type="file"
                        ref={wmFileInputRef}
                        accept="image/*"
                        onChange={handleWmFile}
                        style={{ display: "none" }}
                      />
                    </button>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "8px", borderRadius: "var(--radius-sm)" }}>
                        <img src={wmImageUrl} alt="logo" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>Watermark Loaded</span>
                        <button onClick={() => setWmImage(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>✕</button>
                      </div>

                      <div>
                        <label className="label" htmlFor="wm-scale">Scale: {wmScale}%</label>
                        <input id="wm-scale" type="range" min="5" max="80" value={wmScale} onChange={e => setWmScale(Number(e.target.value))} />
                      </div>

                      <div>
                        <label className="label" htmlFor="img-opacity">Opacity: {Math.round(imageOpacity * 100)}%</label>
                        <input id="img-opacity" type="range" min="0.1" max="1.0" step="0.05" value={imageOpacity} onChange={e => setImageOpacity(parseFloat(e.target.value))} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Placement options */}
              <div>
                <label className="label" htmlFor="wm-placement">Placement</label>
                <select
                  id="wm-placement"
                  className="input-field"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                >
                  <option value="center">Center</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="custom">Custom Position (Sliders)</option>
                </select>
              </div>

              {/* Custom placement sliders */}
              {position === "custom" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label className="label" htmlFor="custom-x">X Coordinate: {customX}%</label>
                    <input id="custom-x" type="range" min="0" max="95" value={customX} onChange={e => setCustomX(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="label" htmlFor="custom-y">Y Coordinate: {customY}%</label>
                    <input id="custom-y" type="range" min="0" max="95" value={customY} onChange={e => setCustomY(Number(e.target.value))} />
                  </div>
                </div>
              )}

              {/* Downloader */}
              <button
                className="btn-primary"
                onClick={downloadImage}
                style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}
              >
                💾 Download Protected Image
              </button>

              <button
                className="btn-secondary"
                onClick={() => {
                  setBaseImage(null);
                  setBaseImageUrl("");
                }}
                style={{ width: "100%", justifyContent: "center", padding: "8px", fontSize: "13px" }}
              >
                🗑️ Upload New Image
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default WatermarkAdder;
