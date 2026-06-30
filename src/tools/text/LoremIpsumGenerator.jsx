// LoremIpsumGenerator.jsx
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function randomWord() { return WORDS[Math.floor(Math.random() * WORDS.length)]; }
function randomSentence() {
  const len = 8 + Math.floor(Math.random() * 10);
  const words = Array.from({ length: len }, randomWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}
function randomParagraph() {
  const sentences = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: sentences }, randomSentence).join(" ");
}

function LoremIpsumGenerator() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("lorem-ipsum"); }, [trackTool]);

  const [mode,    setMode]    = useState("paragraphs");
  const [count,   setCount]   = useState(3);
  const [output,  setOutput]  = useState("");
  const [copied,  setCopied]  = useState(false);

  function generate() {
    let result = "";
    if (mode === "words") {
      result = Array.from({ length: count }, randomWord).join(" ");
    } else if (mode === "sentences") {
      result = Array.from({ length: count }, randomSentence).join(" ");
    } else {
      result = Array.from({ length: count }, randomParagraph).join("\n\n");
    }
    setOutput(result);
    setCopied(false);
  }

  useEffect(() => { generate(); }, [mode, count]);

  function copy() {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="tool-page fade-in">
      <SEOHead title="Lorem Ipsum Generator" description="Generate placeholder Lorem Ipsum text by words, sentences, or paragraphs. Free, instant, no signup." path="/tools/lorem-ipsum" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="Lorem Ipsum Generator" category="Text & Writing" categoryPath="/?cat=text" />
        <h1 className="tool-title">📄 Lorem Ipsum Generator</h1>
        <p className="tool-description">Generate placeholder text for your designs, mockups, or presentations.</p>

        <div className="tool-box">
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "20px" }}>
            <div>
              <label className="label">Type</label>
              <div style={{ display: "flex", gap: "6px" }}>
                {["words", "sentences", "paragraphs"].map((m) => (
                  <button key={m} onClick={() => setMode(m)} className={mode === m ? "btn-primary" : "btn-secondary"} style={{ fontSize: "13px", padding: "8px 14px", textTransform: "capitalize" }}>{m}</button>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: "160px" }}>
              <label className="label" htmlFor="lorem-count">Count: <strong style={{ color: "var(--primary-light)" }}>{count}</strong></label>
              <input id="lorem-count" type="range" min={1} max={mode === "words" ? 200 : mode === "sentences" ? 20 : 10} value={count} onChange={(e) => setCount(Number(e.target.value))} />
            </div>
            <button className="btn-primary" onClick={generate}>🔄 Regenerate</button>
          </div>

          <div style={{ position: "relative" }}>
            <div className="result-box" style={{ marginTop: 0, fontSize: "14px", lineHeight: "1.8", maxHeight: "400px", overflowY: "auto", whiteSpace: "pre-wrap" }}>
              {output}
            </div>
            <button id="copy-lorem-btn" className="btn-secondary" onClick={copy}
              style={{ position: "absolute", top: "10px", right: "10px", padding: "6px 12px", fontSize: "12px" }}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
          <p style={{ marginTop: "10px", fontSize: "12px", color: "var(--text-muted)" }}>
            {output.split(/\s+/).filter(Boolean).length} words · {output.length} characters
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoremIpsumGenerator;
