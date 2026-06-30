// Home.jsx v2 — With recent tools, favorites, and trending sections
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ToolCard from "../components/ToolCard";
import SEOHead from "../components/SEOHead";
import { tools, categories } from "../data/tools";
import { useAppContext } from "../context/AppContext";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get("cat") || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const { recentTools, favorites, setCommandPaletteOpen } = useAppContext();

  useEffect(() => {
    setActiveCategory(searchParams.get("cat") || "all");
  }, [searchParams]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const categoryMatch = activeCategory === "all" || tool.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const searchMatch =
        query === "" ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query));
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchQuery]);

  const recentToolObjects = recentTools.map((id) => tools.find((t) => t.id === id)).filter(Boolean);
  const favoriteToolObjects = favorites.map((id) => tools.find((t) => t.id === id)).filter(Boolean);
  const trendingTools = tools.filter((t) => t.isPopular).slice(0, 6);

  function handleCategoryClick(categoryId) {
    setActiveCategory(categoryId);
    if (categoryId === "all") setSearchParams({});
    else setSearchParams({ cat: categoryId });
    setSearchQuery("");
  }

  const showSections = !searchQuery && activeCategory === "all";

  return (
    <div className="home-page fade-in">
      <SEOHead
        title={`UtilsFlow — ${tools.length}+ Free Online Utilities`}
        description={`UtilsFlow offers ${tools.length}+ free online tools — password generator, QR codes, JSON formatter, unit converter, AI prompt builder, and more. No login, 100% free.`}
        path="/"
      />

      {/* ── Hero ── */}
      <section className="pt-36 px-5 pb-16 text-center relative overflow-hidden">
        {/* Glowing background orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/8 rounded-full filter blur-[120px] pointer-events-none -z-10"></div>
        
        <div className="inline-flex items-center gap-2 bg-primary-glow-heavy border border-primary/20 rounded-full px-4.5 py-1.5 text-[13px] font-semibold text-primary-light mb-7 shadow-sm transition-all duration-300 hover:border-primary/45">
          <span>⚡</span>
          <span>{tools.length}+ Free Tools • No Login Required</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black leading-[1.15] mb-5 -tracking-[2px] text-text-primary">
          Your Premium Hub of <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Free Online Utilities</span>
        </h1>
        <p className="text-[17px] md:text-[18px] text-text-secondary max-w-[620px] mx-auto mb-9 leading-relaxed">
          All the tools you need — calculators, generators, converters, developer tools, and AI
          tools. 100% free, no signup, works instantly.
        </p>

        {/* Search bar */}
        <div className="max-w-[600px] mx-auto">
          <div
            className="relative flex items-center cursor-pointer"
            onClick={() => setCommandPaletteOpen(true)}
          >
            <span className="absolute left-[18px] text-text-muted pointer-events-none">🔍</span>
            <input
              type="text"
              id="search-tools"
              className="w-full bg-input-bg border border-border rounded-full py-4 pr-5 md:pr-20 pl-[52px] text-text-primary text-[16px] transition-all duration-300 outline-none focus:border-primary focus:bg-bg-card-hover focus:ring-4 focus:ring-primary/15 placeholder-text-muted"
              placeholder={`Search ${tools.length}+ tools… or press Ctrl+K`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoComplete="off"
            />
            <kbd className="absolute right-5 bg-white/8 border border-white/15 rounded px-2 py-0.5 text-[11px] text-text-secondary hidden md:inline-flex pointer-events-none select-none">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 max-w-lg md:max-w-4xl mx-auto">
          {[
            { num: `${tools.length}+`, label: "Free Tools" },
            { num: `${categories.length - 1}`, label: "Categories" },
            { num: "0", label: "Signups Needed" },
            { num: "100%", label: "Free Forever" },
          ].map(({ num, label }) => (
            <div key={label} className="flex flex-col items-center justify-center p-4.5 rounded-2xl bg-bg-card border border-border/80 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-bg-card-hover hover:-translate-y-1 hover:shadow-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
              <div className="text-2xl md:text-3xl font-black text-primary tracking-tight">{num}</div>
              <div className="text-xs md:text-sm text-text-muted mt-1 font-semibold">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Category Filter ── */}
      <section className="py-5 px-5 pb-2.5 max-w-[1200px] mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-${cat.id}`}
              className={`flex items-center gap-1.5 px-4.5 py-2 rounded-full border text-[13px] font-medium cursor-pointer whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-primary-glow-heavy border-primary text-primary-light"
                  : "bg-bg-card border-border text-text-secondary hover:bg-bg-card-hover hover:text-text-primary"
              }`}
              onClick={() => handleCategoryClick(cat.id)}
              aria-pressed={activeCategory === cat.id}
            >
              <span aria-hidden="true">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Recent Tools (only on All tab, no search) ── */}
      {showSections && recentToolObjects.length > 0 && (
        <section className="p-5 max-w-[1200px] mx-auto">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-5">🕐 Recently Used</p>
          <div className="grid gap-4 items-stretch grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
            {recentToolObjects.slice(0, 4).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* ── Favorites ── */}
      {showSections && favoriteToolObjects.length > 0 && (
        <section className="p-5 max-w-[1200px] mx-auto">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-5">❤️ Your Favorites</p>
          <div className="grid gap-4 items-stretch grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
            {favoriteToolObjects.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* ── Trending ── */}
      {showSections && (
        <section className="p-5 max-w-[1200px] mx-auto">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-5">🔥 Trending Tools</p>
          <div className="grid gap-4 items-stretch grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
            {trendingTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* ── All / Filtered Tools ── */}
      <section className="p-5 max-w-[1200px] mx-auto">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-5">
          {searchQuery
            ? `🔍 ${filteredTools.length} result${filteredTools.length !== 1 ? "s" : ""} for "${searchQuery}"`
            : showSections
              ? `✨ All ${filteredTools.length} Tools`
              : `${filteredTools.length} tool${filteredTools.length !== 1 ? "s" : ""} found`}
        </p>

        {filteredTools.length > 0 ? (
          <div className="grid gap-4 items-stretch grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-[60px] px-5 text-text-muted">
            <div className="text-[48px] mb-4">🔭</div>
            <p className="text-[18px] font-semibold mb-2 text-text-secondary">No tools found</p>
            <p>Try a different search term or browse a category</p>
            <button
              className="bg-primary text-white border border-primary-dark px-6 py-3 rounded-[8px] text-sm font-semibold transition duration-200 inline-flex items-center gap-2 cursor-pointer no-underline hover:bg-primary-dark hover:-translate-y-[1.5px] hover:shadow-[0_4px_12px_var(--primary-glow-heavy)] active:translate-y-0 mt-4"
              onClick={() => {
                setSearchQuery("");
                handleCategoryClick("all");
              }}
            >
              🏠 Show All Tools
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
