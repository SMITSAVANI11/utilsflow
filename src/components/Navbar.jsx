// Navbar.jsx — Accessible, responsive top navigation
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import logoImg from "../assets/UtilsflowLogo.png";

const navLinks = [
  { label: "Home", path: "/", cat: null },
  { label: "Image Tools", path: "/?cat=image", cat: "image" },
  { label: "PDF Tools", path: "/?cat=pdf", cat: "pdf" },
  { label: "SEO Tools", path: "/?cat=seo", cat: "seo" },
  { label: "Developer Tools", path: "/?cat=developer", cat: "developer" },
  { label: "Math & Calc", path: "/?cat=math", cat: "math" },
];

const ACCENTS = [
  { name: "indigo", color: "#6366f1" },
  { name: "emerald", color: "#10b981" },
  { name: "violet", color: "#8b5cf6" },
  { name: "amber", color: "#f59e0b" },
  { name: "rose", color: "#f43f5e" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme, accent, setAccent, setCommandPaletteOpen } = useAppContext();

  function isActive(link) {
    if (link.cat === null) {
      return location.pathname === "/" && !location.search;
    }
    return location.search.includes(`cat=${link.cat}`);
  }

  return (
    <>
      <nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] w-[92%] max-w-[1200px] h-[58px] px-6 flex items-center bg-navbar-bg/85 backdrop-blur-[24px] border border-border rounded-full shadow-lg transition-all duration-300"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center cursor-pointer shrink-0"
            onClick={() => setMenuOpen(false)}
            aria-label="UtilsFlow home"
          >
            <img src={logoImg} alt="UtilsFlow" className="navbar-logo-img h-[30px] w-auto block object-contain" />
          </Link>

          <ul className="hidden md:flex items-center gap-1 list-none flex-1 justify-center" role="list">
            {navLinks.map((link) => (
              <li key={link.path} role="listitem">
                <Link
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-[13.5px] font-semibold transition-all duration-200 ${
                    isActive(link)
                      ? "text-primary-light bg-primary-glow-heavy border border-primary/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-text-primary/5"
                  }`}
                  aria-current={isActive(link) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Accent selection dots */}
            <div className="hidden sm:flex items-center gap-1.5 mr-2" role="group" aria-label="Choose theme accent color">
              {ACCENTS.map((acc) => (
                <button
                  key={acc.name}
                  className={`w-3.5 h-3.5 rounded-full border border-white/15 cursor-pointer p-0 transition-all duration-200 relative hover:scale-125 hover:border-white/50 ${
                    accent === acc.name ? "active scale-130 border-white shadow-[0_0_10px_var(--primary)]" : ""
                  }`}
                  style={{ backgroundColor: acc.color }}
                  onClick={() => setAccent(acc.name)}
                  aria-label={`Switch to ${acc.name} accent`}
                  title={`${acc.name.charAt(0).toUpperCase() + acc.name.slice(1)} Accent`}
                />
              ))}
            </div>

            {/* Command Palette trigger */}
            <button
              className="hidden md:flex items-center justify-center w-9 h-9 bg-white/6 border border-border rounded-full text-text-secondary text-xs font-semibold cursor-pointer transition-all duration-200 hover:bg-primary/12 hover:border-primary hover:text-primary-light"
              onClick={() => setCommandPaletteOpen(true)}
              aria-label="Open command palette (Ctrl+K)"
              title="Search tools (Ctrl+K)"
            >
              <span aria-hidden="true">⌘K</span>
            </button>

            {/* Theme toggle */}
            <button
              className="w-9 h-9 bg-white/6 border border-border rounded-full flex items-center justify-center text-[16px] cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-primary hover:rotate-[20deg]"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Hamburger */}
            <button
              className="flex md:hidden flex-col gap-1.25 bg-transparent border-none cursor-pointer p-2 rounded-full hover:bg-white/6"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className={`w-[20px] h-[2px] bg-text-secondary rounded-[2px] transition-all duration-300 block ${menuOpen ? "rotate-45 translate-y-[5px] translate-x-[4px]" : ""}`} aria-hidden="true"></span>
              <span className={`w-[20px] h-[2px] bg-text-secondary rounded-[2px] transition-all duration-300 block ${menuOpen ? "opacity-0" : ""}`} aria-hidden="true"></span>
              <span className={`w-[20px] h-[2px] bg-text-secondary rounded-[2px] transition-all duration-300 block ${menuOpen ? "-rotate-45 -translate-y-[5px] translate-x-[4px]" : ""}`} aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed top-[80px] left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] bg-navbar-bg/95 border border-border rounded-3xl p-5 flex flex-col gap-1.5 z-[999] backdrop-blur-[24px] shadow-2xl transition-all duration-300 ${
          menuOpen
            ? "opacity-100 scale-100 pointer-events-auto visible"
            : "opacity-0 scale-95 pointer-events-none invisible"
        }`}
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setMenuOpen(false)}
            className={`py-2.5 px-4 rounded-xl text-[14.5px] font-semibold transition-all duration-200 ${
              isActive(link)
                ? "text-primary-light bg-primary-glow-heavy border border-primary/20"
                : "text-text-secondary hover:text-text-primary hover:bg-text-primary/5"
            }`}
            aria-current={isActive(link) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}

        {/* Mobile Accent Selection */}
        <div className="flex justify-center gap-3 py-2.5 border-t border-b border-border my-2.5 mx-5">
          {ACCENTS.map((acc) => (
            <button
              key={acc.name}
              className={`w-5.5 h-5.5 rounded-full border border-text-primary/15 cursor-pointer p-0 transition-all duration-200 relative hover:scale-125 hover:border-text-primary/40 ${
                accent === acc.name ? "scale-130 border-text-primary shadow-[0_0_10px_var(--primary)]" : ""
              }`}
              style={{ backgroundColor: acc.color }}
              onClick={() => setAccent(acc.name)}
              aria-label={`Switch to ${acc.name} accent`}
            />
          ))}
        </div>

        <button
          className="mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-primary-light bg-primary-glow-heavy border border-primary/20 cursor-pointer text-left transition-all duration-200 hover:bg-primary-dark/20"
          onClick={() => {
            setMenuOpen(false);
            setCommandPaletteOpen(true);
          }}
        >
          🔍 Search Tools (Ctrl+K)
        </button>
      </div>
    </>
  );
}

export default Navbar;
