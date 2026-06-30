import { useState, useMemo } from "react";
import ToolLayout from "../../components/ToolLayout";

function URLSEOStudio({ initialTab = "parser" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // 1. URL Parser
  const [parseInput, setParseInput] = useState("https://user:pass@example.com:8888/path/to/page.html?ref=google&q=seo#section-1");
  const parsedUrl = useMemo(() => {
    try {
      const u = new URL(parseInput);
      const params = [];
      u.searchParams.forEach((val, key) => params.push({ key, val }));
      return {
        valid: true,
        protocol: u.protocol,
        username: u.username,
        password: u.password,
        hostname: u.hostname,
        port: u.port || "default",
        pathname: u.pathname,
        hash: u.hash,
        search: u.search,
        params,
      };
    } catch (e) {
      return { valid: false, error: e.message };
    }
  }, [parseInput]);

  // 2. UTM Builder & Analyzer
  const [utmUrl, setUtmUrl] = useState("https://example.com");
  const [utmSource, setUtmSource] = useState("google");
  const [utmMedium, setUtmMedium] = useState("cpc");
  const [utmCampaign, setUtmCampaign] = useState("summer_sale");
  const [utmTerm, setUtmTerm] = useState("running+shoes");
  const [utmContent, setUtmContent] = useState("banner_ads");

  const builtUtmUrl = useMemo(() => {
    try {
      const u = new URL(utmUrl);
      if (utmSource) u.searchParams.set("utm_source", utmSource);
      if (utmMedium) u.searchParams.set("utm_medium", utmMedium);
      if (utmCampaign) u.searchParams.set("utm_campaign", utmCampaign);
      if (utmTerm) u.searchParams.set("utm_term", utmTerm);
      if (utmContent) u.searchParams.set("utm_content", utmContent);
      return u.toString();
    } catch (e) {
      return "";
    }
  }, [utmUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  // 3. Slug Generator (URL Rewriter)
  const [slugText, setSlugText] = useState("Vibrant & Dynamic Web Application Development!");
  const generatedSlug = useMemo(() => {
    return slugText
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")           // Replace spaces with -
      .replace(/&/g, "-and-")         // Replace & with 'and'
      .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
      .replace(/\-\-+/g, "-")         // Replace multiple - with single -
      .replace(/^-+/, "")             // Trim - from start
      .replace(/-+$/, "");            // Trim - from end
  }, [slugText]);

  // 4. Mobile Simulator Viewport size
  const [deviceSize, setDeviceSize] = useState({ w: 375, h: 667, label: "iPhone SE (Mobile)" });
  const [simUrl, setSimUrl] = useState("https://example.com");

  function copyText(txt) {
    navigator.clipboard.writeText(txt);
    alert("Copied to clipboard!");
  }

  return (
    <ToolLayout
      toolId="url-seo-studio"
      title="URL SEO Studio"
      description="Validate slug configurations, construct UTM marketing campaigns, parse URL structures, and simulate mobile web viewports locally."
      path="/tools/url-seo-studio"
      category="seo"
      categoryPath="/?cat=seo"
    >
      <div className="tool-box">
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "20px" }}>
          {[
            { id: "parser", label: "URL Parser" },
            { id: "utm", label: "UTM Builder & Analyzer" },
            { id: "slug", label: "Slug Generator" },
            { id: "mobile", label: "Mobile Simulator" },
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

        {/* Tab 1: URL Parser */}
        {activeTab === "parser" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <label className="label" htmlFor="parse-url-inp">Enter URL to Parse</label>
              <input
                id="parse-url-inp"
                type="text"
                className="input-field"
                value={parseInput}
                onChange={e => setParseInput(e.target.value)}
              />
            </div>

            {parsedUrl.valid ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px" }} className="editor-grid">
                <div>
                  <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "12px", textTransform: "uppercase" }}>
                    📁 Protocol & Host Details
                  </h4>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                    <tbody>
                      {[
                        { l: "Protocol", v: parsedUrl.protocol },
                        { l: "Hostname", v: parsedUrl.hostname },
                        { l: "Port", v: parsedUrl.port },
                        { l: "Pathname", v: parsedUrl.pathname },
                        { l: "Hash", v: parsedUrl.hash || "none" },
                      ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                          <td style={{ padding: "8px 0", color: "var(--text-secondary)", fontWeight: 500, width: "100px" }}>{row.l}</td>
                          <td style={{ padding: "8px 0", color: "var(--text-primary)", wordBreak: "break-all" }}>{row.v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "12px", textTransform: "uppercase" }}>
                    🔎 Search Query Parameters ({parsedUrl.params.length})
                  </h4>
                  {parsedUrl.params.length > 0 ? (
                    <div style={{ maxHeight: "180px", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                        <thead>
                          <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)" }}>
                            <th style={{ padding: "6px 10px", textAlign: "left" }}>Parameter Key</th>
                            <th style={{ padding: "6px 10px", textAlign: "left" }}>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedUrl.params.map((p, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                              <td style={{ padding: "6px 10px", fontWeight: "bold" }}>{p.key}</td>
                              <td style={{ padding: "6px 10px", color: "var(--text-secondary)" }}>{p.val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>No query parameters in the input URL.</p>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ color: "#ef5350", fontSize: "14px", fontWeight: 600 }}>❌ Invalid URL Format: {parsedUrl.error}</div>
            )}
          </div>
        )}

        {/* Tab 2: UTM Builder */}
        {activeTab === "utm" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="editor-grid">
            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", textTransform: "uppercase" }}>
                ⚙️ UTM Settings
              </h4>
              <div>
                <label className="label" htmlFor="utm-base-url">Base URL</label>
                <input type="text" id="utm-base-url" className="input-field" value={utmUrl} onChange={e => setUtmUrl(e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="label" htmlFor="utm-src">Campaign Source</label>
                  <input type="text" id="utm-src" className="input-field" placeholder="e.g. google" value={utmSource} onChange={e => setUtmSource(e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="utm-med">Campaign Medium</label>
                  <input type="text" id="utm-med" className="input-field" placeholder="e.g. newsletter" value={utmMedium} onChange={e => setUtmMedium(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="utm-name">Campaign Name</label>
                <input type="text" id="utm-name" className="input-field" placeholder="e.g. summer_promo" value={utmCampaign} onChange={e => setUtmCampaign(e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="label" htmlFor="utm-trm">Campaign Term</label>
                  <input type="text" id="utm-trm" className="input-field" value={utmTerm} onChange={e => setUtmTerm(e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="utm-cont">Campaign Content</label>
                  <input type="text" id="utm-cont" className="input-field" value={utmContent} onChange={e => setUtmContent(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Preview Output */}
            <div>
              <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", textTransform: "uppercase", marginBottom: "16px" }}>
                🔗 Tagged Marketing Link Output
              </h4>
              {builtUtmUrl ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <textarea
                    className="input-field"
                    style={{ fontFamily: "monospace", fontSize: "13px" }}
                    readOnly
                    rows="6"
                    value={builtUtmUrl}
                  />
                  <button className="btn-primary" onClick={() => copyText(builtUtmUrl)} style={{ justifyContent: "center" }}>
                    📋 Copy Campaign Link
                  </button>
                </div>
              ) : (
                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Enter a valid Base URL to generate tagged link.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Slug Generator */}
        {activeTab === "slug" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="editor-grid">
              <div>
                <label className="label" htmlFor="slug-txt-inp">Enter Text Phrase to Convert</label>
                <textarea
                  id="slug-txt-inp"
                  className="input-field"
                  rows="4"
                  value={slugText}
                  onChange={e => setSlugText(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Generated Clean URL Slug</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "16px",
                    fontFamily: "monospace",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "var(--primary-light)",
                    wordBreak: "break-all",
                  }}>
                    {generatedSlug || "(empty)"}
                  </div>
                  <button className="btn-primary" onClick={() => copyText(generatedSlug)} style={{ justifyContent: "center" }}>
                    📋 Copy Slug
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Mobile Simulator */}
        {activeTab === "mobile" && (
          <div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "220px" }}>
                <label className="label" htmlFor="sim-url-inp">Enter Site URL to Simulate</label>
                <input type="text" id="sim-url-inp" className="input-field" value={simUrl} onChange={e => setSimUrl(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="sim-dev-sel">Target Device Viewport</label>
                <select
                  id="sim-dev-sel"
                  className="input-field"
                  onChange={e => {
                    const parsed = JSON.parse(e.target.value);
                    setDeviceSize(parsed);
                  }}
                >
                  <option value={JSON.stringify({ w: 375, h: 667, label: "iPhone SE" })}>iPhone SE (375 × 667)</option>
                  <option value={JSON.stringify({ w: 390, h: 844, label: "iPhone 12/13" })}>iPhone 12/13 (390 × 844)</option>
                  <option value={JSON.stringify({ w: 414, h: 896, label: "iPhone XR/11" })}>iPhone XR/11 (414 × 896)</option>
                  <option value={JSON.stringify({ w: 768, h: 1024, label: "iPad Mini" })}>iPad Mini (768 × 1024)</option>
                </select>
              </div>
            </div>

            {/* Frame wrapper */}
            <div style={{ display: "flex", justifyContent: "center", background: "rgba(0,0,0,0.2)", padding: "20px", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <div style={{
                width: `${deviceSize.w}px`,
                height: `${deviceSize.h}px`,
                border: "12px solid #333",
                borderRadius: "36px",
                background: "white",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                transition: "width 0.3s, height 0.3s",
              }}>
                <iframe
                  src={simUrl}
                  title="Mobile preview simulator"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default URLSEOStudio;
