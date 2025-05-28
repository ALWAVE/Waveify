"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const PageLoader = () => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  // Запускаем лоадер при любом событии routeChangeTriggered
  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    window.addEventListener("routeChangeTriggered", handleStart);

    return () => {
      window.removeEventListener("routeChangeTriggered", handleStart);
    };
  }, []);

  // Останавливаем лоадер, когда pathname изменился (страница загрузилась)
 useEffect(() => {
  if (loading) {
    const timeout = setTimeout(() => {
      setLoading(false); // Сброс даже если pathname не изменился
    }, 1500); // Максимальная длительность загрузки

    return () => clearTimeout(timeout);
  }
}, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed top-[56px] left-0 w-full mt-2 h-[3px] z-50 overflow-hidden">
      <div className="h-full w-full bg-gradient-to-r from-violet-500 via-pink-500 to-red-500 animate-loader" />
    </div>
  );
};

export default PageLoader;
