import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

function TextCleaner() {
  const [text, setText] = useState("Hello World! 123...   This is some   messy text.\n\nLine 2.\nLine 2.");
  const [cleanedText, setCleanedText] = useState("");
  
  // Clean options
  const [trimText, setTrimText] = useState(true);
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false);
  const [removeDuplicateLines, setRemoveDuplicateLines] = useState(false);
  const [removeNumbers, setRemoveNumbers] = useState(false);
  const [removePunctuation, setRemovePunctuation] = useState(false);
  const [removeSpecialChars, setRemoveSpecialChars] = useState(false);
  
  // Modifiers
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [listFormat, setListFormat] = useState("none"); // none, bullet, numbered

  function cleanText() {
    let result = text;

    // 1. Line based cleanups
    let lines = result.split("\n");

    if (removeEmptyLines) {
      lines = lines.filter(line => line.trim() !== "");
    }
    if (removeDuplicateLines) {
      lines = Array.from(new Set(lines));
    }

    result = lines.join("\n");

    // 2. Character based cleanups
    if (removeNumbers) {
      result = result.replace(/[0-9]/g, "");
    }
    if (removePunctuation) {
      // eslint-disable-next-line no-useless-escape
      result = result.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
    }
    if (removeSpecialChars) {
      result = result.replace(/[^a-zA-Z0-9\s]/g, "");
    }
    if (removeExtraSpaces) {
      result = result.replace(/[ \t]+/g, " ");
    }
    if (trimText) {
      result = result.split("\n").map(l => l.trim()).join("\n").trim();
    }

    // 3. Prefix, Suffix & List formatting
    let finalLines = result.split("\n");
    if (prefix || suffix || listFormat !== "none") {
      finalLines = finalLines.map((line, idx) => {
        if (!line.trim()) return line;
        let l = line;
        if (prefix) l = prefix + l;
        if (suffix) l = l + suffix;
        if (listFormat === "bullet") l = "• " + l;
        if (listFormat === "numbered") l = `${idx + 1}. ` + l;
        return l;
      });
      result = finalLines.join("\n");
    }

    setCleanedText(result);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(cleanedText);
    alert("Copied!");
  }

  return (
    <ToolLayout
      toolId="text-cleaner"
      title="Text Cleaner & Formatter"
      description="Format lists, strip numbers/punctuation, remove duplicate or empty lines, and batch-apply prefix or suffix values to text lines client-side."
      path="/tools/text-cleaner"
      category="text"
      categoryPath="/?cat=text"
    >
      <div className="tool-box">
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }} className="editor-grid">
          
          {/* Input/Output Column */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <label className="label" htmlFor="clean-inp">Original Text</label>
              <textarea
                id="clean-inp"
                className="input-field"
                rows="6"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste your text here..."
              />
            </div>
            
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <label className="label" htmlFor="clean-out" style={{ marginBottom: 0 }}>Cleaned Text</label>
                {cleanedText && (
                  <button className="btn-secondary" style={{ fontSize: "11px", padding: "2px 6px" }} onClick={copyToClipboard}>
                    📋 Copy
                  </button>
                )}
              </div>
              <textarea
                id="clean-out"
                className="input-field"
                rows="6"
                readOnly
                value={cleanedText}
                placeholder="Click Clean Text to see results..."
              />
            </div>

            <button className="btn-primary" onClick={cleanText} style={{ width: "100%", justifyContent: "center" }}>
              ⚡ Clean & Format Text
            </button>
          </div>

          {/* Options Column */}
          <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius)" }}>
            <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "12px", textTransform: "uppercase" }}>
              ⚙️ Cleaning Options
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                <input type="checkbox" checked={trimText} onChange={e => setTrimText(e.target.checked)} />
                Trim lines (remove leading/trailing spaces)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                <input type="checkbox" checked={removeExtraSpaces} onChange={e => setRemoveExtraSpaces(e.target.checked)} />
                Replace multiple spaces with single space
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                <input type="checkbox" checked={removeEmptyLines} onChange={e => setRemoveEmptyLines(e.target.checked)} />
                Remove empty lines
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                <input type="checkbox" checked={removeDuplicateLines} onChange={e => setRemoveDuplicateLines(e.target.checked)} />
                Remove duplicate lines
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                <input type="checkbox" checked={removeNumbers} onChange={e => setRemoveNumbers(e.target.checked)} />
                Strip all numbers (0-9)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                <input type="checkbox" checked={removePunctuation} onChange={e => setRemovePunctuation(e.target.checked)} />
                Strip punctuation marks
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                <input type="checkbox" checked={removeSpecialChars} onChange={e => setRemoveSpecialChars(e.target.checked)} />
                Strip special characters (non-alphanumeric)
              </label>
            </div>

            <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "12px", textTransform: "uppercase" }}>
              ➕ Prefix / Suffix & Lists
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div>
                  <label className="label" htmlFor="pref-inp">Prefix</label>
                  <input type="text" id="pref-inp" className="input-field" value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="e.g. ID-" />
                </div>
                <div>
                  <label className="label" htmlFor="suff-inp">Suffix</label>
                  <input type="text" id="suff-inp" className="input-field" value={suffix} onChange={e => setSuffix(e.target.value)} placeholder="e.g. .html" />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="list-fmt-sel">List Format</label>
                <select id="list-fmt-sel" className="input-field" value={listFormat} onChange={e => setListFormat(e.target.value)}>
                  <option value="none">None (Keep Plain Text)</option>
                  <option value="bullet">Bullet List (•)</option>
                  <option value="numbered">Numbered List (1., 2., 3.)</option>
                </select>
              </div>
            </div>

          </div>

        </div>
      </div>
    </ToolLayout>
  );
}

export default TextCleaner;
export { TextCleaner };
