import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import { useAppContext } from "../context/AppContext";

function CompactToolListItem({ tool }) {
  const { isFavorite, toggleFavorite } = useAppContext();
  const fav = isFavorite(tool.id);

  function handleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.id);
  }

  return (
    <Link
      to={tool.path}
      className="group bg-bg-card/70 border border-border/80 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 no-underline hover:border-primary hover:bg-bg-card-hover hover:shadow-md"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-9 h-9 rounded-lg bg-primary-glow-heavy border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <CategoryIcon categoryId={tool.category} className="w-4.5 h-4.5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-text-primary group-hover:text-primary-light transition-colors truncate">
              {tool.name}
            </h4>
            {tool.isPopular && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-warning shrink-0">
                Popular
              </span>
            )}
            {tool.isNew && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-success shrink-0">
                New
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary truncate mt-0.5 max-w-[500px]">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden sm:inline-block text-[11px] text-text-muted capitalize font-medium bg-bg-card px-2.5 py-1 rounded-full border border-border">
          {tool.category}
        </span>

        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-glow-heavy hover:bg-primary/20 text-text-secondary hover:text-red-400 transition-colors cursor-pointer border-none"
          onClick={handleFavorite}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          title={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${fav ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        <div className="w-7 h-7 rounded-full bg-primary-glow-heavy flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}

export default CompactToolListItem;
