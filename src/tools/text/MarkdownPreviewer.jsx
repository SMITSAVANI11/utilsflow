// MarkdownPreviewer.jsx — Live markdown preview using marked
import { useState, useEffect, useMemo } from "react";
import { marked } from "marked";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const SAMPLE = `# Welcome to Markdown Previewer

## Features
- **Bold text** and *italic text*
- ~~Strikethrough~~ text
- [Links](https://utilsflow.com)
- Inline \`code\` and code blocks

## Code Example
\`\`\`javascript
function hello() {
  return "Hello, UtilsFlow!";
}
\`\`\`

## Table
| Tool | Category | Free |
|------|----------|------|
| JSON Formatter | Developer | ✅ |
| QR Generator | Image | ✅ |

> Blockquote: All tools are 100% free!
`;

function MarkdownPreviewer() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("markdown-previewer"); }, [trackTool]);

  const [markdown, setMarkdown] = useState(SAMPLE);
  const [view, setView] = useState("split"); // split | edit | preview
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => marked(markdown, { breaks: true, gfm: true }), [markdown]);

  function copy() {
    navigator.clipboard.writeText(markdown).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="tool-page fade-in">
      <SEOHead title="Markdown Previewer" description="Write and preview Markdown in real-time. Supports GFM tables, code blocks, and more. Free online tool." path="/tools/markdown-previewer" />
      <div className="tool-page-inner" style={{ maxWidth: "1100px" }}>
        <Breadcrumb toolName="Markdown Previewer" category="Text & Writing" categoryPath="/?cat=text" />
        <h1 className="tool-title">📝 Markdown Previewer</h1>
        <p className="tool-description">Write Markdown on the left and see the rendered preview on the right in real-time.</p>

        <div className="tool-box" style={{ marginBottom: "12px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {["split", "edit", "preview"].map((v) => (
            <button key={v} onClick={() => setView(v)} className={view === v ? "btn-primary" : "btn-secondary"} style={{ fontSize: "13px", padding: "7px 14px", textTransform: "capitalize" }}>
              {v === "split" ? "⚡ Split" : v === "edit" ? "✏️ Edit" : "👁️ Preview"}
            </button>
          ))}
          <button className="btn-secondary" style={{ fontSize: "13px", padding: "7px 14px", marginLeft: "auto" }} onClick={copy}>{copied ? "✅ Copied!" : "📋 Copy MD"}</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: view === "split" ? "1fr 1fr" : "1fr", gap: "16px" }}>
          {view !== "preview" && (
            <div>
              <label className="label" htmlFor="md-input">Markdown</label>
              <textarea id="md-input" className="input-field" value={markdown} onChange={(e) => setMarkdown(e.target.value)}
                style={{ minHeight: "500px", fontFamily: "JetBrains Mono, monospace", fontSize: "13px", resize: "vertical", lineHeight: "1.7" }} />
            </div>
          )}
          {view !== "edit" && (
            <div>
              <label className="label">Preview</label>
              <div className="tool-box"
                style={{ minHeight: "500px", overflow: "auto" }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          )}
        </div>

        <style>{`
          .tool-box h1, .tool-box h2, .tool-box h3 { margin: 16px 0 8px; color: var(--text-primary); }
          .tool-box p { margin: 0 0 12px; color: var(--text-secondary); }
          .tool-box code { font-family: JetBrains Mono, monospace; background: rgba(124,58,237,0.15); padding: 2px 6px; border-radius: 4px; font-size: 13px; color: var(--primary-light); }
          .tool-box pre { background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 8px; padding: 16px; overflow-x: auto; margin: 12px 0; }
          .tool-box pre code { background: none; padding: 0; }
          .tool-box table { border-collapse: collapse; width: 100%; margin: 12px 0; }
          .tool-box th, .tool-box td { border: 1px solid var(--border); padding: 8px 12px; text-align: left; font-size: 14px; }
          .tool-box th { background: rgba(124,58,237,0.1); font-weight: 600; }
          .tool-box blockquote { border-left: 3px solid var(--primary); margin: 12px 0; padding: 8px 16px; background: rgba(124,58,237,0.05); color: var(--text-secondary); }
          .tool-box ul, .tool-box ol { padding-left: 20px; margin: 8px 0; color: var(--text-secondary); }
          .tool-box a { color: var(--primary-light); }
        `}</style>
      </div>
    </div>
  );
}

export default MarkdownPreviewer;
