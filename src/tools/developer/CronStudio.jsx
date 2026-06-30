import { useState, useMemo } from "react";
import ToolLayout from "../../components/ToolLayout";

function CronStudio({ initialTab = "generator" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Generator State
  const [min, setMin] = useState("*");
  const [hour, setHour] = useState("*");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");

  // Tester State
  const [testExpr, setTestExpr] = useState("*/5 9-17 * * 1-5");

  const generatedExpression = `${min} ${hour} ${dom} ${month} ${dow}`;

  // Simple Cron to Human Translator
  function cronToHuman(expr) {
    const parts = expr.split(/\s+/);
    if (parts.length < 5) return "Invalid Cron Expression (must contain 5 fields)";

    const [m, h, d, mo, w] = parts;

    let minuteStr = m === "*" ? "every minute" : m.startsWith("*/") ? `every ${m.slice(2)} minutes` : `at minute ${m}`;
    let hourStr = h === "*" ? "every hour" : h.startsWith("*/") ? `every ${h.slice(2)} hours` : `at hour ${h}`;
    let domStr = d === "*" ? "every day of the month" : `on day ${d} of the month`;
    let monthStr = mo === "*" ? "every month" : `in month ${mo}`;
    let dowStr = w === "*" ? "every day of the week" : `on weekday ${w}`;

    return `Executes ${minuteStr}, ${hourStr}, ${domStr}, ${monthStr}, ${dowStr}.`;
  }

  const testTranslation = useMemo(() => {
    return cronToHuman(testExpr);
  }, [testExpr]);

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }

  return (
    <ToolLayout
      toolId="cron-studio"
      title="Cron Expression Studio"
      description="Build cron strings interactively, translate custom expressions into human-readable descriptions, and inspect schedules client-side."
      path="/tools/cron-studio"
      category="developer"
      categoryPath="/?cat=developer"
    >
      <div className="tool-box" style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* Navigation tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("generator")}
            className={`btn-secondary ${activeTab === "generator" ? "btn-primary" : ""}`}
            style={{ flex: 1, fontSize: "13px" }}
          >
            ⚙️ Cron Generator
          </button>
          <button
            onClick={() => setActiveTab("tester")}
            className={`btn-secondary ${activeTab === "tester" ? "btn-primary" : ""}`}
            style={{ flex: 1, fontSize: "13px" }}
          >
            🔬 Cron Tester & Explainer
          </button>
        </div>

        {/* Tab 1: Generator */}
        {activeTab === "generator" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="cron-gen-min">Minutes</label>
                <select id="cron-gen-min" className="input-field" value={min} onChange={e => setMin(e.target.value)}>
                  <option value="*">Every Minute (*)</option>
                  <option value="*/5">Every 5 Min (*/5)</option>
                  <option value="*/10">Every 10 Min (*/10)</option>
                  <option value="*/15">Every 15 Min (*/15)</option>
                  <option value="0">At Minute 0 (Hour Start)</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="cron-gen-hr">Hours</label>
                <select id="cron-gen-hr" className="input-field" value={hour} onChange={e => setHour(e.target.value)}>
                  <option value="*">Every Hour (*)</option>
                  <option value="*/2">Every 2 Hours (*/2)</option>
                  <option value="*/6">Every 6 Hours (*/6)</option>
                  <option value="0">At Midnight (0)</option>
                  <option value="12">At Noon (12)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="label" htmlFor="cron-gen-dom">Day of Month</label>
                <select id="cron-gen-dom" className="input-field" value={dom} onChange={e => setDom(e.target.value)}>
                  <option value="*">Every Day (*)</option>
                  <option value="1">1st of Month</option>
                  <option value="15">15th of Month</option>
                  <option value="1-5">1st through 5th</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="cron-gen-mo">Month</label>
                <select id="cron-gen-mo" className="input-field" value={month} onChange={e => setMonth(e.target.value)}>
                  <option value="*">Every Month (*)</option>
                  <option value="1">January</option>
                  <option value="6">June</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="cron-gen-dow">Day of Week</label>
                <select id="cron-gen-dow" className="input-field" value={dow} onChange={e => setDow(e.target.value)}>
                  <option value="*">Every Weekday (*)</option>
                  <option value="1-5">Mon - Fri (1-5)</option>
                  <option value="0,6">Sat & Sun (0,6)</option>
                </select>
              </div>
            </div>

            {/* Generated output */}
            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "16px",
              marginTop: "12px",
              textAlign: "center"
            }}>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Generated Cron Expression</span>
              <div style={{ fontSize: "24px", fontFamily: "monospace", fontWeight: "bold", color: "var(--primary-light)", margin: "8px 0" }}>
                {generatedExpression}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                {cronToHuman(generatedExpression)}
              </div>
              <button className="btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => copyToClipboard(generatedExpression)}>
                📋 Copy Cron Expression
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Tester */}
        {activeTab === "tester" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="label" htmlFor="cron-test-expr">Paste Cron Expression (5 Fields)</label>
              <input
                id="cron-test-expr"
                type="text"
                className="input-field"
                value={testExpr}
                onChange={e => setTestExpr(e.target.value)}
                placeholder="e.g. */5 9-17 * * 1-5"
                style={{ fontFamily: "monospace" }}
              />
            </div>

            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "16px",
              marginTop: "4px"
            }}>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Human-Readable Translation:</span>
              <p style={{ fontSize: "14px", fontWeight: "500", marginTop: "6px", color: "var(--primary-light)" }}>
                {testTranslation}
              </p>
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}

export default CronStudio;
export { CronStudio };
