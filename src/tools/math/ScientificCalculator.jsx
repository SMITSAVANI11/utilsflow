import { useState, useEffect } from "react";
import ToolLayout from "../../components/ToolLayout";

function ScientificCalculator() {
  const [display, setDisplay] = useState("");
  const [history, setHistory] = useState([]);
  const [isRad, setIsRad] = useState(true);

  // Handle keyboard inputs
  useEffect(() => {
    function handleKeyDown(e) {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
      const key = e.key;
      if (/[0-9]/.test(key)) {
        appendChar(key);
      } else if (["+", "-", "*", "/", ".", "(", ")"].includes(key)) {
        appendChar(key);
      } else if (key === "Enter") {
        calculateResult();
      } else if (key === "Backspace") {
        backspace();
      } else if (key === "Escape") {
        clearAll();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [display, isRad]);

  function appendChar(char) {
    setDisplay(prev => prev + char);
  }

  function clearAll() {
    setDisplay("");
  }

  function backspace() {
    setDisplay(prev => prev.slice(0, -1));
  }

  function calculateResult() {
    if (!display.trim()) return;
    try {
      // Replace symbols with JS Math equivalents
      let expression = display
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/sin\(/g, isRad ? "Math.sin(" : "Math.sin(Math.PI/180*")
        .replace(/cos\(/g, isRad ? "Math.cos(" : "Math.cos(Math.PI/180*")
        .replace(/tan\(/g, isRad ? "Math.tan(" : "Math.tan(Math.PI/180*")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/√\(/g, "Math.sqrt(")
        .replace(/\^/g, "**");

      // Count unclosed parentheses
      const openCount = (expression.match(/\(/g) || []).length;
      const closeCount = (expression.match(/\)/g) || []).length;
      if (openCount > closeCount) {
        expression += ")".repeat(openCount - closeCount);
      }

      // Safe evaluation using Function
      const res = new Function(`return ${expression}`)();
      if (Number.isNaN(res) || !Number.isFinite(res)) {
        throw new Error("Invalid output");
      }
      setHistory(prev => [`${display} = ${res}`, ...prev.slice(0, 9)]);
      setDisplay(String(res));
    } catch (err) {
      setDisplay("Error");
      setTimeout(() => setDisplay(""), 1200);
    }
  }

  return (
    <ToolLayout
      toolId="scientific-calculator"
      title="Scientific Calculator"
      description="Perform complex mathematical calculations, trigonometric equations, logarithms, exponents, and history tracking client-side."
      path="/tools/scientific-calculator"
      category="math"
      categoryPath="/?cat=math"
    >
      <div className="tool-box" style={{ maxWidth: "420px", margin: "0 auto" }}>
        {/* Screen */}
        <div style={{
          background: "rgba(0, 0, 0, 0.3)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "16px",
          textAlign: "right",
          marginBottom: "16px",
          position: "relative"
        }}>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", minHeight: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {history[0] || ""}
          </div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "var(--primary-light)", wordBreak: "break-all", minHeight: "36px", marginTop: "4px" }}>
            {display || "0"}
          </div>
          <span style={{
            position: "absolute",
            left: "12px",
            top: "12px",
            fontSize: "10px",
            fontWeight: "bold",
            background: "var(--primary)",
            color: "white",
            padding: "2px 6px",
            borderRadius: "3px"
          }}>
            {isRad ? "RAD" : "DEG"}
          </span>
        </div>

        {/* Action controls */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", gap: "8px" }}>
          <button className="btn-secondary" style={{ flex: 1, padding: "6px" }} onClick={() => setIsRad(!isRad)}>
            Toggle Rad/Deg
          </button>
          <button className="btn-secondary" style={{ flex: 1, padding: "6px" }} onClick={clearAll}>
            AC
          </button>
          <button className="btn-secondary" style={{ flex: 1, padding: "6px" }} onClick={backspace}>
            ⌫
          </button>
        </div>

        {/* Buttons Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "8px"
        }}>
          {[
            { label: "sin", act: () => appendChar("sin(") },
            { label: "cos", act: () => appendChar("cos(") },
            { label: "tan", act: () => appendChar("tan(") },
            { label: "(", act: () => appendChar("(") },
            { label: ")", act: () => appendChar(")") },

            { label: "ln", act: () => appendChar("ln(") },
            { label: "log", act: () => appendChar("log(") },
            { label: "xʸ", act: () => appendChar("^") },
            { label: "√", act: () => appendChar("√(") },
            { label: "÷", act: () => appendChar("/") },

            { label: "π", act: () => appendChar("π") },
            { label: "7", act: () => appendChar("7"), isNum: true },
            { label: "8", act: () => appendChar("8"), isNum: true },
            { label: "9", act: () => appendChar("9"), isNum: true },
            { label: "×", act: () => appendChar("*") },

            { label: "e", act: () => appendChar("e") },
            { label: "4", act: () => appendChar("4"), isNum: true },
            { label: "5", act: () => appendChar("5"), isNum: true },
            { label: "6", act: () => appendChar("6"), isNum: true },
            { label: "-", act: () => appendChar("-") },

            { label: "EXP", act: () => appendChar("*10^") },
            { label: "1", act: () => appendChar("1"), isNum: true },
            { label: "2", act: () => appendChar("2"), isNum: true },
            { label: "3", act: () => appendChar("3"), isNum: true },
            { label: "+", act: () => appendChar("+") },

            { label: "Ans", act: () => {
              if (history[0]) {
                const parts = history[0].split(" = ");
                appendChar(parts[1] || "");
              }
            }},
            { label: "0", act: () => appendChar("0"), isNum: true },
            { label: ".", act: () => appendChar("."), isNum: true },
            { label: "=", act: calculateResult, isEq: true }
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.act}
              style={{
                gridColumn: btn.label === "=" ? "span 2" : "auto",
                padding: "14px 0",
                fontSize: "15px",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                cursor: "pointer",
                background: btn.isEq
                  ? "var(--primary)"
                  : btn.isNum
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.03)",
                color: btn.isEq ? "white" : "var(--text-primary)",
                transition: "background 0.2s"
              }}
              onMouseOver={e => e.currentTarget.style.background = btn.isEq ? "var(--primary-light)" : "rgba(255,255,255,0.15)"}
              onMouseOut={e => e.currentTarget.style.background = btn.isEq ? "var(--primary)" : btn.isNum ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)"}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* History Log */}
        {history.length > 0 && (
          <div style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Calculation History</span>
              <button style={{ fontSize: "10px", padding: "2px 6px" }} className="btn-secondary" onClick={() => setHistory([])}>
                Clear
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "100px", overflowY: "auto" }}>
              {history.map((h, idx) => (
                <div key={idx} style={{ fontSize: "12px", color: "var(--text-secondary)", borderBottom: "1px solid rgba(255,255,255,0.02)", paddingBottom: "4px" }}>
                  {h}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default ScientificCalculator;
