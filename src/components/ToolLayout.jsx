import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import SEOHead from "./SEOHead";
import Breadcrumb from "./Breadcrumb";
import AdSenseAd from "./AdSenseAd";

function ToolLayout({ toolId, title, description, path, category, categoryPath, children }) {
  const { trackTool } = useAppContext();

  useEffect(() => {
    if (toolId) {
      trackTool(toolId);
    }
  }, [toolId, trackTool]);

  return (
    <div
      className="min-h-screen pt-[100px] px-5 pb-[60px]"
      style={{ animation: "fadeIn 0.45s ease forwards" }}
    >
      <SEOHead title={title} description={description} path={path} />
      <div className="max-w-[800px] mx-auto">
        <Breadcrumb toolName={title} category={category} categoryPath={categoryPath} />

        {/* Top Ad Unit (Optional) - Uncomment and insert your Slot ID if desired */}
        {/* <AdSenseAd slot="YOUR_TOP_AD_UNIT_SLOT" className="mb-6" /> */}

        {children}

        {/* Bottom Ad Unit (High-Conversion) - Insert your Slot ID below */}
        <AdSenseAd slot="6941451832" className="mt-8" />
      </div>
    </div>
  );
}

export default ToolLayout;