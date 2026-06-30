import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

function MetaTagStudio({ initialTab = "serp" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // States for metadata values
  const [title, setTitle] = useState("Example Site - Premium Online Web Utilities");
  const [description, setDescription] = useState("Explore free, fast, and local client-side developer, text, math, and design converters and checkers at Example Site.");
  const [url, setUrl] = useState("https://example.com/mypage");
  const [siteName, setSiteName] = useState("Example Site");
  const [imageUrl, setImageUrl] = useState("https://example.com/assets/og-image.jpg");
  
  // Robots & Canonical
  const [isIndex, setIsIndex] = useState(true);
  const [isFollow, setIsFollow] = useState(true);
  const [canonicalUrl, setCanonicalUrl] = useState("https://example.com/mypage");
  
  // Hreflang
  const [langCode, setLangCode] = useState("en-US");

  // Code Generation
  const robotsValue = `${isIndex ? "index" : "noindex"}, ${isFollow ? "follow" : "nofollow"}`;
  
  const generatedCode = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:site_name" content="${siteName}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">

<!-- Search Engines & Navigation -->
<meta name="robots" content="${robotsValue}">
<link rel="canonical" href="${canonicalUrl || url}">
<link rel="alternate" hreflang="${langCode}" href="${url}">`;

  function copyCode() {
    navigator.clipboard.writeText(generatedCode);
    alert("Meta Tags copied to clipboard!");
  }

  // Recommended limits
  const isTitleOk = title.length > 30 && title.length <= 60;
  const isDescOk = description.length > 50 && description.length <= 160;

  return (
    <ToolLayout
      toolId="meta-tag-studio"
      title="Meta Tag & SERP Studio"
      description="Create SEO metadata tags, Open Graph cards, and Twitter summary headers. Inspect live Google, Facebook, and Twitter search snippet card previews."
      path="/tools/meta-tag-studio"
      category="seo"
      categoryPath="/?cat=seo"
    >
      <div className="tool-box">
        {/* Sub-tool Selector */}
        <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "20px" }}>
          {[
            { id: "serp", label: "Google SERP Preview" },
            { id: "facebook", label: "Facebook Open Graph" },
            { id: "twitter", label: "Twitter Card" },
            { id: "code", label: "Get Meta Tag Code" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn-secondary ${activeTab === tab.id ? "btn-primary" : ""}`}
              style={{ fontSize: "12px", padding: "6px 12px" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="editor-grid">
          {/* Left Panel: Editing inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <label className="label" htmlFor="meta-title-inp">Meta Title</label>
                <span style={{ fontSize: "12px", color: isTitleOk ? "var(--success)" : "var(--text-secondary)" }}>
                  {title.length} / 60 chars (Recommended: 30-60)
                </span>
              </div>
              <input
                id="meta-title-inp"
                type="text"
                className="input-field"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <label className="label" htmlFor="meta-desc-inp">Meta Description</label>
                <span style={{ fontSize: "12px", color: isDescOk ? "var(--success)" : "var(--text-secondary)" }}>
                  {description.length} / 160 chars (Recommended: 50-160)
                </span>
              </div>
              <textarea
                id="meta-desc-inp"
                className="input-field"
                rows="3"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor="meta-url-inp">Page URL</label>
              <input
                id="meta-url-inp"
                type="text"
                className="input-field"
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label className="label" htmlFor="meta-site-inp">Site Name</label>
                <input
                  id="meta-site-inp"
                  type="text"
                  className="input-field"
                  value={siteName}
                  onChange={e => setSiteName(e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="meta-lang-inp">Language Hreflang</label>
                <input
                  id="meta-lang-inp"
                  type="text"
                  className="input-field"
                  value={langCode}
                  onChange={e => setLangCode(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="meta-img-inp">Open Graph Image URL</label>
              <input
                id="meta-img-inp"
                type="text"
                className="input-field"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
              />
            </div>

            {/* Robots Configuration */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "12px",
            }}>
              <label className="label">Search Index Settings (Robots.txt Meta)</label>
              <div style={{ display: "flex", gap: "16px", marginTop: "6px" }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                  <input type="checkbox" checked={isIndex} onChange={e => setIsIndex(e.target.checked)} />
                  Allow Search Indexing (Index)
                </label>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                  <input type="checkbox" checked={isFollow} onChange={e => setIsFollow(e.target.checked)} />
                  Follow Links (Follow)
                </label>
              </div>
            </div>
          </div>

          {/* Right Panel: Previews and Code */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* 1. Google SERP Preview */}
            {activeTab === "serp" && (
              <div>
                <label className="label">Google Desktop SERP Preview</label>
                <div style={{
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  color: "#202124",
                  fontFamily: "Arial, sans-serif",
                  textAlign: "left",
                }}>
                  <div style={{ fontSize: "12px", color: "#202124", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span>🌐</span>
                    <span>{url.substring(0, 45)}{url.length > 45 ? "..." : ""}</span>
                  </div>
                  <h3 style={{
                    fontSize: "20px",
                    lineHeight: "1.3",
                    color: "#1a0dab",
                    margin: "0 0 4px 0",
                    fontWeight: 400,
                    cursor: "pointer",
                    textDecoration: "none",
                  }}>
                    {title.substring(0, 60)}{title.length > 60 ? "..." : ""}
                  </h3>
                  <p style={{
                    fontSize: "14px",
                    lineHeight: "1.57",
                    color: "#4d5156",
                    margin: 0,
                  }}>
                    {description.substring(0, 160)}{description.length > 160 ? "..." : ""}
                  </p>
                </div>
              </div>
            )}

            {/* 2. Facebook Open Graph Card Preview */}
            {activeTab === "facebook" && (
              <div>
                <label className="label">Facebook Post Card Preview</label>
                <div style={{
                  background: "#1c1e21",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  color: "#e4e6eb",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  textAlign: "left",
                }}>
                  <div style={{ height: "180px", background: "#242526", position: "relative" }}>
                    <img
                      src={imageUrl}
                      alt="Open Graph preview"
                      onError={e => {
                        e.target.style.display = "none";
                      }}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.5)", color: "white", padding: "4px 10px", fontSize: "11px" }}>
                      IMAGE PREVIEW
                    </div>
                  </div>
                  <div style={{ padding: "12px", background: "#242526" }}>
                    <p style={{ fontSize: "12px", color: "#b0b3b8", textTransform: "uppercase", margin: "0 0 4px 0" }}>
                      {new URL(url || "https://example.com").hostname}
                    </p>
                    <h4 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px 0", color: "#e4e6eb" }}>
                      {title}
                    </h4>
                    <p style={{ fontSize: "13px", color: "#b0b3b8", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Twitter Card Preview */}
            {activeTab === "twitter" && (
              <div>
                <label className="label">Twitter / X Card Preview</label>
                <div style={{
                  background: "black",
                  border: "1px solid #2f3336",
                  borderRadius: "16px",
                  overflow: "hidden",
                  color: "#e7e9ea",
                  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, sans-serif",
                  textAlign: "left",
                }}>
                  <div style={{ height: "180px", position: "relative" }}>
                    <img
                      src={imageUrl}
                      alt="Twitter preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "12px", borderTop: "1px solid #2f3336" }}>
                    <p style={{ fontSize: "12px", color: "#71767b", margin: "0 0 2px 0" }}>
                      🔗 {new URL(url || "https://example.com").hostname}
                    </p>
                    <h4 style={{ fontSize: "13px", fontWeight: 500, margin: "0 0 2px 0", color: "#e7e9ea" }}>
                      {title}
                    </h4>
                    <p style={{ fontSize: "13px", color: "#71767b", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Generated Meta Tags Code */}
            {activeTab === "code" && (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label className="label" style={{ marginBottom: 0 }}>Generated HTML Meta Tags</label>
                  <button className="btn-secondary" onClick={copyCode} style={{ fontSize: "12px", padding: "4px 10px" }}>
                    📋 Copy Code
                  </button>
                </div>
                <textarea
                  className="input-field"
                  style={{ fontFamily: "monospace", fontSize: "12px", flex: 1, minHeight: "260px" }}
                  readOnly
                  value={generatedCode}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

export default MetaTagStudio;
