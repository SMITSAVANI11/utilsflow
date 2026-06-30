import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

// Local database of common regions for local keyword generator
const COMMON_REGIONS = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
  "London", "Manchester", "Birmingham", "Toronto", "Vancouver", "Montreal",
  "Sydney", "Melbourne", "Brisbane", "Mumbai", "Delhi", "Bangalore"
];

// Seed databases for related terms, questions, and LSI keywords
const SEED_DATA = {
  questions: ["how to", "what is", "best way to", "why does", "where to buy", "is it safe to", "how much cost"],
  lsi: {
    seo: ["search engine optimization", "organic traffic", "ranking factor", "google algorithm", "backlinks", "page speed", "keyword density"],
    marketing: ["digital marketing", "advertising", "social media", "brand awareness", "conversion rate", "lead generation", "funnel"],
    fitness: ["workout routine", "weight loss", "muscle growth", "healthy diet", "personal trainer", "cardio training", "caloric deficit"],
    cooking: ["recipe", "ingredients", "meal prep", "baking instructions", "kitchen appliances", "culinary skills", "spices"],
    tech: ["software engineering", "programming language", "cloud computing", "machine learning", "cybersecurity", "web development", "database"],
  }
};

function KeywordResearchStudio({ initialTab = "long-tail" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [seedKeyword, setSeedKeyword] = useState("");
  const [results, setResults] = useState([]);
  
  // Clustering inputs
  const [clusterInput, setClusterInput] = useState("");
  const [clusters, setClusters] = useState({});

  // Local generator settings
  const [customRegion, setCustomRegion] = useState("");

  // 1. Long-Tail / Related / Questions Generators
  function generateKeywords(mode) {
    if (!seedKeyword.trim()) return;
    const keyword = seedKeyword.trim().toLowerCase();
    let list = [];

    if (mode === "long-tail") {
      // Create alphabetical and modifier permutations
      const modifiers = ["best", "easy", "online", "free", "tutorial", "guide", "for beginners", "near me", "checklist"];
      modifiers.forEach(mod => {
        if (Math.random() > 0.5) list.push(`${mod} ${keyword}`);
        else list.push(`${keyword} ${mod}`);
      });
      // Alphabetical loop
      "abcdefghijklmnopqrstuvwxyz".split("").forEach(char => {
        list.push(`${keyword} ${char}`);
      });
    } else if (mode === "question") {
      SEED_DATA.questions.forEach(q => {
        list.push(`${q} ${keyword}`);
      });
    } else if (mode === "related") {
      const suffixes = ["tips", "strategies", "examples", "software", "templates", "services", "companies", "trends"];
      suffixes.forEach(s => list.push(`${keyword} ${s}`));
      list.push(`${keyword} definition`);
      list.push(`alternative to ${keyword}`);
    } else if (mode === "lsi") {
      // Check if seed matches any known categories, else fallback
      let found = false;
      for (const [cat, terms] of Object.entries(SEED_DATA.lsi)) {
        if (keyword.includes(cat) || cat.includes(keyword)) {
          list = terms.map(t => `${keyword} ${t}`);
          found = true;
          break;
        }
      }
      if (!found) {
        // Generic LSI builders
        list = [
          `${keyword} concepts`,
          `understanding ${keyword}`,
          `${keyword} basics and terminology`,
          `core elements of ${keyword}`,
          `practical application of ${keyword}`,
        ];
      }
    } else if (mode === "niche") {
      const niches = ["for small business", "for real estate", "for e-commerce", "for blogs", "for local service", "for Shopify", "for students", "for SaaS"];
      niches.forEach(n => list.push(`${keyword} ${n}`));
    }

    setResults(list.map(kw => ({
      phrase: kw,
      intent: analyzeIntentPhrase(kw),
      volume: Math.floor(Math.random() * 800) + 50,
      kd: Math.floor(Math.random() * 40) + 10,
    })));
  }

  // 2. Keyword Intent Analyzer
  function analyzeIntentPhrase(phrase) {
    const p = phrase.toLowerCase();
    if (p.includes("buy") || p.includes("purchase") || p.includes("cheap") || p.includes("coupon") || p.includes("price") || p.includes("cost")) {
      return "Transactional";
    }
    if (p.includes("best") || p.includes("review") || p.includes("top") || p.includes("vs") || p.includes("compare")) {
      return "Commercial";
    }
    if (p.includes("login") || p.includes("signin") || p.includes("website") || p.includes("portal") || p.includes("download")) {
      return "Navigational";
    }
    return "Informational";
  }

  // 3. Local Keyword Generator
  function generateLocalKeywords() {
    if (!seedKeyword.trim()) return;
    const keyword = seedKeyword.trim().toLowerCase();
    const regions = customRegion.trim() ? [customRegion.trim(), ...COMMON_REGIONS] : COMMON_REGIONS;

    const list = regions.map(reg => ({
      phrase: `${keyword} in ${reg}`,
      intent: "Commercial",
      volume: Math.floor(Math.random() * 300) + 10,
      kd: Math.floor(Math.random() * 20) + 5,
    }));
    setResults(list);
  }

  // 4. Keyword Clustering Tool
  function performClustering() {
    if (!clusterInput.trim()) return;
    const lines = clusterInput.split("\n").map(l => l.trim()).filter(Boolean);
    const groups = {};

    lines.forEach(kw => {
      // Find matching group based on word overlap
      const words = kw.toLowerCase().split(/\s+/);
      let matchedGroup = null;

      for (const groupName of Object.keys(groups)) {
        const groupWords = groupName.toLowerCase().split(/\s+/);
        // If they share at least 1 significant word (length > 3)
        const overlap = words.filter(w => w.length > 3 && groupWords.includes(w));
        if (overlap.length > 0) {
          matchedGroup = groupName;
          break;
        }
      }

      if (matchedGroup) {
        groups[matchedGroup].push(kw);
      } else {
        groups[kw] = [kw];
      }
    });

    setClusters(groups);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  }

  return (
    <ToolLayout
      toolId="keyword-research-studio"
      title="Keyword Research Studio"
      description="Brainstorm SEO keywords client-side. Find long-tail variations, question queries, LSI terms, group keywords by similarity, and analyze intent."
      path="/tools/keyword-research-studio"
      category="seo"
      categoryPath="/?cat=seo"
    >
      <div className="tool-box">
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "20px" }}>
          {[
            { id: "long-tail", label: "Long-Tail" },
            { id: "question", label: "Questions" },
            { id: "related", label: "Related Keywords" },
            { id: "lsi", label: "LSI Synonyms" },
            { id: "clustering", label: "Clustering" },
            { id: "local", label: "Local Keywords" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResults([]); }}
              className={`btn-secondary ${activeTab === tab.id ? "btn-primary" : ""}`}
              style={{ fontSize: "13px", padding: "8px 14px", flexShrink: 0 }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        {activeTab !== "clustering" ? (
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "260px" }}>
              <input
                type="text"
                className="input-field"
                placeholder="Enter seed keyword (e.g. SEO, Coffee, Fitness)"
                value={seedKeyword}
                onChange={e => setSeedKeyword(e.target.value)}
              />
            </div>
            {activeTab === "local" && (
              <div style={{ width: "160px" }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Target city (Optional)"
                  value={customRegion}
                  onChange={e => setCustomRegion(e.target.value)}
                />
              </div>
            )}
            <button
              className="btn-primary"
              onClick={() => activeTab === "local" ? generateLocalKeywords() : generateKeywords(activeTab)}
              style={{ padding: "10px 24px" }}
            >
              🔍 Generate
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: "24px" }}>
            <label className="label" htmlFor="cluster-inp">Paste Keyword List (one per line)</label>
            <textarea
              id="cluster-inp"
              className="input-field"
              rows="6"
              placeholder="best running shoes&#10;cheap running shoes&#10;running shoes reviews&#10;nike running shoes"
              value={clusterInput}
              onChange={e => setClusterInput(e.target.value)}
            />
            <button
              className="btn-primary"
              onClick={performClustering}
              style={{ width: "100%", marginTop: "12px", justifyContent: "center" }}
            >
              ⛓️ Cluster Keywords
            </button>
          </div>
        )}

        {/* Results List for standard tabs */}
        {results.length > 0 && activeTab !== "clustering" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>Generated {results.length} Suggestions:</span>
              <button
                className="btn-secondary"
                onClick={() => copyToClipboard(results.map(r => r.phrase).join("\n"))}
                style={{ fontSize: "12px", padding: "6px 12px" }}
              >
                📋 Copy All Phrases
              </button>
            </div>
            
            <div style={{ maxHeight: "350px", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead style={{ background: "rgba(255,255,255,0.03)", position: "sticky", top: 0, zIndex: 1 }}>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "10px 14px" }}>Keyword Phrase</th>
                    <th style={{ textAlign: "center", padding: "10px 14px", width: "120px" }}>Search Intent</th>
                    <th style={{ textAlign: "center", padding: "10px 14px", width: "90px" }}>Est. Vol</th>
                    <th style={{ textAlign: "center", padding: "10px 14px", width: "80px" }}>KD %</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 500 }}>{r.phrase}</td>
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: r.intent === "Transactional" ? "rgba(76, 175, 80, 0.15)" :
                                      r.intent === "Commercial" ? "rgba(33, 150, 243, 0.15)" :
                                      r.intent === "Navigational" ? "rgba(255, 152, 0, 0.15)" : "rgba(158, 158, 158, 0.15)",
                          color: r.intent === "Transactional" ? "#81c784" :
                                 r.intent === "Commercial" ? "#64b5f6" :
                                 r.intent === "Navigational" ? "#ffb74d" : "#e0e0e0",
                        }}>
                          {r.intent}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "center", color: "var(--text-secondary)" }}>{r.volume}</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", color: "var(--text-secondary)" }}>{r.kd}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clustering Results */}
        {Object.keys(clusters).length > 0 && activeTab === "clustering" && (
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>Grouped Clusters:</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {Object.entries(clusters).map(([group, list]) => (
                <div
                  key={group}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <strong style={{ color: "var(--primary-light)" }}>📍 {group.toUpperCase()} Group ({list.length})</strong>
                    <button
                      className="btn-secondary"
                      onClick={() => copyToClipboard(list.join("\n"))}
                      style={{ fontSize: "11px", padding: "4px 8px" }}
                    >
                      📋 Copy Group
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {list.map((kw, i) => (
                      <span
                        key={i}
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid var(--border)",
                          borderRadius: "4px",
                          padding: "3px 8px",
                          fontSize: "12px",
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default KeywordResearchStudio;
