import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

function TextReverser() {
  const [input, setInput] = useState("Hello World!");
  const [mode, setMode] = useState("letters"); // letters, words, lines

  const reversedText = (() => {
    if (mode === "letters") {
      return input.split("").reverse().join("");
    } else if (mode === "words") {
      return input.split(/\s+/).reverse().join(" ");
    } else if (mode === "lines") {
      return input.split("\n").reverse().join("\n");
    }
    return input;
  })();

  function copyToClipboard() {
    navigator.clipboard.writeText(reversedText);
    alert("Copied!");
  }

  return (
    <ToolLayout
      toolId="text-reverser"
      title="Text Reverser"
      description="Reverse string letters, sentence words, or document lines client-side."
      path="/tools/text-reverser"
      category="text"
      categoryPath="/?cat=text"
    >
      <div className="tool-box" style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          {["letters", "words", "lines"].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`btn-secondary ${mode === m ? "btn-primary" : ""}`}
              style={{ flex: 1, textTransform: "capitalize" }}
            >
              Reverse {m}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label className="label" htmlFor="rev-inp">Input Text</label>
            <textarea
              id="rev-inp"
              className="input-field"
              rows="4"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <label className="label" htmlFor="rev-out" style={{ marginBottom: 0 }}>Reversed Output</label>
              <button className="btn-secondary" style={{ fontSize: "11px", padding: "2px 6px" }} onClick={copyToClipboard}>
                📋 Copy
              </button>
            </div>
            <textarea
              id="rev-out"
              className="input-field"
              rows="4"
              readOnly
              value={reversedText}
            />
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}

export default TextReverser;
export { TextReverser };
