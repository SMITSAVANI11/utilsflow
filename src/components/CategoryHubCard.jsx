import { ArrowRight, Layers } from "lucide-react";
import CategoryIcon from "./CategoryIcon";

const categoryDescriptions = {
  image: "Convert, resize, crop, edit, blur, and compress images client-side.",
  pdf: "Merge, split, extract pages, convert images to PDF, and sign contracts.",
  seo: "Keyword research, meta tags, schema generators, and SERP previews.",
  text: "Word counters, formatting, case conversion, and text generators.",
  developer: "JSON formatters, Base64, UUIDs, Regex tester, and HTTP status codes.",
  math: "Financial SIP & EMI calculators, GST invoices, and age calculators.",
  "unit-converter": "Convert length, weight, temperature, speed, area, and currencies.",
  security: "Generate cryptographically secure passwords, SHA hashes, and JWT decoders.",
  social: "Generate social bios, platform-optimized hashtags, and YouTube titles.",
  misc: "Pomodoro timers, typing speed test, habit trackers, and countdowns.",
};

function CategoryHubCard({ category, toolsCount, sampleTools, onSelectCategory }) {
  const description = categoryDescriptions[category.id] || "Discover powerful free online tools.";

  return (
    <div
      onClick={() => onSelectCategory(category.id)}
      className="group bg-bg-card border border-border/80 rounded-2xl p-5.5 cursor-pointer transition-all duration-200 flex flex-col justify-between hover:border-primary hover:-translate-y-1 hover:shadow-lg hover:bg-bg-card-hover"
    >
      <div>
        {/* Header: Icon + Title + Count Badge */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-glow-heavy border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <CategoryIcon categoryId={category.id} className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary group-hover:text-primary-light transition-colors">
                {category.label}
              </h3>
              <span className="text-xs font-semibold text-primary/90 flex items-center gap-1 mt-0.5">
                <Layers className="w-3 h-3" />
                {toolsCount} {toolsCount === 1 ? "Tool" : "Tools"}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Sample Tools Chips */}
        {sampleTools && sampleTools.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {sampleTools.slice(0, 3).map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-input-bg border border-border/60 text-text-secondary px-2.5 py-1 rounded-md transition-colors group-hover:border-primary/30 group-hover:text-text-primary"
              >
                <CategoryIcon categoryId={category.id} className="w-3 h-3 text-primary" />
                <span className="truncate max-w-[110px]">{t.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-primary-light">
        <span>Explore Category</span>
        <div className="w-6 h-6 rounded-full bg-primary-glow-heavy flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-white">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}

export default CategoryHubCard;