// app/providers/PlatformProvider.tsx
"use client";  // Убедитесь, что этот компонент работает только на клиенте

import { useEffect, useState, createContext, useContext } from "react";

const PlatformContext = createContext<string | null>(null);

export function usePlatform() {
  return useContext(PlatformContext);
}

export default function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent.toLowerCase();

      if (userAgent.includes("electron")) {
        setPlatform("electron");
      } else if (userAgent.includes("android") || userAgent.includes("iphone")) {
        setPlatform("mobile");
      } else {
        setPlatform("desktop");
      }
    }
  }, []);

  if (platform === null) {
    return null;  // Пока платформа не определена, ничего не показываем
  }

  return (
    <PlatformContext.Provider value={platform}>
      {children}
    </PlatformContext.Provider>
  );
}
