import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { formatBytes } from "../../utils/fileUtils";
import ToolLayout from "../../components/ToolLayout";

function PDFSplit() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [arrayBuffer, setArrayBuffer] = useState(null);
  const [splitMode, setSplitMode] = useState("range"); // "range" | "every"

  // Range options
  const [rangeInput, setRangeInput] = useState("1-2"); // e.g. "1-2, 5, 8-10"
  // Split every options
  const [splitEveryPages, setSplitEveryPages] = useState(1);

  const [splitting, setSplitting] = useState(false);
  const [results, setResults] = useState([]);

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
    setResults([]);
    
    try {
      const buffer = await file.arrayBuffer();
      setArrayBuffer(buffer);
      const doc = await PDFDocument.load(buffer);
      setPageCount(doc.getPageCount());
      setRangeInput(`1-${Math.min(2, doc.getPageCount())}`);
    } catch (err) {
      alert("Error loading PDF: " + err.message);
    }
  }

  // Parses ranges like "1-3, 5, 7-10" into array of page groups: [[0, 1, 2], [4], [6, 7, 8, 9]] (0-indexed)
  function parseRanges(input, maxPage) {
    const parts = input.split(",");
    const groups = [];

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
        const group = [];
        for (let i = start - 1; i <= end - 1; i++) {
          group.push(i);
        }
        groups.push({ name: `Pages ${start}-${end}`, indices: group });
      } else {
        const val = parseInt(clean);
        if (isNaN(val) || val < 1 || val > maxPage) {
          throw new Error(`Invalid page number: ${clean}`);
        }
        groups.push({ name: `Page ${val}`, indices: [val - 1] });
      }
    }
    return groups;
  }

  // Splits every N pages: generates groups of pages
  function generateEveryGroups(n, maxPage) {
    const groups = [];
    for (let i = 0; i < maxPage; i += n) {
      const group = [];
      const end = Math.min(i + n, maxPage);
      for (let j = i; j < end; j++) {
        group.push(j);
      }
      groups.push({
        name: `Pages ${i + 1}-${end}`,
        indices: group,
      });
    }
    return groups;
  }

  async function splitPdf() {
    if (!arrayBuffer) return;
    setSplitting(true);
    
    // Revoke old urls
    results.forEach(r => URL.revokeObjectURL(r.url));
    setResults([]);

    try {
      let groups = [];
      if (splitMode === "range") {
        groups = parseRanges(rangeInput, pageCount);
      } else {
        const n = parseInt(splitEveryPages);
        if (isNaN(n) || n < 1 || n > pageCount) {
          throw new Error(`Invalid number of pages: must be between 1 and ${pageCount}`);
        }
        groups = generateEveryGroups(n, pageCount);
      }

      const originalDoc = await PDFDocument.load(arrayBuffer);
      const outputParts = [];

      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(originalDoc, group.indices);
        copiedPages.forEach(p => newDoc.addPage(p));
        
        const bytes = await newDoc.save();
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const name = `${pdfFile.name.substring(0, pdfFile.name.lastIndexOf("."))} - ${group.name}.pdf`;

        outputParts.push({
          name,
          url,
          size: bytes.length,
          pages: group.indices.length,
        });
      }

      setResults(outputParts);
    } catch (err) {
      alert("Error splitting PDF: " + err.message);
    } finally {
      setSplitting(false);
    }
  }

  function downloadFile(r) {
    const a = document.createElement("a");
    a.href = r.url;
    a.download = r.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <ToolLayout
      toolId="pdf-split"
      title="Split PDF"
      description="Split a PDF document into multiple smaller PDF files by specific page numbers, page ranges, or equal page chunks."
      path="/tools/pdf-split"
      category="pdf"
      categoryPath="/?cat=pdf"
    >
      <div className="tool-box">
        {!pdfFile ? (
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById("pdf-split-select")?.click()}
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
              id="pdf-split-select"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>✂️</div>
            <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>Select PDF to Split</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Upload a PDF document to customize and extract pages locally
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
                  setResults([]);
                }}
                style={{ padding: "6px 12px", fontSize: "12px" }}
              >
                Change File
              </button>
            </div>

            {/* Split Options */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "20px",
              marginBottom: "24px",
            }}>
              <label className="label">Splitting Mode</label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                <button
                  className={`btn-secondary ${splitMode === "range" ? "btn-primary" : ""}`}
                  onClick={() => setSplitMode("range")}
                  style={{ flex: 1, padding: "8px", fontSize: "13px", justifyContent: "center" }}
                >
                  🎯 Split by Custom Ranges
                </button>
                <button
                  className={`btn-secondary ${splitMode === "every" ? "btn-primary" : ""}`}
                  onClick={() => setSplitMode("every")}
                  style={{ flex: 1, padding: "8px", fontSize: "13px", justifyContent: "center" }}
                >
                  ⚖️ Split every N pages
                </button>
              </div>

              {splitMode === "range" ? (
                <div>
                  <label className="label" htmlFor="range-inp">Define Page Ranges (e.g. 1-2, 4, 5-6)</label>
                  <input
                    id="range-inp"
                    type="text"
                    className="input-field"
                    value={rangeInput}
                    onChange={e => setRangeInput(e.target.value)}
                    placeholder={`e.g. 1-${pageCount}`}
                  />
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>
                    Separate pages/ranges with commas. Total pages in document: <strong>{pageCount}</strong>
                  </p>
                </div>
              ) : (
                <div>
                  <label className="label" htmlFor="every-inp">Split Every N Pages</label>
                  <input
                    id="every-inp"
                    type="number"
                    min="1"
                    max={pageCount}
                    className="input-field"
                    value={splitEveryPages}
                    onChange={e => setSplitEveryPages(e.target.value)}
                  />
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "6px" }}>
                    Generates a new PDF file for every <strong>{splitEveryPages}</strong> page{Number(splitEveryPages) !== 1 ? "s" : ""}.
                  </p>
                </div>
              )}
            </div>

            {/* Split Button */}
            {results.length === 0 && (
              <button
                className="btn-primary"
                onClick={splitPdf}
                disabled={splitting}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {splitting ? "🔄 Splitting PDF..." : "⚡ Split PDF Document"}
              </button>
            )}

            {/* Result list */}
            {results.length > 0 && (
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>
                  🎉 Split Completed: {results.length} part{results.length !== 1 ? "s" : ""} generated
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  {results.map((r, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1, marginRight: "12px" }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.name}
                        </p>
                        <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                          {formatBytes(r.size)} • {r.pages} page{r.pages !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <button
                        className="btn-secondary"
                        onClick={() => downloadFile(r)}
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        💾 Download
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  className="btn-secondary"
                  onClick={() => setResults([])}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  🔄 Reset & Split Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default PDFSplit;
