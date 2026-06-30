import { useState, useEffect } from "react";
import ToolLayout from "../../components/ToolLayout";

function CodeBeautifier() {
  const [codeType, setCodeType] = useState(() => {
    return localStorage.getItem("utilsflow_beautifier_type") || "html";
  });
  const [inputCode, setInputCode] = useState(() => {
    return localStorage.getItem("utilsflow_beautifier_input") || `<div><span><h1>Code Beautifier</h1><p>Formats your messy code</p></span></div>`;
  });
  const [outputCode, setOutputCode] = useState("");

  useEffect(() => {
    localStorage.setItem("utilsflow_beautifier_type", codeType);
  }, [codeType]);

  useEffect(() => {
    localStorage.setItem("utilsflow_beautifier_input", inputCode);
  }, [inputCode]);

  function beautifyHTML(html) {
    let formatted = "";
    let indent = 0;
    const tab = "  ";
    
    // Split tags
    const tokens = html
      .replace(/>\s*</g, "><")
      .replace(/</g, "~#~<")
      .split("~#~")
      .filter(Boolean);

    tokens.forEach(token => {
      if (token.startsWith("</")) {
        indent--;
        formatted += "\n" + tab.repeat(Math.max(0, indent)) + token;
      } else if (token.startsWith("<") && !token.endsWith("/>") && !token.startsWith("<!") && !token.startsWith("<?")) {
        // Check if tag is self-closing in HTML5
        const isSelfClosing = /<img|<br|<input|<hr|<meta|<link/i.test(token);
        formatted += "\n" + tab.repeat(Math.max(0, indent)) + token;
        if (!isSelfClosing) indent++;
      } else {
        formatted += "\n" + tab.repeat(Math.max(0, indent)) + token;
      }
    });

    return formatted.trim();
  }

  function beautifyCSS(css) {
    let formatted = "";
    let indent = 0;
    const tab = "  ";

    // Clean space
    const clean = css
      .replace(/\s*([{}])\s*/g, "$1")
      .replace(/;\s*/g, ";")
      .replace(/\s+/g, " ");

    for (let i = 0; i < clean.length; i++) {
      const char = clean[i];
      if (char === "{") {
        indent++;
        formatted += " {\n" + tab.repeat(indent);
      } else if (char === "}") {
        indent--;
        formatted = formatted.trim() + "\n" + tab.repeat(indent) + "}\n\n" + tab.repeat(indent);
      } else if (char === ";") {
        formatted += ";\n" + tab.repeat(indent);
      } else {
        formatted += char;
      }
    }
    return formatted.trim();
  }

  function beautifyJS(js) {
    let formatted = "";
    let indent = 0;
    const tab = "  ";

    // Simple JS Indenter
    const clean = js
      .replace(/\s*([{}])\s*/g, "$1")
      .replace(/;\s*/g, ";")
      .replace(/\s+/g, " ");

    for (let i = 0; i < clean.length; i++) {
      const char = clean[i];
      if (char === "{") {
        indent++;
        formatted += " {\n" + tab.repeat(indent);
      } else if (char === "}") {
        indent--;
        formatted = formatted.trim() + "\n" + tab.repeat(indent) + "}\n" + tab.repeat(indent);
      } else if (char === ";") {
        formatted += ";\n" + tab.repeat(indent);
      } else {
        formatted += char;
      }
    }
    return formatted.trim();
  }

  function handleBeautify() {
    if (!inputCode.trim()) return;
    try {
      if (codeType === "html") {
        setOutputCode(beautifyHTML(inputCode));
      } else if (codeType === "css") {
        setOutputCode(beautifyCSS(inputCode));
      } else if (codeType === "javascript") {
        setOutputCode(beautifyJS(inputCode));
      }
    } catch (e) {
      setOutputCode(`Error formatting: ${e.message}`);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(outputCode);
    alert("Copied!");
  }

  return (
    <ToolLayout
      toolId="code-beautifier"
      title="Code Beautifier"
      description="Format and align indentation for HTML tags, CSS rules, and JavaScript code blocks client-side."
      path="/tools/code-beautifier"
      category="developer"
      categoryPath="/?cat=developer"
    >
      <div className="tool-box">
        
        <div className="editor-grid">
          {/* Inputs */}
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              {["html", "css", "javascript"].map(type => (
                <button
                  key={type}
                  onClick={() => setCodeType(type)}
                  className={`btn-secondary ${codeType === type ? "btn-primary" : ""}`}
                  style={{ flex: 1, textTransform: "uppercase", fontSize: "12px" }}
                >
                  {type}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="label" htmlFor="beaut-inp">Raw Unformatted Code</label>
              <textarea
                id="beaut-inp"
                className="input-field"
                rows="8"
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                style={{ fontFamily: "monospace", fontSize: "13px" }}
              />
            </div>

            <button className="btn-primary" onClick={handleBeautify} style={{ width: "100%", justifyContent: "center" }}>
              ⚡ Format / Beautify Code
            </button>
          </div>

          {/* Output */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <label className="label" htmlFor="beaut-out" style={{ marginBottom: 0 }}>Beautified Code</label>
              {outputCode && (
                <button className="btn-secondary" style={{ fontSize: "11px", padding: "2px 6px" }} onClick={copyToClipboard}>
                  📋 Copy
                </button>
              )}
            </div>
            <textarea
              id="beaut-out"
              className="input-field"
              rows="11"
              readOnly
              value={outputCode}
              style={{ fontFamily: "monospace", fontSize: "13px", background: "rgba(0,0,0,0.15)" }}
              placeholder="Click Format / Beautify to see output..."
            />
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}

export default CodeBeautifier;
export { CodeBeautifier };
