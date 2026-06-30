import { useState, useMemo } from "react";
import ToolLayout from "../../components/ToolLayout";

function WordCounter() {
  const [text, setText] = useState("Hello world! Hello again. This is a sample text for analyzing word frequency and n-grams. Reading ease scores will be generated automatically.");
  const [activeTab, setActiveTab] = useState("counts");

  // Basic Count Stats
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    const chars = text.length;
    const charsNoSp = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    const lines = text === "" ? 0 : text.split("\n").length;
    const readTime = Math.ceil(words / 200); // 200 words per minute average

    return { words, chars, charsNoSp, sentences, paragraphs, lines, readTime };
  }, [text]);

  // Word Frequency
  const wordFrequency = useMemo(() => {
    if (!text.trim()) return [];
    // Normalize and clean words
    const cleanWords = text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      .split(/\s+/)
      .filter(w => w.length > 1);

    const freqMap = {};
    cleanWords.forEach(w => {
      freqMap[w] = (freqMap[w] || 0) + 1;
    });

    return Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15); // Top 15 words
  }, [text]);

  // N-Grams (Bigrams & Trigrams)
  const nGrams = useMemo(() => {
    if (!text.trim()) return { bigrams: [], trigrams: [] };
    const cleanWords = text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      .split(/\s+/)
      .filter(w => w.length > 0);

    const bigramsMap = {};
    const trigramsMap = {};

    for (let i = 0; i < cleanWords.length - 1; i++) {
      const bg = `${cleanWords[i]} ${cleanWords[i + 1]}`;
      bigramsMap[bg] = (bigramsMap[bg] || 0) + 1;
    }

    for (let i = 0; i < cleanWords.length - 2; i++) {
      const tg = `${cleanWords[i]} ${cleanWords[i + 1]} ${cleanWords[i + 2]}`;
      trigramsMap[tg] = (trigramsMap[tg] || 0) + 1;
    }

    const sortMap = (map) => Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
    return {
      bigrams: sortMap(bigramsMap),
      trigrams: sortMap(trigramsMap)
    };
  }, [text]);

  // Flesch Reading Ease score
  const readabilityScore = useMemo(() => {
    const { words, sentences } = stats;
    if (words < 5 || sentences === 0) return { score: 100, level: "Very Easy", desc: "No content or text too short." };

    // Basic syllable counter
    const countSyllables = (word) => {
      let w = word.toLowerCase();
      if (w.length <= 3) return 1;
      w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
      w = w.replace(/^y/, "");
      const syllables = w.match(/[aeiouy]{1,2}/g);
      return syllables ? syllables.length : 1;
    };

    const cleanWords = text.replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
    const totalSyllables = cleanWords.reduce((acc, w) => acc + countSyllables(w), 0);

    // Flesch Reading Ease Formula: 206.835 - 1.015 * (totalWords/totalSentences) - 84.6 * (totalSyllables/totalWords)
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (totalSyllables / words);
    const rounded = Math.max(0, Math.min(100, Math.round(score)));

    let level = "College Graduate";
    let desc = "Very difficult to read. Best understood by university graduates.";

    if (rounded >= 90) {
      level = "5th Grade";
      desc = "Very easy to read. Easily understood by an average 11-year-old student.";
    } else if (rounded >= 80) {
      level = "6th Grade";
      desc = "Easy to read. Conversational English for consumers.";
    } else if (rounded >= 70) {
      level = "7th Grade";
      desc = "Fairly easy to read. Average conversational text.";
    } else if (rounded >= 60) {
      level = "8th & 9th Grade";
      desc = "Plain English. Easily understood by 13 to 15-year-old students.";
    } else if (rounded >= 50) {
      level = "Fairly Difficult";
      desc = "Somewhat difficult to read. Suitable for high school level.";
    } else if (rounded >= 30) {
      level = "Difficult";
      desc = "Difficult to read. Best suited for college-level audience.";
    }

    return { score: rounded, level, desc };
  }, [text, stats]);

  return (
    <ToolLayout
      toolId="word-counter"
      title="Word Counter & Text Analyzer"
      description="Calculate words, characters, paragraphs, word usage frequency, bigram/trigram patterns, and readability scores client-side."
      path="/tools/word-counter"
      category="text"
      categoryPath="/?cat=text"
    >
      <div className="tool-box">
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "16px" }}>
          {[
            { id: "counts", label: "Stats & Counters" },
            { id: "frequency", label: "Word Frequency" },
            { id: "ngrams", label: "N-Gram Analyzer" },
            { id: "readability", label: "Readability Score" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn-secondary ${activeTab === tab.id ? "btn-primary" : ""}`}
              style={{ fontSize: "13px", padding: "8px 14px", flexShrink: 0 }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Text Input area */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <label className="label" htmlFor="wc-text-area" style={{ marginBottom: 0 }}>Input Text</label>
            {text && (
              <button className="btn-secondary" style={{ fontSize: "11px", padding: "3px 8px" }} onClick={() => setText("")}>
                🗑️ Clear Text
              </button>
            )}
          </div>
          <textarea
            id="wc-text-area"
            className="input-field"
            rows="6"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type or paste your content to analyze metrics..."
          />
        </div>

        {/* Tab 1: Stats & Counters */}
        {activeTab === "counts" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "12px",
            marginTop: "16px"
          }}>
            {[
              { label: "Words", value: stats.words, color: "var(--primary-light)" },
              { label: "Characters", value: stats.chars, color: "var(--primary-light)" },
              { label: "No Spaces", value: stats.charsNoSp, color: "var(--primary-light)" },
              { label: "Sentences", value: stats.sentences, color: "var(--primary-light)" },
              { label: "Paragraphs", value: stats.paragraphs, color: "var(--primary-light)" },
              { label: "Total Lines", value: stats.lines, color: "var(--primary-light)" },
              { label: "Est. Read Time", value: `${stats.readTime} min`, color: "var(--primary-light)" }
            ].map((stat, i) => (
              <div key={i} style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "16px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px", textTransform: "uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Word Frequency */}
        {activeTab === "frequency" && (
          <div>
            <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "12px" }}>
              📊 Word Frequency List (Top Words)
            </h4>
            {wordFrequency.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Please type enough text to extract word counts.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                {wordFrequency.map(([word, freq], idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid var(--border)",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    fontSize: "13px"
                  }}>
                    <span style={{ fontWeight: 600 }}>{idx + 1}. {word}</span>
                    <span style={{ color: "var(--primary-light)" }}>{freq} times</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: N-Grams */}
        {activeTab === "ngrams" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="editor-grid">
            {/* Bigrams */}
            <div>
              <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "12px" }}>
                🔗 Bigrams (2-word phrases)
              </h4>
              {nGrams.bigrams.length === 0 ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>No bigrams found.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {nGrams.bigrams.map(([phrase, freq], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", paddingBottom: "4px", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                      <span>{phrase}</span>
                      <span style={{ color: "var(--primary-light)" }}>{freq}x</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trigrams */}
            <div>
              <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "12px" }}>
                🔗 Trigrams (3-word phrases)
              </h4>
              {nGrams.trigrams.length === 0 ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>No trigrams found.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {nGrams.trigrams.map(([phrase, freq], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", paddingBottom: "4px", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                      <span>{phrase}</span>
                      <span style={{ color: "var(--primary-light)" }}>{freq}x</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Readability */}
        {activeTab === "readability" && (
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "20px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              Flesch Reading Ease Score
            </div>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "var(--primary-light)", marginBottom: "8px" }}>
              {readabilityScore.score} / 100
            </div>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "6px" }}>
              Level: {readabilityScore.level}
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "400px", margin: "0 auto" }}>
              {readabilityScore.desc}
            </p>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}

export default WordCounter;
export { WordCounter };
