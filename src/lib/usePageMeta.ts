import { useEffect } from "react";

export const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    document.title = title;
    meta?.setAttribute("content", description);
    return () => {
      document.title = prevTitle;
      meta?.setAttribute("content", prevDesc);
    };
  }, [title, description]);
};
