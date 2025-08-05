"use client";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/** Тип одной вкладки */
export type Tab = { key: string; label: string };

/** Горизонтальный список вкладок */
export function TabsHeader({
  tabs,
  activeKey,
  onChange,
  className = "",
}: {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  return (
    <div className={clsx("flex gap-1", className)}>
      {tabs.map(({ key, label }) => {
        const active = activeKey === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={clsx(
              "relative px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors duration-200",
              active ? "text-rose-500" : "text-[var(--text)] hover:text-rose-500"
            )}
          >
            {label}
            <span
              className={clsx(
                "absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] w-6 rounded-full transition-colors duration-200",
                active ? "bg-rose-500" : "bg-transparent"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/** Фиксированная панель; не демонтируется — управляем opacity + pointer-events */
export function StickyTabs({
  tabs,
  activeKey,
  onChange,
  progress,          // 0..1
  top = "75px"
}: {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  progress: number;
  top?: string;
}) {
  return (
    <motion.div
      style={{
        top,
        opacity: progress,
        y: -8 * (1 - progress),
        pointerEvents: "none",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="no-drag fixed left-0 right-0 z-111111 flex justify-center"
    >
      <motion.div
        style={{ scale: 0.98 + 0.02 * progress, pointerEvents: "auto", }}
        transition={{ duration: 0.25, ease: "easeOut" }}

        className="rounded-full bg-[rgba(30,30,32,0.85)]/30 backdrop-blur-md px-3 py-1 flex gap-2 shadow-md cursor-pointer"

      >
        <TabsHeader tabs={tabs} activeKey={activeKey} onChange={onChange} />
      </motion.div>
    </motion.div>
  );
}

/** Хук: возвращает progress 0-1, где 1 — проскроллено ≥ threshold px */
export function useStickyProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  threshold = 60
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const y = el.scrollTop;
      setProgress(Math.max(0, Math.min(y / threshold, 1)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef, threshold]);

  return progress;
}
