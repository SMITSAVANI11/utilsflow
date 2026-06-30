import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

function JsonXmlConverter() {
  const [conversionType, setConversionType] = useState("json2xml");
  const [inputCode, setInputCode] = useState(`{\n  "title": "UtilsFlow",\n  "version": "1.0",\n  "features": ["conversion", "validators"]\n}`);
  const [outputCode, setOutputCode] = useState("");
  const [error, setError] = useState("");

  // Helper for JSON -> XML
  function jsonToXml(obj, rootName = "root") {
    let xml = "";
    if (typeof obj !== "object" || obj === null) {
      return String(obj);
    }
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        if (Array.isArray(val)) {
          val.forEach(item => {
            xml += `<${key}>${jsonToXml(item, key)}</${key}>`;
          });
        } else if (typeof val === "object") {
          xml += `<${key}>${jsonToXml(val, key)}</${key}>`;
        } else {
          xml += `<${key}>${val}</${key}>`;
        }
      }
    }
    
    return rootName ? `<${rootName}>${xml}</${rootName}>` : xml;
  }

  // Helper for XML -> JSON
  function xmlToJson(xmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "application/xml");
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      throw new Error(`XML Parsing Error: ${parseError.textContent}`);
    }

    function parseNode(node) {
      // If node has only text, return text
      if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length === 1 && node.firstChild.nodeType === Node.TEXT_NODE) {
        return node.firstChild.textContent;
      }
      
      const obj = {};
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          const childVal = parseNode(child);
          if (obj[child.nodeName]) {
            if (!Array.isArray(obj[child.nodeName])) {
              obj[child.nodeName] = [obj[child.nodeName]];
            }
            obj[child.nodeName].push(childVal);
          } else {
            obj[child.nodeName] = childVal;
          }
        }
      }
      return obj;
    }

    const rootElement = doc.documentElement;
    const result = {};
    result[rootElement.nodeName] = parseNode(rootElement);
    return result;
  }

  function handleConvert() {
    setError("");
    setOutputCode("");
    if (!inputCode.trim()) return;

    try {
      if (conversionType === "json2xml") {
        const parsed = JSON.parse(inputCode);
        const xml = jsonToXml(parsed);
        setOutputCode(xml);
      } else {
        const json = xmlToJson(inputCode);
        setOutputCode(JSON.stringify(json, null, 2));
      }
    } catch (e) {
      setError(e.message);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(outputCode);
    alert("Copied!");
  }

  return (
    <ToolLayout
      toolId="json-xml-converter"
      title="JSON ↔ XML Converter"
      description="Convert structured JSON strings into valid XML tags or parse raw XML files back into JSON objects client-side."
      path="/tools/json-xml-converter"
      category="developer"
      categoryPath="/?cat=developer"
    >
      <div className="tool-box">
        {error && (
          <div style={{ padding: "10px", background: "rgba(244,67,54,0.15)", border: "1px solid #f44336", color: "#ef5350", borderRadius: "4px", marginBottom: "16px", fontSize: "13px" }}>
            ❌ {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }} className="editor-grid">
          
          {/* Inputs */}
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <button
                onClick={() => {
                  setConversionType("json2xml");
                  setInputCode(`{\n  "title": "UtilsFlow",\n  "version": "1.0"\n}`);
                  setOutputCode("");
                }}
                className={`btn-secondary ${conversionType === "json2xml" ? "btn-primary" : ""}`}
                style={{ flex: 1, fontSize: "13px" }}
              >
                JSON to XML ➡️
              </button>
              <button
                onClick={() => {
                  setConversionType("xml2json");
                  setInputCode(`<root>\n  <title>UtilsFlow</title>\n  <version>1.0</version>\n</root>`);
                  setOutputCode("");
                }}
                className={`btn-secondary ${conversionType === "xml2json" ? "btn-primary" : ""}`}
                style={{ flex: 1, fontSize: "13px" }}
              >
                ⬅️ XML to JSON
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="label" htmlFor="conv-inp">Input Data</label>
              <textarea
                id="conv-inp"
                className="input-field"
                rows="8"
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                style={{ fontFamily: "monospace", fontSize: "13px" }}
              />
            </div>

            <button className="btn-primary" onClick={handleConvert} style={{ width: "100%", justifyContent: "center" }}>
              ⚡ Convert Data Format
            </button>
          </div>

          {/* Outputs */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <label className="label" htmlFor="conv-out" style={{ marginBottom: 0 }}>Converted Output</label>
              {outputCode && (
                <button className="btn-secondary" style={{ fontSize: "11px", padding: "2px 6px" }} onClick={copyToClipboard}>
                  📋 Copy
                </button>
              )}
            </div>
            <textarea
              id="conv-out"
              className="input-field"
              rows="11"
              readOnly
              value={outputCode}
              style={{ fontFamily: "monospace", fontSize: "13px", background: "rgba(0,0,0,0.15)" }}
              placeholder="Click Convert Data to translate formats..."
            />
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}

export default JsonXmlConverter;
export { JsonXmlConverter };
