import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import ToolLayout from "../../components/ToolLayout";

function PasswordProtectPDF() {
  const [pdfFile, setPdfFile] = useState(null);
  const [password, setPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setError("");
    } else {
      setError("Please select a valid PDF file.");
    }
  }

  async function encryptPdf() {
    if (!pdfFile) {
      setError("Please upload a PDF file first.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a user password to secure the file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fileBytes = await pdfFile.arrayBuffer();
      // Load PDF
      const pdfDoc = await PDFDocument.load(fileBytes);

      // Encrypt PDF (Note: pdf-lib encrypt takes passwords and permission flags)
      pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: ownerPassword || password + "_owner",
        permissions: {
          printing: allowPrinting ? "highResolution" : "lowResolution",
          copying: allowCopying,
          modifying: false
        }
      });

      const encryptedBytes = await pdfDoc.save();
      
      // Download
      const blob = new Blob([encryptedBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `protected_${pdfFile.name}`;
      link.click();
    } catch (e) {
      setError(`Failed to encrypt PDF: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolLayout
      toolId="password-protect-pdf"
      title="Password-Protect PDF"
      description="Secure your PDF files by applying strong user and owner passwords with restriction policies client-side."
      path="/tools/password-protect-pdf"
      category="pdf"
      categoryPath="/?cat=pdf"
    >
      <div className="tool-box" style={{ maxWidth: "500px", margin: "0 auto" }}>
        {error && (
          <div style={{ padding: "10px", background: "rgba(244,67,54,0.15)", border: "1px solid #f44336", color: "#ef5350", borderRadius: "4px", marginBottom: "16px", fontSize: "13px", fontWeight: 600 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* File selector */}
          <div>
            <label className="label">Upload PDF Document</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="pdf-sec-upload"
            />
            <label
              htmlFor="pdf-sec-upload"
              style={{
                display: "block",
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius)",
                padding: "24px",
                textAlign: "center",
                cursor: "pointer",
                background: "rgba(255, 255, 255, 0.01)",
                transition: "background 0.2s"
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.01)"}
            >
              📄 {pdfFile ? pdfFile.name : "Choose PDF or Drag & Drop"}
            </label>
          </div>

          {/* Password fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="label" htmlFor="pdf-pass-user">User Password (to Open)</label>
              <input
                id="pdf-pass-user"
                type="password"
                className="input-field"
                placeholder="Required"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="pdf-pass-owner">Owner Password (Optional)</label>
              <input
                id="pdf-pass-owner"
                type="password"
                className="input-field"
                placeholder="Optional"
                value={ownerPassword}
                onChange={e => setOwnerPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Permissions checkboxes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", border: "1px solid var(--border)", padding: "12px", borderRadius: "var(--radius-sm)", background: "rgba(0,0,0,0.1)" }}>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-secondary)", marginBottom: "4px" }}>Restrict Permissions</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" id="perm-print" checked={allowPrinting} onChange={e => setAllowPrinting(e.target.checked)} />
              <label className="label" htmlFor="perm-print" style={{ marginBottom: 0, fontSize: "13px" }}>Allow Document Printing</label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" id="perm-copy" checked={allowCopying} onChange={e => setAllowCopying(e.target.checked)} />
              <label className="label" htmlFor="perm-copy" style={{ marginBottom: 0, fontSize: "13px" }}>Allow Content Copying & Extracting</label>
            </div>
          </div>

          {/* Action button */}
          <button className="btn-primary" onClick={encryptPdf} disabled={loading} style={{ justifyContent: "center", padding: "12px" }}>
            {loading ? "Securing Document..." : "🔒 Password-Protect & Download PDF"}
          </button>

        </div>

      </div>
    </ToolLayout>
  );
}

export default PasswordProtectPDF;
