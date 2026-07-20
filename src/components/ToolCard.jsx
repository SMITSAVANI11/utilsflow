// ToolCard.jsx — Card with favorite button and a11y
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";

function ToolCard({ tool }) {
  const { isFavorite, toggleFavorite } = useAppContext();
  const fav = isFavorite(tool.id);

  const [expanded, setExpanded] = useState(false);

  const showReadMore = tool.description.length > 120;

  function handleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.id);
  }

  return (
    <Link
      to={tool.path}
      className="group bg-bg-card border border-border rounded-[12px] p-[22px] cursor-pointer transition-all duration-200 no-underline flex flex-col h-full hover:border-primary hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-primary-light focus-visible:outline-offset-3"
      aria-label={`${tool.name} — ${tool.description}`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-3.5 z-10">
        <div
          className="w-12 h-12 bg-primary-glow-heavy border border-primary/20 rounded-[14px] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
          aria-hidden="true"
        >
          <CategoryIcon categoryId={tool.category} className="w-6 h-6 text-primary" />
        </div>

        <div className="flex flex-col gap-1 items-end">
          {tool.isPopular && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-warning">
              Popular
            </span>
          )}
          {tool.isNew && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-success">
              New
            </span>
          )}
        </div>
      </div>

      {/* TITLE */}
      <h3 className="text-[16px] font-bold text-text-primary mb-2 leading-snug z-10">{tool.name}</h3>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col z-10">
        <p className={`text-[13px] text-text-secondary leading-normal m-0 overflow-hidden ${expanded ? "overflow-visible" : "line-clamp-3"}`}>
          {tool.description}
        </p>

        {showReadMore && (
          <button
            className="mt-1.5 border-none bg-transparent text-primary cursor-pointer p-0 text-[12px] font-semibold hover:underline self-start"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? "Show Less" : "Read More..."}
          </button>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-4 flex items-center justify-between gap-3 z-10">
        <span className="text-[11px] text-text-muted capitalize font-medium bg-bg-card px-2 py-0.5 rounded-full border border-border shrink-0">
          {tool.category}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <button
            className="w-8 h-8 flex items-center justify-center border-none rounded-full bg-primary-glow-heavy cursor-pointer text-[18px] leading-none shrink-0 transition-transform duration-300 hover:scale-110"
            style={fav ? { animation: "heartPop 0.3s ease" } : undefined}
            onClick={handleFavorite}
            aria-label={
              fav ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`
            }
            aria-pressed={fav}
          >
            {fav ? "❤️" : "🤍"}
          </button>

          <div className="w-7 h-7 flex items-center justify-center bg-primary-glow-heavy rounded-full text-primary shrink-0 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:translate-x-1">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ToolCard;