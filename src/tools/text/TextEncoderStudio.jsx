import { useState, useMemo } from "react";
import ToolLayout from "../../components/ToolLayout";

const MORSE_CODE_MAP = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....",
  i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.",
  q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
  y: "-.--", z: "--..", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....",
  6: "-....", 7: "--...", 8: "---..", 9: "----.", 0: "-----", " ": "/"
};

function TextEncoderStudio({ initialTab = "binary" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [input, setInput] = useState("Hello World!");

  const output = useMemo(() => {
    if (activeTab === "binary") {
      return input
        .split("")
        .map(char => char.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
    } else if (activeTab === "ascii") {
      return input
        .split("")
        .map(char => char.charCodeAt(0))
        .join(" ");
    } else if (activeTab === "morse") {
      return input
        .toLowerCase()
        .split("")
        .map(char => MORSE_CODE_MAP[char] || char)
        .join(" ");
    }
    return input;
  }, [input, activeTab]);

  function copyToClipboard() {
    navigator.clipboard.writeText(output);
    alert("Copied!");
  }

  return (
    <ToolLayout
      toolId="text-encoder-studio"
      title="Text Encoder Studio"
      description="Translate strings to binary bits, generate ASCII code representations, and convert text to Morse code dots and dashes client-side."
      path="/tools/text-encoder-studio"
      category="text"
      categoryPath="/?cat=text"
    >
      <div className="tool-box" style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* Navigation tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "16px" }}>
          {[
            { id: "binary", label: "Text to Binary" },
            { id: "ascii", label: "Text to ASCII" },
            { id: "morse", label: "Text to Morse Code" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn-secondary ${activeTab === tab.id ? "btn-primary" : ""}`}
              style={{ flex: 1 }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label className="label" htmlFor="enc-input">Plain Text Input</label>
            <textarea
              id="enc-input"
              className="input-field"
              rows="4"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span className="label" style={{ marginBottom: 0 }}>Encoded Result</span>
              <button className="btn-secondary" style={{ fontSize: "11px", padding: "2px 6px" }} onClick={copyToClipboard}>
                📋 Copy
              </button>
            </div>
            <textarea
              className="input-field"
              rows="4"
              readOnly
              value={output}
              style={{ fontFamily: "monospace", fontSize: "13px", letterSpacing: "0.5px" }}
            />
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}

export default TextEncoderStudio;
export { TextEncoderStudio };
