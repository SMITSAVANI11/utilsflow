import { useState, useEffect } from "react";
import { formatBytes } from "../../utils/fileUtils";
import ToolLayout from "../../components/ToolLayout";

function PDFViewer() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      loadPdf(file);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      loadPdf(file);
    }
  }

  function loadPdf(file) {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfFile(file);
    setPdfUrl(URL.createObjectURL(file));
  }

  return (
    <ToolLayout
      toolId="pdf-viewer"
      title="View PDF"
      description="View and read PDF documents online in a high-fidelity preview. Print, zoom, search, and navigate pages offline."
      path="/tools/pdf-viewer"
      category="pdf"
      categoryPath="/?cat=pdf"
    >
      <div className="tool-box">
        {!pdfFile ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById("pdf-select")?.click()}
            style={{
              border: "2px dashed var(--border)",
              borderRadius: "var(--radius)",
              padding: "50px 20px",
              textAlign: "center",
              cursor: "pointer",
              background: "rgba(255,255,255,0.02)",
              transition: "var(--transition)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <input
              type="file"
              id="pdf-select"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📄</div>
            <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>Upload or Drop your PDF</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Click to select a local PDF file to view securely
            </p>
          </div>
        ) : (
          <div>
            {/* Header info */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                background: "rgba(255,255,255,0.02)",
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 600, wordBreak: "break-all" }}>
                  {pdfFile.name}
                </h4>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {formatBytes(pdfFile.size)}
                </p>
              </div>
              <button
                className="btn-danger"
                onClick={() => {
                  setPdfFile(null);
                  setPdfUrl("");
                }}
                style={{ padding: "6px 14px", fontSize: "12px" }}
              >
                ✕ Close File
              </button>
            </div>

            {/* Native Preview Embed */}
            <div
              style={{
                background: "rgba(0,0,0,0.1)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
              }}
            >
              <iframe
                src={`${pdfUrl}#toolbar=1`}
                title={pdfFile.name}
                width="100%"
                height="650px"
                style={{ border: "none", display: "block" }}
              />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default PDFViewer;
