import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { formatBytes } from "../../utils/fileUtils";
import ToolLayout from "../../components/ToolLayout";

function PDFMerge() {
  const [files, setFiles] = useState([]);
  const [merging, setMerging] = useState(false);
  const [mergedUrl, setMergedUrl] = useState("");
  const [mergedName, setMergedName] = useState("");

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    addFiles(selected);
  }

  function handleDrop(e) {
    e.preventDefault();
    const selected = Array.from(e.dataTransfer.files || []).filter(f => f.type === "application/pdf");
    addFiles(selected);
  }

  function addFiles(selectedFiles) {
    const pdfs = selectedFiles.filter(f => f.type === "application/pdf").map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      size: file.size,
    }));
    setFiles(prev => [...prev, ...pdfs]);
    // Clear old download link
    if (mergedUrl) {
      URL.revokeObjectURL(mergedUrl);
      setMergedUrl("");
    }
  }

  function removeFile(id) {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (mergedUrl) {
      URL.revokeObjectURL(mergedUrl);
      setMergedUrl("");
    }
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

    if (mergedUrl) {
      URL.revokeObjectURL(mergedUrl);
      setMergedUrl("");
    }
  }

  async function mergePdfs() {
    if (files.length < 2) return;
    setMerging(true);
    try {
      const mergedDoc = await PDFDocument.create();
      
      for (const fileObj of files) {
        const arrayBuffer = await fileObj.file.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        const pages = await mergedDoc.copyPages(doc, doc.getPageIndices());
        pages.forEach(page => mergedDoc.addPage(page));
      }

      const mergedBytes = await mergedDoc.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setMergedUrl(url);
      setMergedName("merged_document.pdf");
    } catch (err) {
      console.error("PDF merge failed", err);
      alert("Error merging PDFs: " + err.message);
    } finally {
      setMerging(false);
    }
  }

  return (
    <ToolLayout
      toolId="pdf-merge"
      title="Merge PDF"
      description="Combine multiple PDF documents into a single PDF file. Reorder files as needed and merge locally in your browser."
      path="/tools/pdf-merge"
      category="pdf"
      categoryPath="/?cat=pdf"
    >
      <div className="tool-box">
        {/* Upload zone */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById("pdf-merge-select")?.click()}
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
            id="pdf-merge-select"
            multiple
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📚</div>
          <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>Select or Drop multiple PDFs</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Add at least two PDF files to merge
          </p>
        </div>

        {/* List of files */}
        {files.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                Selected: {files.length} file{files.length !== 1 ? "s" : ""}
              </span>
              <button className="btn-danger" onClick={() => setFiles([])} style={{ fontSize: "12px", padding: "6px 12px" }}>
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
                    padding: "12px",
                  }}
                >
                  <div style={{ fontSize: "24px" }}>📄</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {f.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {formatBytes(f.size)}
                    </p>
                  </div>

                  {/* Ordering & delete controls */}
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      className="btn-secondary"
                      onClick={() => moveFile(index, -1)}
                      disabled={index === 0}
                      style={{ padding: "6px 10px", fontSize: "12px" }}
                      aria-label="Move up"
                    >
                      ▲
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => moveFile(index, 1)}
                      disabled={index === files.length - 1}
                      style={{ padding: "6px 10px", fontSize: "12px" }}
                      aria-label="Move down"
                    >
                      ▼
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => removeFile(f.id)}
                      style={{ padding: "6px 10px", fontSize: "12px" }}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action button */}
        {files.length >= 2 && !mergedUrl && (
          <button
            className="btn-primary"
            onClick={mergePdfs}
            disabled={merging}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {merging ? "🔄 Merging PDFs..." : "⚡ Merge Documents"}
          </button>
        )}

        {/* Download result */}
        {mergedUrl && (
          <div className="result-box" style={{ textAlign: "center" }}>
            <p style={{ marginBottom: "12px", color: "var(--success)", fontWeight: 600 }}>🎉 PDFs Merged Successfully!</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <a
                href={mergedUrl}
                download={mergedName}
                className="btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
              >
                📥 Download Merged PDF
              </a>
              <button
                className="btn-secondary"
                onClick={() => {
                  URL.revokeObjectURL(mergedUrl);
                  setMergedUrl("");
                }}
                style={{ flex: 1, justifyContent: "center" }}
              >
                🔄 Merge Again
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default PDFMerge;
