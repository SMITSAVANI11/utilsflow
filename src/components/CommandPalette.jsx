import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { tools } from "../data/tools";

function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppContext();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = query.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : tools.slice(0, 8);

  const close = useCallback(() => {
    setCommandPaletteOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && filtered[selectedIndex]) {
      navigate(filtered[selectedIndex].path);
      close();
    }
    // Simple focus trap: prevent Tab key from leaving the input search
    if (e.key === "Tab") {
      e.preventDefault();
      inputRef.current?.focus();
    }
  }

  if (!commandPaletteOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(9, 9, 11, 0.75)",
        backdropFilter: "blur(12px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "15vh",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(600px, 92vw)",
          background: "rgba(24, 24, 27, 0.95)",
          border: "1px solid rgba(63, 63, 70, 0.8)",
          borderRadius: "14px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search input with WAI-ARIA 1.2 combobox properties */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(63, 63, 70, 0.4)",
          }}
        >
          <span style={{ fontSize: "18px", opacity: 0.5 }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="command-palette-listbox"
            aria-activedescendant={filtered.length > 0 ? `option-${selectedIndex}` : undefined}
            placeholder="Search tools… (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search tools"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "#fafafa",
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
            }}
          />
          <kbd
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "4px",
              padding: "2px 7px",
              fontSize: "11px",
              color: "#a1a1aa",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <ul
          id="command-palette-listbox"
          role="listbox"
          aria-label="Tools"
          style={{
            listStyle: "none",
            maxHeight: "380px",
            overflowY: "auto",
            padding: "8px",
            margin: 0,
          }}
        >
          {filtered.length === 0 && (
            <li
              style={{ padding: "20px", textAlign: "center", color: "#a1a1aa", fontSize: "14px" }}
            >
              No tools found for "{query}"
            </li>
          )}
          {filtered.map((tool, i) => (
            <li
              key={tool.id}
              id={`option-${i}`}
              role="option"
              aria-selected={i === selectedIndex}
              onClick={() => {
                navigate(tool.path);
                close();
              }}
              onMouseEnter={() => setSelectedIndex(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 14px",
                borderRadius: "10px",
                cursor: "pointer",
                background: i === selectedIndex ? "rgba(99, 102, 241, 0.15)" : "transparent",
                border:
                  i === selectedIndex
                    ? "1px solid rgba(99, 102, 241, 0.3)"
                    : "1px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: "22px", flexShrink: 0 }} aria-hidden="true">
                {tool.emoji}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    margin: 0,
                    color: i === selectedIndex ? "#fafafa" : "#e4e4e7",
                  }}
                >
                  {tool.name}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#a1a1aa",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tool.description}
                </p>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.06)",
                  color: "#a1a1aa",
                  textTransform: "capitalize",
                  flexShrink: 0,
                }}
              >
                {tool.category}
              </span>
            </li>
          ))}
        </ul>

        {/* Footer hint */}
        <div
          style={{
            padding: "10px 20px",
            borderTop: "1px solid rgba(63, 63, 70, 0.4)",
            display: "flex",
            gap: "16px",
            fontSize: "11px",
            color: "#a1a1aa",
          }}
        >
          <span>
            <kbd style={kbdStyle}>↑↓</kbd> Navigate
          </span>
          <span>
            <kbd style={kbdStyle}>↵</kbd> Open
          </span>
          <span>
            <kbd style={kbdStyle}>Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}

const kbdStyle = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "4px",
  padding: "1px 5px",
  marginRight: "4px",
};

export default CommandPalette;
