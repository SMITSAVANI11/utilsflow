import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

// English stop words for keyword extraction
const STOP_WORDS = new Set([
  "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves",
  "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
  "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are",
  "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
  "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about",
  "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up",
  "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when",
  "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no",
  "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don",
  "should", "now"
]);

function countSyllables(word) {
  let w = word.toLowerCase().trim();
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  w = w.replace(/^y/, '');
  const syl = w.match(/[aeiouy]{1,2}/g);
  return syl ? syl.length : 1;
}

function analyzeFleschScore(words, sentences, syllables) {
  if (words === 0 || sentences === 0) return 0;
  // Flesch Reading Ease Formula
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, score));
}

function getFleschDescription(score) {
  if (score >= 90) return { grade: "5th Grade", ease: "Very Easy", desc: "Easy to read for an average 11-year-old." };
  if (score >= 80) return { grade: "6th Grade", ease: "Easy", desc: "Conversational English for consumers." };
  if (score >= 70) return { grade: "7th Grade", ease: "Fairly Easy", desc: "Easily understood by standard audiences." };
  if (score >= 60) return { grade: "8th-9th Grade", ease: "Standard / Plain English", desc: "Optimal readability for web content." };
  if (score >= 50) return { grade: "10th-12th Grade", ease: "Fairly Difficult", desc: "High school level language." };
  if (score >= 30) return { grade: "College", ease: "Difficult", desc: "Academic or professional prose." };
  return { grade: "College Graduate", ease: "Very Confusing", desc: "Best suited for scientific journals and legal briefs." };
}

function SEOContentAnalyzer({ initialTab = "audit" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Content Audit State
  const [contentText, setContentText] = useState("");
  const [auditResults, setAuditResults] = useState(null);

  // Comparer State
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [comparerResults, setComparerResults] = useState(null);

  function performAudit() {
    if (!contentText.trim()) return;

    // Simple text cleans
    const plainText = contentText.replace(/<[^>]*>/g, " ");
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = plainText.toLowerCase().match(/\b[a-z']+\b/g) || [];
    
    const wordCount = words.length;
    const sentenceCount = Math.max(1, sentences.length);
    const charCount = contentText.length;

    // Calculate total syllables
    let totalSyllables = 0;
    const frequencyMap = {};
    
    words.forEach(w => {
      totalSyllables += countSyllables(w);
      if (!STOP_WORDS.has(w)) {
        frequencyMap[w] = (frequencyMap[w] || 0) + 1;
      }
    });

    const readabilityScore = analyzeFleschScore(wordCount, sentenceCount, totalSyllables);

    // HTML Headings parser
    const headings = [];
    const headingRegex = /<(h[1-6])\b[^>]*>(.*?)<\/\1>/gi;
    let match;
    while ((match = headingRegex.exec(contentText)) !== null) {
      headings.push({ tag: match[1].toUpperCase(), text: match[2].replace(/<[^>]*>/g, "").trim() });
    }

    // HTML Alt tag audits
    let totalImages = 0;
    let missingAlt = 0;
    const imgRegex = /<img\b[^>]*>/gi;
    const altRegex = /\balt\s*=\s*(['"])(.*?)\1/i;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(contentText)) !== null) {
      totalImages++;
      if (!altRegex.test(imgMatch[0])) {
        missingAlt++;
      }
    }

    // Suggest key target link terms
    const sortedKeywords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    setAuditResults({
      wordCount,
      sentenceCount,
      charCount,
      readabilityScore,
      headings,
      totalImages,
      missingAlt,
      sortedKeywords,
    });
  }

  function performComparison() {
    const wordsA = textA.toLowerCase().match(/\b[a-z']+\b/g) || [];
    const wordsB = textB.toLowerCase().match(/\b[a-z']+\b/g) || [];

    const setA = new Set(wordsA);
    const setB = new Set(wordsB);

    if (setA.size === 0 && setB.size === 0) return;

    // 1. Duplicate check (Jaccard similarity overlap)
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    const similarity = (intersection.size / union.size) * 100;

    // 2. Content Gap check (Words in A not in B)
    const gapWords = [...setA].filter(x => !setB.has(x) && !STOP_WORDS.has(x)).slice(0, 10);

    setComparerResults({
      similarity: similarity.toFixed(1),
      gapWords,
      totalUniqueA: setA.size,
      totalUniqueB: setB.size,
    });
  }

  return (
    <ToolLayout
      toolId="seo-content-analyzer"
      title="SEO Content Audit Workspace"
      description="Inspect web page copy or HTML elements. Measure reading difficulty grade levels, verify heading orders, find keyword content gaps, and audit duplicate text proportions."
      path="/tools/seo-content-analyzer"
      category="seo"
      categoryPath="/?cat=seo"
    >
      <div className="tool-box">
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "20px" }}>
          {[
            { id: "audit", label: "Readability & SEO Audit" },
            { id: "compare", label: "Duplicate & Gap Analyzer" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn-secondary ${activeTab === tab.id ? "btn-primary" : ""}`}
              style={{ fontSize: "13px", padding: "8px 16px" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Content Audit */}
        {activeTab === "audit" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <label className="label" htmlFor="audit-txt-inp">Paste Article Copy or HTML Markup Code</label>
              <textarea
                id="audit-txt-inp"
                className="input-field"
                rows="8"
                placeholder="Paste your content here to review headings structure, reading ease metrics, missing image alt tags, and target keyword suggestions..."
                value={contentText}
                onChange={e => setContentText(e.target.value)}
              />
              <button
                className="btn-primary"
                onClick={performAudit}
                style={{ width: "100%", marginTop: "12px", justifyContent: "center" }}
              >
                🔬 Audit Content
              </button>
            </div>

            {auditResults && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="editor-grid">
                {/* Left panel: Statistics */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "10px", textTransform: "uppercase" }}>
                      📊 Document Metrics
                    </h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                      <tbody>
                        {[
                          { l: "Words", v: auditResults.wordCount },
                          { l: "Sentences", v: auditResults.sentenceCount },
                          { l: "Characters", v: auditResults.charCount },
                          { l: "Est. Reading Time", v: `${Math.ceil(auditResults.wordCount / 200)} min` },
                        ].map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                            <td style={{ padding: "8px 0", color: "var(--text-secondary)", fontWeight: 500 }}>{row.l}</td>
                            <td style={{ padding: "8px 0", color: "var(--text-primary)" }}>{row.v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "10px", textTransform: "uppercase" }}>
                      📖 Readability (Flesch-Kincaid)
                    </h4>
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Reading Ease Score:</span>
                        <strong style={{ fontSize: "20px", color: "var(--primary)" }}>{auditResults.readabilityScore.toFixed(1)} / 100</strong>
                      </div>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {getFleschDescription(auditResults.readabilityScore).ease} ({getFleschDescription(auditResults.readabilityScore).grade})
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {getFleschDescription(auditResults.readabilityScore).desc}
                      </p>
                    </div>
                  </div>

                  {/* Alt attributes audit */}
                  <div>
                    <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "10px", textTransform: "uppercase" }}>
                      🖼️ Image Alt Text Audit
                    </h4>
                    {auditResults.totalImages > 0 ? (
                      <p style={{ fontSize: "13px", color: auditResults.missingAlt > 0 ? "#ffb74d" : "#81c784" }}>
                        Found <strong>{auditResults.totalImages}</strong> image tags. <strong>{auditResults.missingAlt}</strong> are missing <code>alt</code> description tags.
                      </p>
                    ) : (
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>No HTML image tags found to inspect.</p>
                    )}
                  </div>
                </div>

                {/* Right panel: Headings and Link suggestions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "10px", textTransform: "uppercase" }}>
                      🔤 Heading Sequence Structure
                    </h4>
                    {auditResults.headings.length > 0 ? (
                      <div style={{ maxHeight: "180px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px", paddingRight: "4px" }}>
                        {auditResults.headings.map((h, i) => (
                          <div key={i} style={{ fontSize: "12px", paddingLeft: `${(parseInt(h.tag[1]) - 1) * 12}px` }}>
                            <span style={{
                              color: "var(--primary)",
                              marginRight: "6px",
                              fontWeight: "bold",
                              fontSize: "10px",
                              background: "rgba(255,255,255,0.05)",
                              padding: "2px 4px",
                              borderRadius: "3px"
                            }}>{h.tag}</span>
                            <span style={{ color: "var(--text-primary)" }}>{h.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>No heading tags found. Make sure to paste HTML markup code to test.</p>
                    )}
                  </div>

                  <div>
                    <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "10px", textTransform: "uppercase" }}>
                      🔗 Target Internal Link Suggestions
                    </h4>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                      Consider hyperlinking these frequent key terms to relevant topic subpages:
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {auditResults.sortedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          style={{
                            background: "rgba(33, 150, 243, 0.1)",
                            border: "1px solid rgba(33, 150, 243, 0.2)",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            fontSize: "13px",
                            color: "#64b5f6",
                          }}
                        >
                          🔗 {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Comparer */}
        {activeTab === "compare" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label className="label" htmlFor="text-a-inp">Source Content / Competitor text (Text A)</label>
                <textarea
                  id="text-a-inp"
                  className="input-field"
                  rows="6"
                  value={textA}
                  onChange={e => setTextA(e.target.value)}
                  placeholder="Paste main article or competitor content..."
                />
              </div>
              <div>
                <label className="label" htmlFor="text-b-inp">Your Content draft (Text B)</label>
                <textarea
                  id="text-b-inp"
                  className="input-field"
                  rows="6"
                  value={textB}
                  onChange={e => setTextB(e.target.value)}
                  placeholder="Paste your content draft to calculate duplicates and missing keywords..."
                />
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={performComparison}
              style={{ width: "100%", justifyContent: "center", marginBottom: "24px" }}
            >
              ⚖️ Run Duplication & Gap Analysis
            </button>

            {comparerResults && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="editor-grid">
                <div>
                  <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "10px", textTransform: "uppercase" }}>
                    🔥 Duplicate Content Score
                  </h4>
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
                    <div style={{ fontSize: "36px", fontWeight: "bold", color: Number(comparerResults.similarity) > 30 ? "#ffb74d" : "#81c784" }}>
                      {comparerResults.similarity}%
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px" }}>
                      Lexical Overlap Similarity between both texts.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "10px", textTransform: "uppercase" }}>
                    🎯 Content Gap Keywords
                  </h4>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                    Words found in Text A but missing in Text B (potential keywords to add):
                  </p>
                  {comparerResults.gapWords.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {comparerResults.gapWords.map((w, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "rgba(255, 152, 0, 0.1)",
                            border: "1px solid rgba(255, 152, 0, 0.2)",
                            color: "#ffb74d",
                            borderRadius: "4px",
                            padding: "3px 8px",
                            fontSize: "12px",
                          }}
                        >
                          ➕ {w}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "13px", color: "#81c784" }}>No significant content gaps found! Great job matching topics.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default SEOContentAnalyzer;
