import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import SEOHead from "./SEOHead";
import Breadcrumb from "./Breadcrumb";

function ToolLayout({
  toolId,
  title,
  description,
  path,
  category,
  categoryPath,
  children,
}) {
  const { trackTool } = useAppContext();

  useEffect(() => {
    if (toolId) {
      trackTool(toolId);
    }
  }, [toolId, trackTool]);

  return (
    <div className="min-h-screen pt-[100px] px-5 pb-[60px]" style={{ animation: "fadeIn 0.45s ease forwards" }}>
      <SEOHead title={title} description={description} path={path} />
      <div className="max-w-[800px] mx-auto">
        <Breadcrumb toolName={title} category={category} categoryPath={categoryPath} />
        {children}
      </div>
    </div>
  );
}

export default ToolLayout;
