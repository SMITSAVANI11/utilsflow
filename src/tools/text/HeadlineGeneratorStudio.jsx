import { useState, useMemo } from "react";
import ToolLayout from "../../components/ToolLayout";

const CLICKBAIT_TEMPLATES = [
  "This 1 Simple Hack Will Change Your [Topic] Forever!",
  "10 Secrets About [Topic] The Experts Don't Want You To Know",
  "Why [Topic] Is Going Viral Right Now (And How To Benefit)",
  "What Happens When You Start [Topic]? The Results Are Shocking!",
  "Is [Topic] Actually Dead? The Real Truth Revealed",
  "Before You Try [Topic], You MUST Read This!",
  "The Hidden Danger of [Topic] Nobody Is Talking About",
  "How I Mastered [Topic] In Less Than 24 Hours",
  "Stop Doing [Topic]! Try This Instead",
  "This [Topic] Trend Is Taking Over: Here is Why"
];

const HOOK_TEMPLATES = [
  "Question Hook: Have you ever wondered why most people fail at [Topic]?",
  "Controversial Hook: Everything you've been told about [Topic] is a lie. Here is the truth.",
  "Statistical Hook: Over 87% of beginners get [Topic] completely wrong. Here is how to avoid it.",
  "Story Hook: I was struggling with [Topic] for months, until this one realization changed everything.",
  "Curiosity Hook: There is a secret trick to [Topic] that nobody wants to share. Let's talk about it."
];

function HeadlineGeneratorStudio({ initialTab = "clickbait" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [topic, setTopic] = useState("Vite Development");

  const results = useMemo(() => {
    const cleanTopic = topic.trim() || "Your Topic";
    if (activeTab === "clickbait") {
      return CLICKBAIT_TEMPLATES.map(tpl => tpl.replace(/\[Topic\]/gi, cleanTopic));
    } else {
      return HOOK_TEMPLATES.map(tpl => tpl.replace(/\[Topic\]/gi, cleanTopic));
    }
  }, [topic, activeTab]);

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }

  return (
    <ToolLayout
      toolId="headline-generator-studio"
      title="Headline & Hook Studio"
      description="Create clickbait headlines, optimize article titles, and build intro hooks client-side."
      path="/tools/headline-generator-studio"
      category="text"
      categoryPath="/?cat=text"
    >
      <div className="tool-box" style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* Navigation tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "16px" }}>
          {[
            { id: "clickbait", label: "Clickbait Title Generator" },
            { id: "hook", label: "Hook Generator" }
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
            <label className="label" htmlFor="hd-topic">Enter Your Topic / Keyword</label>
            <input
              id="hd-topic"
              type="text"
              className="input-field"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Remote Work, SEO Audit, Weight Loss"
            />
          </div>

          <div>
            <span className="label">Generated Output Choices</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
              {results.map((headline, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid var(--border)",
                    padding: "10px 14px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    gap: "10px"
                  }}
                >
                  <span>{headline}</span>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: "10px", padding: "4px 8px", flexShrink: 0 }}
                    onClick={() => copyToClipboard(headline)}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}

export default HeadlineGeneratorStudio;
export { HeadlineGeneratorStudio };
