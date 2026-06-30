import { useState, useMemo } from "react";
import ToolLayout from "../../components/ToolLayout";

// Seed tags database
const YT_TAG_SEEDS = [
  "tutorial", "for beginners", "explained", "course", "guide", "tips", "tricks", "hacks",
  "review", "comparison", "crash course", "complete guide", "trends", "basics", "advanced"
];

function YouTubeSEOTools({ initialTab = "tags" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // 1. Tag / Keyword Generator
  const [tagTopic, setTagTopic] = useState("");
  const [generatedTags, setGeneratedTags] = useState([]);

  function generateTagsAndKeywords() {
    if (!tagTopic.trim()) return;
    const topic = tagTopic.trim().toLowerCase();
    
    // Mix topic with popular suffix options
    const list = [topic];
    YT_TAG_SEEDS.forEach(seed => {
      list.push(`${topic} ${seed}`);
      if (Math.random() > 0.6) {
        list.push(`${seed} ${topic}`);
      }
    });
    // Add generic relevant tags
    list.push("how to", "learning", "education", "tutorial");
    
    setGeneratedTags(list.slice(0, 15));
  }

  // 2. Title & Description Generator
  const [videoTopic, setVideoTopic] = useState("");
  const [titleTone, setTitleTone] = useState("exciting");
  
  const generatedTitles = useMemo(() => {
    if (!videoTopic.trim()) return [];
    const topic = videoTopic.trim();
    if (titleTone === "clickbait") {
      return [
        `I Tried ${topic} and THIS Happened! 😱`,
        `Why Everyone is WRONG About ${topic}!`,
        `The Hidden Truth of ${topic} they don't want you to know!`,
        `Stop Doing ${topic} the Old Way!`,
        `This ONE ${topic} Trick Will Change Your Life!`
      ];
    }
    if (titleTone === "educational") {
      return [
        `${topic} Explained: Step-by-Step Guide for Beginners`,
        `Ultimate Crash Course: Master ${topic} in 10 Minutes`,
        `How to Use ${topic} (Complete Tutorial)`,
        `Understanding ${topic} - Core Principles and Concepts`,
        `Top 5 Best Practices for ${topic}`
      ];
    }
    return [
      `🚀 Mind-Blowing ${topic} Secrets Revealed!`,
      `How to Master ${topic} Instantly!`,
      `The Ultimate ${topic} Setup Guide (2026)`,
      `Why ${topic} is the Future of Development`,
      `Create a Full App with ${topic} (Live Coding)`
    ];
  }, [videoTopic, titleTone]);

  const generatedDescription = useMemo(() => {
    if (!videoTopic.trim()) return "";
    return `In this video, we dive deep into ${videoTopic} and explore how to use it effectively. 

Don't forget to SUBSCRIBE for more content: http://bit.ly/subscribe-channel

📍 Timestamps:
0:00 - Introduction to ${videoTopic}
1:45 - Key Setup & Tools
4:20 - Core Implementation
8:10 - Best Practices
11:50 - Final Summary

💻 Source Code & Links:
- Official Docs: https://example.com/docs
- GitHub Repo: https://github.com/example/${videoTopic.toLowerCase().replace(/\s+/g, "-")}

#${videoTopic.replace(/\s+/g, "")} #youtube #tutorial`;
  }, [videoTopic]);

  // 3. Hashtag Generator
  const [hashTopic, setHashTopic] = useState("");
  const generatedHashtags = useMemo(() => {
    if (!hashTopic.trim()) return [];
    const base = hashTopic.trim().replace(/\s+/g, "");
    return [
      `#${base}`,
      `#${base}Tutorial`,
      `#${base}Tips`,
      `#${base}Guide`,
      `#${base}2026`,
      `#Learn${base}`,
      `#HowTo${base}`
    ];
  }, [hashTopic]);

  // 4. Thumbnail Downloader
  const [ytUrl, setYtUrl] = useState("");
  const videoId = useMemo(() => {
    if (!ytUrl.trim()) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = ytUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  }, [ytUrl]);

  function copyText(txt) {
    navigator.clipboard.writeText(txt);
    alert("Copied to clipboard!");
  }

  return (
    <ToolLayout
      toolId="youtube-seo-studio"
      title="YouTube Video SEO Studio"
      description="Inspect video thumbnail URLs, construct title variants, auto-generate tags, and draft timestamped descriptions client-side."
      path="/tools/youtube-seo-studio"
      category="seo"
      categoryPath="/?cat=seo"
    >
      <div className="tool-box">
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "20px" }}>
          {[
            { id: "tags", label: "Tag Generator" },
            { id: "titles", label: "Title & Desc Builder" },
            { id: "hashtags", label: "Hashtags" },
            { id: "thumbnail", label: "Thumbnail Downloader" },
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

        {/* Tab 1: Tags Generator */}
        {activeTab === "tags" && (
          <div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <input
                type="text"
                className="input-field"
                placeholder="Enter video topic (e.g. React Hooks)"
                value={tagTopic}
                onChange={e => setTagTopic(e.target.value)}
              />
              <button className="btn-primary" onClick={generateTagsAndKeywords}>
                🔍 Generate Tags
              </button>
            </div>

            {generatedTags.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Generated Tags (comma separated):</span>
                  <button className="btn-secondary" style={{ fontSize: "11px", padding: "4px 8px" }} onClick={() => copyText(generatedTags.join(", "))}>
                    📋 Copy Tag String
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", border: "1px solid var(--border)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
                  {generatedTags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                        padding: "3px 8px",
                        fontSize: "12px",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Title & Desc Builder */}
        {activeTab === "titles" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="editor-grid">
            <div>
              <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", textTransform: "uppercase", marginBottom: "12px" }}>
                ⚙️ Title Inputs
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label className="label" htmlFor="yt-topic-inp">Video Topic</label>
                  <input type="text" id="yt-topic-inp" className="input-field" placeholder="e.g. Excel Pivot Tables" value={videoTopic} onChange={e => setVideoTopic(e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="yt-tone-sel">Optimize Tone</label>
                  <select id="yt-tone-sel" className="input-field" value={titleTone} onChange={e => setTitleTone(e.target.value)}>
                    <option value="exciting">Exciting / Dynamic</option>
                    <option value="educational">Educational / Guide</option>
                    <option value="clickbait">Clickbait Hook</option>
                  </select>
                </div>
              </div>

              {generatedTitles.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <label className="label">Suggested Title Options</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {generatedTitles.map((t, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: "8px", border: "1px solid var(--border)", borderRadius: "4px" }}>
                        <span style={{ fontSize: "12px", color: "var(--text-primary)" }}>{t}</span>
                        <button className="btn-secondary" style={{ fontSize: "10px", padding: "2px 6px" }} onClick={() => copyText(t)}>
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", textTransform: "uppercase", marginBottom: "12px" }}>
                📝 Template Description Output
              </h4>
              {generatedDescription ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <textarea className="input-field" readOnly rows="8" value={generatedDescription} style={{ fontFamily: "monospace", fontSize: "12px" }} />
                  <button className="btn-primary" onClick={() => copyText(generatedDescription)} style={{ justifyContent: "center" }}>
                    📋 Copy Description Block
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Enter a topic to generate template description.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Hashtags */}
        {activeTab === "hashtags" && (
          <div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <input
                type="text"
                className="input-field"
                placeholder="Enter base hashtag word (e.g. JavaScript)"
                value={hashTopic}
                onChange={e => setHashTopic(e.target.value)}
              />
            </div>

            {generatedHashtags.length > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Generated Hashtags:</span>
                  <button className="btn-secondary" style={{ fontSize: "11px", padding: "4px 8px" }} onClick={() => copyText(generatedHashtags.join(" "))}>
                    📋 Copy Hashtags
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {generatedHashtags.map((h, i) => (
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
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Thumbnail Downloader */}
        {activeTab === "thumbnail" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <label className="label" htmlFor="yt-url-inp">Enter YouTube Video URL</label>
              <input
                id="yt-url-inp"
                type="text"
                className="input-field"
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                value={ytUrl}
                onChange={e => setYtUrl(e.target.value)}
              />
            </div>

            {videoId ? (
              <div>
                <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "16px", textTransform: "uppercase" }}>
                  🖼️ Available Thumbnail Sizes
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                  {[
                    { label: "Max Resolution (1080p)", url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
                    { label: "High Quality (480p)", url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
                    { label: "Medium Quality (360p)", url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` }
                  ].map((size, idx) => (
                    <div key={idx} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px", textAlign: "center" }}>
                      <div style={{ height: "120px", background: "black", borderRadius: "4px", overflow: "hidden", marginBottom: "10px" }}>
                        <img src={size.url} alt={size.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>{size.label}</div>
                      <a href={size.url} target="_blank" rel="noreferrer" className="btn-primary" style={{ fontSize: "11px", padding: "6px 12px", display: "inline-flex", textDecoration: "none", justifyContent: "center" }}>
                        📥 View & Download Image
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              ytUrl && <div style={{ color: "#ef5350", fontSize: "14px", fontWeight: 600 }}>❌ Could not extract Video ID from the entered YouTube link.</div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default YouTubeSEOTools;
