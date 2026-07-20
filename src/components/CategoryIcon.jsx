import {
  Image,
  FileText,
  Search,
  Type,
  Code,
  Calculator,
  Ruler,
  ShieldCheck,
  Share2,
  Wrench,
  Layers,
} from "lucide-react";

export const categoryIconMap = {
  all: Layers,
  image: Image,
  pdf: FileText,
  seo: Search,
  text: Type,
  developer: Code,
  math: Calculator,
  "unit-converter": Ruler,
  security: ShieldCheck,
  social: Share2,
  misc: Wrench,
};

export function CategoryIcon({ categoryId, className = "w-5 h-5" }) {
  const IconComponent = categoryIconMap[categoryId] || Layers;
  return <IconComponent className={className} />;
}

export default CategoryIcon;
