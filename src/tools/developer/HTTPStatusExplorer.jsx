// HTTPStatusExplorer.jsx — Browse all HTTP status codes
import { useState, useEffect, useMemo } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const HTTP_CODES = [
  { code: 200, name: "OK", desc: "Standard response for successful HTTP requests.", cat: "2xx" },
  { code: 201, name: "Created", desc: "The request has been fulfilled, resulting in the creation of a new resource.", cat: "2xx" },
  { code: 204, name: "No Content", desc: "Server successfully processed the request but is not returning any content.", cat: "2xx" },
  { code: 301, name: "Moved Permanently", desc: "This and all future requests should be directed to the given URI.", cat: "3xx" },
  { code: 302, name: "Found", desc: "Tells the client to look at another URL.", cat: "3xx" },
  { code: 304, name: "Not Modified", desc: "The resource has not been modified since the last request.", cat: "3xx" },
  { code: 400, name: "Bad Request", desc: "The server cannot process the request due to a client error.", cat: "4xx" },
  { code: 401, name: "Unauthorized", desc: "Authentication is required and has failed or not been provided.", cat: "4xx" },
  { code: 403, name: "Forbidden", desc: "The server understood the request but refuses to authorize it.", cat: "4xx" },
  { code: 404, name: "Not Found", desc: "The requested resource could not be found.", cat: "4xx" },
  { code: 405, name: "Method Not Allowed", desc: "A request method is not supported for the requested resource.", cat: "4xx" },
  { code: 408, name: "Request Timeout", desc: "The server timed out waiting for the request.", cat: "4xx" },
  { code: 409, name: "Conflict", desc: "Request could not be processed because of conflict in current state.", cat: "4xx" },
  { code: 422, name: "Unprocessable Entity", desc: "The request was well-formed but could not be followed due to semantic errors.", cat: "4xx" },
  { code: 429, name: "Too Many Requests", desc: "The user has sent too many requests in a given amount of time (rate limiting).", cat: "4xx" },
  { code: 500, name: "Internal Server Error", desc: "A generic error message when an unexpected condition was encountered.", cat: "5xx" },
  { code: 502, name: "Bad Gateway", desc: "The server was acting as a gateway and received an invalid response.", cat: "5xx" },
  { code: 503, name: "Service Unavailable", desc: "The server cannot handle the request, usually due to overload or maintenance.", cat: "5xx" },
  { code: 504, name: "Gateway Timeout", desc: "The server was acting as a gateway and did not receive a timely response.", cat: "5xx" },
];

const CAT_COLORS = { "2xx": "#10b981", "3xx": "#f59e0b", "4xx": "#ef4444", "5xx": "#8b5cf6" };
const CATS = ["all", "2xx", "3xx", "4xx", "5xx"];

function HTTPStatusExplorer() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("http-status"); }, [trackTool]);

  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = useMemo(() => HTTP_CODES.filter((c) =>
    (cat === "all" || c.cat === cat) &&
    (search === "" || String(c.code).includes(search) || c.name.toLowerCase().includes(search.toLowerCase()))
  ), [search, cat]);

  return (
    <div className="tool-page fade-in">
      <SEOHead title="HTTP Status Code Explorer" description="Browse all HTTP status codes with descriptions. Reference for web developers." path="/tools/http-status" />
      <div className="tool-page-inner" style={{ maxWidth: "900px" }}>
        <Breadcrumb toolName="HTTP Status Explorer" category="Developer" categoryPath="/?cat=developer" />
        <h1 className="tool-title">🌐 HTTP Status Code Explorer</h1>
        <p className="tool-description">Browse and search all HTTP status codes with clear descriptions.</p>

        <div className="tool-box" style={{ marginBottom: "16px" }}>
          <input className="input-field" placeholder="Search by code or name…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: "12px" }} />
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                style={{ padding: "5px 14px", borderRadius: "20px", border: "1px solid var(--border)", cursor: "pointer", fontSize: "13px", fontWeight: 600, background: cat === c ? (c === "all" ? "var(--primary)" : CAT_COLORS[c]) : "transparent", color: cat === c ? "white" : "var(--text-secondary)", transition: "all 0.2s" }}>
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map((c) => (
            <div key={c.code} style={{ display: "flex", gap: "14px", padding: "14px 18px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", alignItems: "flex-start", borderLeft: `3px solid ${CAT_COLORS[c.cat]}` }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: "18px", color: CAT_COLORS[c.cat], flexShrink: 0, minWidth: "44px" }}>{c.code}</span>
              <div>
                <p style={{ fontWeight: 600, marginBottom: "4px" }}>{c.name}</p>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HTTPStatusExplorer;
