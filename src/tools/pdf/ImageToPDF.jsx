import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { formatBytes } from "../../utils/fileUtils";
import ToolLayout from "../../components/ToolLayout";

function ImageToPDF() {
  const [files, setFiles] = useState([]);
  const [pageSize, setPageSize] = useState("a4"); // "a4" | "letter" | "fit"
  const [margin, setMargin] = useState("none");   // "none" | "small" | "large"
  const [converting, setConverting] = useState(false);
  
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [pdfSize, setPdfSize] = useState(0);

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    addFiles(selected);
  }

  function handleDrop(e) {
    e.preventDefault();
    const selected = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith("image/"));
    addFiles(selected);
  }

  function addFiles(selectedFiles) {
    const newFiles = selectedFiles.map(file => {
      if (!file.type.startsWith("image/")) return null;
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        previewUrl: URL.createObjectURL(file),
      };
    }).filter(Boolean);

    setFiles(prev => [...prev, ...newFiles]);
    clearResult();
  }

  function removeFile(id) {
    setFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter(f => f.id !== id);
    });
    clearResult();
  }

  function moveFile(index, direction) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= files.length) return;

    setFiles(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[nextIndex];
      copy[nextIndex] = temp;
      return copy;
    });
    clearResult();
  }

  function clearResult() {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }
  }

  // Convert image file to standardized PNG bytes using Canvas
  async function getStandardizedPngBytes(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = async () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob(async (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) {
              reject(new Error("Canvas export failed"));
              return;
            }
            const buffer = await blob.arrayBuffer();
            resolve({
              buffer,
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          }, "image/png");
        } catch (e) {
          URL.revokeObjectURL(url);
          reject(e);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image"));
      };
    });
  }

  async function convertToPdf() {
    if (files.length === 0) return;
    setConverting(true);
    clearResult();

    try {
      const pdfDoc = await PDFDocument.create();

      // Page sizes in Points (1 inch = 72 points)
      const SIZES = {
        a4: { w: 595.27, h: 841.89 },
        letter: { w: 612, h: 792 },
      };

      const MARGINS = {
        none: 0,
        small: 18,  // 0.25 inch
        large: 36,  // 0.5 inch
      };

      const pad = MARGINS[margin];

      for (const fileObj of files) {
        const { buffer, width, height } = await getStandardizedPngBytes(fileObj.file);
        
        // Embed the image
        const embeddedImg = await pdfDoc.embedPng(buffer);

        let pageWidth = SIZES[pageSize]?.w || width;
        let pageHeight = SIZES[pageSize]?.h || height;

        if (pageSize === "fit") {
          // If fit to image, page dimensions match the image size directly
          pageWidth = width + pad * 2;
          pageHeight = height + pad * 2;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate layout fitting
        const availableW = pageWidth - pad * 2;
        const availableH = pageHeight - pad * 2;

        let targetW = availableW;
        let targetH = availableH;

        const imgRatio = width / height;
        const pageRatio = availableW / availableH;

        if (imgRatio > pageRatio) {
          // Image is wider than page ratio
          targetW = availableW;
          targetH = availableW / imgRatio;
        } else {
          // Image is taller than page ratio
          targetH = availableH;
          targetW = availableH * imgRatio;
        }

        // Center placement
        const x = pad + (availableW - targetW) / 2;
        const y = pad + (availableH - targetH) / 2;

        page.drawImage(embeddedImg, {
          x,
          y,
          width: targetW,
          height: targetH,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setPdfSize(bytes => pdfBytes.length);
      setPdfName("images_converted.pdf");
    } catch (err) {
      console.error("PDF generation error", err);
      alert("Failed to build PDF: " + err.message);
    } finally {
      setConverting(false);
    }
  }

  return (
    <ToolLayout
      toolId="image-to-pdf"
      title="Image to PDF Converter"
      description="Convert images (JPG, PNG, WebP, SVG, BMP) to a single PDF document. Customize page sizes, margins, and download client-side."
      path="/tools/image-to-pdf"
      category="pdf"
      categoryPath="/?cat=pdf"
    >
      <div className="tool-box">
        {/* Upload Zone */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById("img-to-pdf-select")?.click()}
          style={{
            border: "2px dashed var(--border)",
            borderRadius: "var(--radius)",
            padding: "45px 20px",
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
            id="img-to-pdf-select"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📸</div>
          <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>Drag & drop images here</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Or click to upload. Supports JPG, PNG, WebP, SVG, BMP, and GIF
          </p>
        </div>

        {/* Configurations Panel */}
        {files.length > 0 && (
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "16px",
            marginBottom: "24px",
          }}>
            <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase" }}>
              ⚙️ Page Settings
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label className="label" htmlFor="pg-sz-sel">Page Size</label>
                <select
                  id="pg-sz-sel"
                  className="input-field"
                  value={pageSize}
                  onChange={e => { setPageSize(e.target.value); clearResult(); }}
                >
                  <option value="a4">A4 Standard (595 × 841 pt)</option>
                  <option value="letter">US Letter (612 × 792 pt)</option>
                  <option value="fit">Fit to Image Size</option>
                </select>
              </div>

              <div>
                <label className="label" htmlFor="mrg-sel">Page Margins</label>
                <select
                  id="mrg-sel"
                  className="input-field"
                  value={margin}
                  onChange={e => { setMargin(e.target.value); clearResult(); }}
                >
                  <option value="none">No Margins (0pt)</option>
                  <option value="small">Small Margins (18pt)</option>
                  <option value="large">Large Margins (36pt)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Selected files list */}
        {files.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                Selected: {files.length} image{files.length !== 1 ? "s" : ""}
              </span>
              <button className="btn-danger" onClick={() => { files.forEach(f => URL.revokeObjectURL(f.previewUrl)); setFiles([]); clearResult(); }} style={{ fontSize: "12px", padding: "6px 12px" }}>
                🗑️ Clear All
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {files.map((f, index) => (
                <div
                  key={f.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "10px",
                  }}
                >
                  <img src={f.previewUrl} alt="Thumbnail" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {f.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{formatBytes(f.size)}</p>
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      className="btn-secondary"
                      onClick={() => moveFile(index, -1)}
                      disabled={index === 0}
                      style={{ padding: "6px 10px", fontSize: "12px" }}
                    >
                      ▲
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => moveFile(index, 1)}
                      disabled={index === files.length - 1}
                      style={{ padding: "6px 10px", fontSize: "12px" }}
                    >
                      ▼
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => removeFile(f.id)}
                      style={{ padding: "6px 10px", fontSize: "12px" }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Convert Button */}
        {files.length > 0 && !pdfUrl && (
          <button
            className="btn-primary"
            onClick={convertToPdf}
            disabled={converting}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {converting ? "🔄 Standardizing & Packaging Images..." : "⚡ Build PDF"}
          </button>
        )}

        {/* Downloader Result */}
        {pdfUrl && (
          <div className="result-box" style={{ textAlign: "center" }}>
            <p style={{ marginBottom: "12px", color: "var(--success)", fontWeight: 600 }}>🎉 PDF Generated Successfully!</p>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Total file size: <strong>{formatBytes(pdfSize)}</strong>
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <a
                href={pdfUrl}
                download={pdfName}
                className="btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
              >
                📥 Download PDF File
              </a>
              <button
                className="btn-secondary"
                onClick={() => {
                  URL.revokeObjectURL(pdfUrl);
                  setPdfUrl("");
                }}
                style={{ flex: 1, justifyContent: "center" }}
              >
                🔄 Convert Again
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default ImageToPDF;
