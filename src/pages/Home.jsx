// Home.jsx — World-class landing page with visual category hubs, search spotlight, compact view toggles, and instant quick access.
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Sparkles,
  TrendingUp,
  Clock,
  Heart,
  LayoutGrid,
  List,
  Zap,
  ShieldCheck,
  Smartphone,
  Lock,
  X,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Filter,
} from "lucide-react";

import ToolCard from "../components/ToolCard";
import CompactToolListItem from "../components/CompactToolListItem";
import CategoryHubCard from "../components/CategoryHubCard";
import CategoryIcon from "../components/CategoryIcon";
import SEOHead from "../components/SEOHead";
import { tools, categories } from "../data/tools";
import { useAppContext } from "../context/AppContext";

const QUICK_SEARCH_CHIPS = [
  { label: "PNG to JPG", query: "PNG to JPG" },
  { label: "PDF Merge", query: "Merge PDF" },
  { label: "Color Palette", query: "Color Palette" },
  { label: "JSON Formatter", query: "JSON Formatter" },
  { label: "Password Generator", query: "Password Generator" },
  { label: "QR Code", query: "QR Code" },
  { label: "GST Calculator", query: "GST Calculator" },
];

const TOOLS_PER_PAGE = 12;

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("cat") || "all";
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [visibleCount, setVisibleCount] = useState(TOOLS_PER_PAGE);

  const { recentTools, favorites, setCommandPaletteOpen } = useAppContext();
  const toolsSectionRef = useRef(null);

  // Sync state when search params change in URL
  useEffect(() => {
    const cat = searchParams.get("cat") || "all";
    setActiveCategory(cat);
    setVisibleCount(TOOLS_PER_PAGE);
  }, [searchParams]);

  // Auto-scroll active category tab into view
  useEffect(() => {
    if (activeCategory) {
      const activeEl = document.getElementById(`cat-tab-${activeCategory}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeCategory]);

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const categoryMatch = activeCategory === "all" || tool.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const searchMatch =
        query === "" ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query));
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchQuery]);

  // Tools per category mapping for visual category hub
  const toolsByCategory = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      if (cat.id !== "all") {
        map[cat.id] = tools.filter((t) => t.category === cat.id);
      }
    });
    return map;
  }, []);

  const recentToolObjects = useMemo(
    () => recentTools.map((id) => tools.find((t) => t.id === id)).filter(Boolean),
    [recentTools]
  );
  const favoriteToolObjects = useMemo(
    () => favorites.map((id) => tools.find((t) => t.id === id)).filter(Boolean),
    [favorites]
  );
  const trendingTools = useMemo(
    () => tools.filter((t) => t.isPopular).slice(0, 6),
    []
  );

  function handleCategoryChange(catId) {
    setActiveCategory(catId);
    setVisibleCount(TOOLS_PER_PAGE);
    if (catId === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ cat: catId });
    }
  }

  function handleQuickChipClick(chipQuery) {
    setSearchQuery(chipQuery);
    if (toolsSectionRef.current) {
      toolsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  const isSearching = searchQuery.trim().length > 0;
  const isDefaultHubView = !isSearching && activeCategory === "all";
  const displayedTools = filteredTools.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTools.length;

  return (
    <div className="home-page fade-in min-h-screen pb-16">
      <SEOHead
        title={`UtilsFlow — ${tools.length}+ Free Online Tools & Utilities`}
        description={`UtilsFlow offers ${tools.length}+ free client-side online tools — password generator, QR codes, JSON formatter, PDF tools, unit converter, calculators, and more. 100% free, no login needed.`}
        path="/"
      />

      {/* ── 1. HERO SECTION ── */}
      <section className="pt-32 md:pt-40 px-5 pb-14 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-glow-heavy border border-primary/25 rounded-full px-4 py-1.5 text-xs font-semibold text-primary-light mb-6 shadow-sm transition-all duration-300 hover:border-primary/45">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span>{tools.length}+ Free Online Utilities • No Signup Required</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.12] mb-5 -tracking-[1.5px] text-text-primary">
            Your Ultimate Hub for{" "}
            <span className="text-primary-light">
              Free Web Utilities
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Fast, private, client-side tools for developers, creators, and daily productivity.
            No downloads, no ads bloat, works 100% in your browser.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto relative mb-5">
            <div className="relative flex items-center">
              <Search className="absolute left-4.5 w-5 h-5 text-text-muted pointer-events-none" />
              <input
                type="text"
                id="search-tools-home"
                className="w-full bg-input-bg border border-border/80 rounded-full py-3.5 pr-24 pl-12 text-text-primary text-base transition-all duration-300 outline-none focus:border-primary focus:bg-bg-card-hover focus:ring-4 focus:ring-primary/15 placeholder-text-muted shadow-lg"
                placeholder={`Search ${tools.length}+ tools (e.g., PDF, JSON, QR)...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(TOOLS_PER_PAGE);
                }}
                autoComplete="off"
              />
              
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 p-1.5 rounded-full hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors cursor-pointer border-none"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd
                  onClick={() => setCommandPaletteOpen(true)}
                  className="absolute right-4 bg-white/10 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-text-secondary hidden sm:inline-flex items-center gap-1 cursor-pointer hover:bg-white/20 transition-colors"
                  title="Open Command Palette"
                >
                  <span>⌘K</span>
                </kbd>
              )}
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto text-xs text-text-muted">
            <span className="font-semibold text-text-secondary">Popular Searches:</span>
            {QUICK_SEARCH_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleQuickChipClick(chip.query)}
                className="bg-bg-card/90 border border-border/70 hover:border-primary/50 text-text-secondary hover:text-primary-light px-3 py-1 rounded-full transition-all duration-200 cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Hero Metrics Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 mt-10 max-w-3xl mx-auto">
            {[
              { num: `${tools.length}+`, label: "Free Utilities", icon: Layers },
              { num: `${categories.length - 1}`, label: "Tool Categories", icon: LayoutGrid },
              { num: "100%", label: "Client-Side Privacy", icon: Lock },
              { num: "$0", label: "Free Forever", icon: Zap },
            ].map(({ num, label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-bg-card/60 border border-border/80 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-bg-card-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-glow-heavy flex items-center justify-center text-primary shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-lg sm:text-xl font-bold text-text-primary tracking-tight leading-none">
                    {num}
                  </div>
                  <div className="text-xs text-text-muted mt-1 font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. RECENTLY USED & FAVORITES BAR ── */}
      {(recentToolObjects.length > 0 || favoriteToolObjects.length > 0) && (
        <section className="px-5 pb-8 max-w-[1200px] mx-auto">
          <div className="bg-bg-card/50 border border-border/80 rounded-2xl p-5 backdrop-blur-md">
            {recentToolObjects.length > 0 && (
              <div className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Recently Used</span>
                  </div>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pt-2 pb-2 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {recentToolObjects.slice(0, 5).map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-input-bg border border-border/70 hover:border-primary text-text-primary text-xs font-medium shrink-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-bg-card-hover no-underline"
                    >
                      <CategoryIcon categoryId={tool.category} className="w-3.5 h-3.5 text-primary" />
                      <span className="truncate max-w-[130px]">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {favoriteToolObjects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>Your Favorites ({favoriteToolObjects.length})</span>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pt-2 pb-2 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {favoriteToolObjects.map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-input-bg border border-border/70 hover:border-primary text-text-primary text-xs font-medium shrink-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-bg-card-hover no-underline"
                    >
                      <CategoryIcon categoryId={tool.category} className="w-3.5 h-3.5 text-primary" />
                      <span className="truncate max-w-[130px]">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 3. FEATURED SPOTLIGHT GRID ── */}
      {isDefaultHubView && (
        <section className="px-5 py-6 max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Spotlight</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
                Most Popular Utilities
              </h2>
            </div>
            <button
              onClick={() => {
                setActiveCategory("all");
                if (toolsSectionRef.current) {
                  toolsSectionRef.current.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-xs font-semibold text-primary hover:text-primary-light flex items-center gap-1 cursor-pointer bg-transparent border-none"
            >
              <span>View All ({tools.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {trendingTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* ── 4. CATEGORY HUBS GRID (Only shown when on All tab & not searching) ── */}
      {isDefaultHubView && (
        <section className="px-5 py-8 max-w-[1200px] mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
              <LayoutGrid className="w-4 h-4" />
              <span>Explore Suites</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
              Browse Tools by Category
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Select a suite below to quickly access focused, client-side developer & everyday tools.
            </p>
          </div>

          <div className="grid gap-4.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {categories
              .filter((c) => c.id !== "all")
              .map((cat) => {
                const sampleTools = toolsByCategory[cat.id] || [];
                return (
                  <CategoryHubCard
                    key={cat.id}
                    category={cat}
                    toolsCount={sampleTools.length}
                    sampleTools={sampleTools}
                    onSelectCategory={(catId) => {
                      handleCategoryChange(catId);
                      if (toolsSectionRef.current) {
                        toolsSectionRef.current.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  />
                );
              })}
          </div>
        </section>
      )}

      {/* ── 5. TABBED TOOLS EXPLORER & SEARCH RESULTS ── */}
      <section ref={toolsSectionRef} className="px-5 py-8 max-w-[1200px] mx-auto">
        {/* Navigation & Controls Bar */}
        <div className="bg-bg-card/70 border border-border/80 rounded-2xl p-4 mb-6 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => {
                const count =
                  cat.id === "all" ? tools.length : (toolsByCategory[cat.id] || []).length;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`cat-tab-${cat.id}`}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer whitespace-nowrap transition-all duration-200 border ${
                      isActive
                        ? "bg-primary text-white border-primary-dark shadow-md"
                        : "bg-input-bg border-border/70 text-text-secondary hover:text-text-primary hover:border-primary/40"
                    }`}
                  >
                    <CategoryIcon categoryId={cat.id} className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? "bg-white/20 text-white" : "bg-bg-card text-text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Controls */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 border-t md:border-t-0 border-border/60 pt-3 md:pt-0">
              <div className="text-xs text-text-muted font-medium">
                {isSearching
                  ? `${filteredTools.length} result${filteredTools.length !== 1 ? "s" : ""}`
                  : `${filteredTools.length} tool${filteredTools.length !== 1 ? "s" : ""}`}
              </div>

              <div className="flex items-center gap-1 bg-input-bg border border-border/70 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors border-none flex items-center gap-1 ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors border-none flex items-center gap-1 ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Compact List View"
                  aria-label="Compact List View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Section Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            {isSearching ? (
              <>
                <Search className="w-4 h-4 text-primary" />
                <span>Search Results for "{searchQuery}"</span>
              </>
            ) : activeCategory === "all" ? (
              <>
                <Layers className="w-4 h-4 text-primary" />
                <span>All Utilities</span>
              </>
            ) : (
              <>
                <CategoryIcon categoryId={activeCategory} className="w-4 h-4 text-primary" />
                <span>
                  {categories.find((c) => c.id === activeCategory)?.label}
                </span>
              </>
            )}
          </h3>

          {isSearching && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-primary hover:underline font-semibold cursor-pointer border-none bg-transparent"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Tools Render Grid / List */}
        {displayedTools.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
                {displayedTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {displayedTools.map((tool) => (
                  <CompactToolListItem key={tool.id} tool={tool} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + TOOLS_PER_PAGE)}
                  className="btn-secondary px-8 py-3 rounded-xl font-semibold shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Show More Tools ({filteredTools.length - visibleCount} remaining)</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty Search State */
          <div className="text-center py-14 px-5 bg-bg-card/40 border border-border/70 rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-primary-glow-heavy border border-primary/20 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-lg font-bold text-text-primary mb-1">No tools found</h4>
            <p className="text-xs text-text-secondary max-w-sm mx-auto mb-5">
              We couldn't find any tool matching "{searchQuery}". Try another keyword or browse by category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                handleCategoryChange("all");
              }}
              className="btn-primary"
            >
              Show All Tools
            </button>
          </div>
        )}
      </section>

      {/* ── 6. WHY CHOOSE UTILSFLOW SECTION ── */}
      {isDefaultHubView && (
        <section className="px-5 py-12 max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Why Professionals Choose UtilsFlow
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Designed from the ground up for maximum speed, security, and developer convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Zap,
                title: "Instant Client-Side",
                desc: "Powered by WebAssembly and local JavaScript. Tools calculate instantly with zero network lag.",
              },
              {
                icon: Lock,
                title: "100% Private & Safe",
                desc: "Your files, images, PDFs, and data never leave your browser. Zero cloud uploads.",
              },
              {
                icon: ShieldCheck,
                title: "No Signups Needed",
                desc: "No registration forms, passwords, or credit cards. Jump right in and complete your tasks.",
              },
              {
                icon: Smartphone,
                title: "Responsive & Offline",
                desc: "Works on desktop, tablet, and mobile. Installable as a lightweight PWA for offline access.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-bg-card/70 border border-border/80 rounded-2xl p-5 text-left transition-all hover:border-primary/50 hover:bg-bg-card-hover"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-glow-heavy border border-primary/20 flex items-center justify-center text-primary mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2">{title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
