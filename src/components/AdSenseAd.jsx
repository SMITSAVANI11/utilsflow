import React, { useEffect, useState } from "react";

/**
 * Reusable Google AdSense Component
 *
 * @param {string} client - Your Google AdSense publisher ID (e.g., ca-pub-XXXXXXXXXXXXXXXX)
 * @param {string} slot - The unique ID of the ad unit (from AdSense dashboard)
 * @param {string} format - The format of the ad (e.g., 'auto', 'fluid', 'rectangle')
 * @param {string} responsive - Whether the ad unit is responsive ('true' or 'false')
 * @param {object} style - Inline styles for the <ins> tag
 * @param {string} className - Optional tailwind classes for wrapper styling
 */
function AdSenseAd({
  client = "ca-pub-8513751801868812",
  slot,
  format = "auto",
  responsive = "true",
  style = { display: "block" },
  className = "",
}) {
  const [isBlockedOrError, setIsBlockedOrError] = useState(false);

  useEffect(() => {
    // 1. Skip pushing ads in local development to avoid console errors and policy flags
    if (import.meta.env.DEV) return;

    // 2. Initialize AdSense pushing securely
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } else {
        // Script wasn't loaded (blocked by AdBlocker)
        setIsBlockedOrError(true);
      }
    } catch (error) {
      console.warn("Google AdSense error (likely blocked by AdBlocker):", error);
      setIsBlockedOrError(true);
    }
  }, []);

  // Render a visual container in local development to see where ads will be rendered
  if (import.meta.env.DEV) {
    return (
      <div
        className={`my-6 mx-auto p-4 border border-dashed border-purple-500/30 rounded-lg bg-purple-500/5 text-center font-sans max-w-full overflow-hidden ${className}`}
        style={{ minHeight: "100px" }}
      >
        <div className="text-xs font-mono text-purple-400">
          <div className="font-semibold text-sm mb-1 text-purple-300">📢 Google AdSense Slot</div>
          <div>Publisher ID: <span className="text-gray-300 font-bold">{client}</span></div>
          <div>Ad Slot ID: <span className="text-gray-300 font-bold">{slot || "N/A"}</span></div>
          <div>Format: <span className="text-gray-300">{format}</span> | Responsive: <span className="text-gray-300">{responsive}</span></div>
          <div className="mt-2 text-[10px] text-purple-400/70">(Ad placeholders are visible in development mode only)</div>
        </div>
      </div>
    );
  }

  // If blocked by AdBlocker, collapse/hide the container to preserve layout beauty
  if (isBlockedOrError) {
    return null;
  }

  return (
    <div className={`adsense-ad-container my-6 mx-auto overflow-hidden text-center max-w-full ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}

export default AdSenseAd;
