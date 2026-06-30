// usePageSEO.js — Set document title and description imperatively
import { useEffect } from "react";

/**
 * usePageSEO({ title, description })
 * Sets <title> and <meta name="description"> on mount.
 * Works alongside react-helmet-async for SPA navigation.
 */
export function usePageSEO({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);
}
