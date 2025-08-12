"use client";
import { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import useSongs from "@/hooks/useSongs";
import useTopChartSongs from "@/hooks/useTopChartSongs";
import useForYouSongs from "@/hooks/useForYouSongs";
import { useAuth } from "@/providers/AuthProvider";
import PageContent from "./PageContent";
import PageContentTopChart from "../top-chart/PageContentTopChart";
import PageContentForYou from "./PageContentForYou";
import SmartLink from "@/component/SmartLink";
import useGetSongById from "@/hooks/useGetSongById";
import {
  StickyTabs,
  TabsHeader,
  useStickyProgress,
  Tab,
} from "@/component/TabsHeader";
import MyWave from "@/component/MyWave";
import usePlayer from "@/hooks/usePlayer";

const ALL_VIBES = ["Joyfully", "Energetic", "Quietly", "Sad"];

const tabs: Tab[] = [
  { key: "for-you", label: "Для вас" },
  { key: "trends", label: "Тренды" },
];

export default function Home() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const progress = useStickyProgress(scrollRef, 60);        // плавность ↔ threshold
  const [activeTab, setActiveTab] = useState<"for-you" | "trends">("for-you");

  /* ---------- музыка / данные ---------- */
  const [selectedVibes, setSelectedVibes] = useState<string[]>(() => {
    if (typeof window === "undefined") return ALL_VIBES;
    try {
      const stored = localStorage.getItem("selectedVibes");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch { }
    return ALL_VIBES;
  });
  useEffect(() => {
    localStorage.setItem("selectedVibes", JSON.stringify(selectedVibes));
  }, [selectedVibes]);

  const { user } = useAuth();
  const player = usePlayer();
  const { songs, isLoading, refresh } = useSongs(selectedVibes);
  const { songs: topSongs, isLoading: isTopLoading } = useTopChartSongs(20);
  const { songs: forYouSongs, isLoading: isForYouLoading } = useForYouSongs(user?.id);
  const { song: playingSong } = useGetSongById(player.activeId);
  useEffect(() => refresh(), [selectedVibes]);
  /* ------------------------------------- */

  const handleVibeChange = (v: string) =>
    setSelectedVibes((prev) =>
      prev.includes(v)
        ? prev.filter((x) => x !== v).length
          ? prev.filter((x) => x !== v)
          : ALL_VIBES
        : [...prev, v]
    );

  return (
    <div
      ref={scrollRef}
      className="bg-[var(--bgPage)] text-neutral-400 rounded-lg w-full h-full overflow-y-auto relative"
    >
            <MyWave height={400} />




      {/* Поточная панель (не исчезает, только fade) */}
      <div
        className="px-4 pt-4 mb-2"
        style={{
          opacity: 1 - progress,
          pointerEvents: progress > 0.05 ? "none" : "auto",
          transition: "opacity 0.25s ease-out",
        }}
      >
        <TabsHeader tabs={tabs} activeKey={activeTab} onChange={(key) => setActiveTab(key as "for-you" | "trends")} />
      </div>

      {/* Фиксированная панель */}
      <StickyTabs
        tabs={tabs}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as "for-you" | "trends")}
        progress={progress}
      />

      {/* ---------- Контент ---------- */}
      {activeTab === "for-you" && (
        <div>
          <section className="px-4 pb-2 pt-4">
            <h2 className="text-[var(--text)] text-2xl font-semibold"></h2>
            {isForYouLoading ? <p>Загрузка…</p> : <PageContentForYou songs={forYouSongs} />}
          </section>

          <section className="flex flex-wrap gap-2 mb-4 p-4 pt-2">
            {ALL_VIBES.map((v) => (
              <button
                key={v}
                onClick={() => handleVibeChange(v)}
                className={clsx(
                  "px-4 py-2 rounded-full ring-1 transition-transform hover:scale-97 active:scale-105",
                  selectedVibes.includes(v)
                    ? "ring-rose-500 text-rose-500"
                    : "ring-gray-500 text-gray-500"
                )}
              >
                {v}
              </button>
            ))}
          </section>

          <section className="mt-2 mb-7 px-6">
            <div className="flex justify-between items-center">
              <SmartLink href="/explore" className="text-[var(--text)] text-2xl font-semibold hover:underline">
                New songs
              </SmartLink>
              <SmartLink href="/explore" className="text-sm hover:underline hover:text-rose-400">
                Показать все
              </SmartLink>
            </div>
            {isLoading ? <p>Загрузка…</p> : <PageContent songs={songs.slice(0, 24)} />}
          </section>

          <section className="mt-2 mb-7 px-6">
            <div className="flex justify-between items-center">
              <SmartLink href="/explore" className="text-[var(--text)] text-2xl font-semibold hover:underline">
                Recently listened to
              </SmartLink>
              <SmartLink href="/explore" className="text-sm hover:underline hover:text-rose-400">
                Показать все
              </SmartLink>
            </div>
            {isLoading ? <p>Загрузка…</p> : <PageContent songs={songs.slice(0, 24)} />}
          </section>
        </div>
      )}

      {activeTab === "trends" && (
        <section className="px-4 pb-8 pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[var(--text)] text-2xl font-semibold">Тренды</h2>
              <p className="text-sm text-neutral-500">Популярные чарты и рост треков</p>
            </div>
            <SmartLink href="/top-chart" className="text-sm hover:underline hover:text-rose-400">
              Показать все
            </SmartLink>
          </div>
          {isTopLoading ? <p>Загрузка…</p> : <PageContentTopChart songs={topSongs.slice(0, 8)} />}
        </section>
      )}
    </div>
  );
}
