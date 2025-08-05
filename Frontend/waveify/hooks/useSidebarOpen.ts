// hooks/useSidebarOpen.ts
import { useState, useEffect } from "react";

export default function useSidebarOpen() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setOpen(false);
      else setOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { open, setOpen };
}
