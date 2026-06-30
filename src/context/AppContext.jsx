// AppContext.jsx — Global state: theme, accent, favorites, recent tools
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Theme ────────────────────────────────────────────────
  const [theme, setTheme] = useLocalStorage("utilsflow-theme", "dark");

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }

  // Apply theme on mount
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }

  // ── Accent Color ─────────────────────────────────────────
  const [accent, setAccent] = useLocalStorage("utilsflow-accent", "indigo");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-accent", accent);
    }
  }, [accent]);

  // ── Favorites ────────────────────────────────────────────
  const [favorites, setFavorites] = useLocalStorage("utilsflow-favorites", []);

  const toggleFavorite = useCallback((toolId) => {
    setFavorites((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  }, [setFavorites]);

  const isFavorite = useCallback((toolId) => favorites.includes(toolId), [favorites]);

  // ── Recent Tools ─────────────────────────────────────────
  const [recentTools, setRecentTools] = useLocalStorage("utilsflow-recent", []);

  const trackTool = useCallback((toolId) => {
    setRecentTools((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      return [toolId, ...filtered].slice(0, 8);
    });
  }, [setRecentTools]);

  // ── Command Palette ──────────────────────────────────────
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        accent,
        setAccent,
        favorites,
        toggleFavorite,
        isFavorite,
        recentTools,
        trackTool,
        commandPaletteOpen,
        setCommandPaletteOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
