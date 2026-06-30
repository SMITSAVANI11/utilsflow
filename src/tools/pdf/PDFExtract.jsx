import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { formatBytes } from "../../utils/fileUtils";
import ToolLayout from "../../components/ToolLayout";

function PDFExtract() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [arrayBuffer, setArrayBuffer] = useState(null);
  const [pagesInput, setPagesInput] = useState("1, 3");
  const [extracting, setExtracting] = useState(false);
  
  const [extractedUrl, setExtractedUrl] = useState("");
  const [extractedName, setExtractedName] = useState("");
  const [extractedSize, setExtractedSize] = useState(0);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      loadPdf(file);
    }
  }

  async function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      loadPdf(file);
    }
  }

  async function loadPdf(file) {
    setPdfFile(file);
    setExtractedUrl("");
    
    try {
      const buffer = await file.arrayBuffer();
      setArrayBuffer(buffer);
      const doc = await PDFDocument.load(buffer);
      setPageCount(doc.getPageCount());
      setPagesInput(`1, ${Math.min(3, doc.getPageCount())}`);
    } catch (err) {
      alert("Error loading PDF: " + err.message);
    }
  }

  // Parse list of pages/ranges and return sorted list of unique 0-indexed page numbers
  function parseExtractPages(input, maxPage) {
    const parts = input.split(",");
    const indicesSet = new Set();

    for (const part of parts) {
      const clean = part.trim();
      if (!clean) continue;

      if (clean.includes("-")) {
        const [startStr, endStr] = clean.split("-");
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (isNaN(start) || isNaN(end) || start < 1 || end > maxPage || start > end) {
          throw new Error(`Invalid range: ${clean}`);
        }
        for (let i = start - 1; i <= end - 1; i++) {
          indicesSet.add(i);
        }
      } else {
        const val = parseInt(clean);
        if (isNaN(val) || val < 1 || val > maxPage) {
          throw new Error(`Invalid page number: ${clean}`);
        }
        indicesSet.add(val - 1);
      }
    }

    return Array.from(indicesSet).sort((a, b) => a - b);
  }

  async function extractPages() {
    if (!arrayBuffer) return;
    setExtracting(true);

    if (extractedUrl) {
      URL.revokeObjectURL(extractedUrl);
      setExtractedUrl("");
    }

    try {
      const targetIndices = parseExtractPages(pagesInput, pageCount);
      if (targetIndices.length === 0) {
        throw new Error("No valid pages selected for extraction");
      }

      const originalDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();

      const copiedPages = await newDoc.copyPages(originalDoc, targetIndices);
      copiedPages.forEach(p => newDoc.addPage(p));

      const bytes = await newDoc.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setExtractedUrl(url);
      setExtractedSize(bytes.length);
      setExtractedName(`${pdfFile.name.substring(0, pdfFile.name.lastIndexOf("."))} - extracted.pdf`);
    } catch (err) {
      alert("Error extracting pages: " + err.message);
    } finally {
      setExtracting(false);
    }
  }

  return (
    <ToolLayout
      toolId="pdf-extract"
      title="Extract PDF Pages"
      description="Extract specific pages or page ranges from a PDF document and save them as a new, separate PDF file."
      path="/tools/pdf-extract"
      category="pdf"
      categoryPath="/?cat=pdf"
    >
      <div className="tool-box">
        {!pdfFile ? (
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById("pdf-extract-select")?.click()}
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
              id="pdf-extract-select"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📄</div>
            <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>Select PDF to Extract From</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Upload a PDF document to isolate specific pages client-side
            </p>
          </div>
        ) : (
          <div>
            {/* File Info */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              background: "rgba(255,255,255,0.02)",
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}>
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 600 }}>{pdfFile.name}</h4>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {formatBytes(pdfFile.size)} • {pageCount} page{pageCount !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                className="btn-danger"
                onClick={() => {
                  setPdfFile(null);
                  setPageCount(0);
                  setArrayBuffer(null);
                  setExtractedUrl("");
                }}
                style={{ padding: "6px 12px", fontSize: "12px" }}
              >
                Change File
              </button>
            </div>

            {/* Input Selection */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "20px",
              marginBottom: "24px",
            }}>
              <label className="label" htmlFor="extract-pages-inp">Pages to Extract (e.g. 1, 3-5, 8)</label>
              <input
                id="extract-pages-inp"
                type="text"
                className="input-field"
                value={pagesInput}
                onChange={e => setPagesInput(e.target.value)}
                placeholder={`e.g. 1, 3, 5-${pageCount}`}
              />
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>
                Enter single page numbers or ranges separated by commas. Total pages: <strong>{pageCount}</strong>
              </p>
            </div>

            {/* Action Button */}
            {!extractedUrl && (
              <button
                className="btn-primary"
                onClick={extractPages}
                disabled={extracting}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {extracting ? "🔄 Extracting..." : "⚡ Extract Pages"}
              </button>
            )}

            {/* Downloader Box */}
            {extractedUrl && (
              <div className="result-box" style={{ textAlign: "center" }}>
                <p style={{ marginBottom: "12px", color: "var(--success)", fontWeight: 600 }}>🎉 Pages Extracted Successfully!</p>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
                  New file size: <strong>{formatBytes(extractedSize)}</strong>
                </p>
                <div style={{ display: "flex", gap: "12px" }}>
                  <a
                    href={extractedUrl}
                    download={extractedName}
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    📥 Download Extracted PDF
                  </a>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      URL.revokeObjectURL(extractedUrl);
                      setExtractedUrl("");
                    }}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    🔄 Extract Different Pages
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default PDFExtract;
