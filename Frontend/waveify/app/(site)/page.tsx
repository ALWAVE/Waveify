"use client";
import useSongs from "@/hooks/useSongs";
import PageContent from "./PageContent";
import { useEffect, useState } from "react";
import Link from "next/link";
import PageContentTopChart from "../top-chart/PageContentTopChart";
import useTopChartSongs from "@/hooks/useTopChartSongs";
import SmartLink from "@/component/SmartLink";
import useForYouSongs from "@/hooks/useForYouSongs";
import { useAuth } from "@/providers/AuthProvider";
import PageContentForYou from "./PageContentForYou";

const ALL_VIBES = ["Joyfully", "Energetic", "Quietly", "Sad"];

export default function Home() {
  const [selectedVibes, setSelectedVibes] = useState<string[]>(() => {
    if (typeof window === "undefined") return ALL_VIBES;
    try {
      const stored = localStorage.getItem("selectedVibes");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { }
    return ALL_VIBES;
  });

  useEffect(() => {
    localStorage.setItem("selectedVibes", JSON.stringify(selectedVibes));
  }, [selectedVibes]);
  const { user } = useAuth();
  const { songs, isLoading, refresh } = useSongs(selectedVibes);
  const { songs: topSongs, isLoading: isTopLoading } = useTopChartSongs(20); // можно грузить 20, но показывать 8
  const { songs: forYouSongs, isLoading: isForYouLoading } = useForYouSongs(user?.id);
  useEffect(() => {
    refresh();
  }, [selectedVibes]);

  const handleVibeChange = (vibe: string) => {
    setSelectedVibes((prev) => {
      let newVibes;
      if (prev.includes(vibe)) {
        newVibes = prev.filter((v) => v !== vibe);
        if (newVibes.length === 0) return ALL_VIBES;
      } else {
        newVibes = [...prev, vibe];
      }
      return newVibes;
    });
  };

  return (
    <div className="bg-[var(--bgPage)] text-neutral-400 rounded-lg w-full h-full overflow-hidden overflow-y-auto">

      <div className="px-4 pb-2 pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-[var(--text)] text-2xl font-semibold">For You</h2>
          {/* Можно добавить ссылку на отдельную страницу с персональными рекомендациями */}
        </div>
        {isForYouLoading ? (
          <p>Загрузка For You...</p>
        ) : (
          <PageContentForYou songs={forYouSongs} />
        )}

      </div>

      <div className="px-4">
        <div className="flex justify-between items-center">
          <SmartLink href="/top-chart" className="text-[var(--text)] text-2xl font-semibold hover:underline">Top Chart</SmartLink>
          <SmartLink
            href="/top-chart"
            className="text-sm text-[var(--text)] hover:underline hover:text-rose-400 transition "
          >
            Показать все
          </SmartLink>
        </div>
        {isTopLoading ? (
          <p>Загрузка...</p>
        ) : (
          <PageContentTopChart songs={topSongs.slice(0, 8)} />
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4 p-4 pt-8">
        {ALL_VIBES.map((vibe) => (
          <button
            key={vibe}
            onClick={() => handleVibeChange(vibe)}
            className={`px-4 py-2 rounded-full bg-transparent ring-1 cursor-pointer hover:scale-97 active:scale-105 ${selectedVibes.includes(vibe)
              ? "ring-rose-500 text-rose-500"
              : "ring-gray-500 text-gray-500"
              }`}
          >
            {vibe}
          </button>
        ))}
      </div>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <SmartLink href="/explore" className="text-[var(--text)] text-2xl font-semibold hover:underline">New songs</SmartLink>

          <div className="mb-4">

          </div>
          <SmartLink
            href="/explore"
            className="text-sm text-[var(--text)] hover:underline hover:text-rose-400 transition "
          >
            Показать все
          </SmartLink>
        </div>
        {isLoading ? <p>Загрузка...</p> : <PageContent songs={songs.slice(0, 24)} />}

      </div>

      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <SmartLink href="/explore" className="text-[var(--text)] text-2xl font-semibold hover:underline">Recently listened to</SmartLink>

          <div className="mb-4">

          </div>
          <SmartLink
            href="/explore"
            className="text-sm text-[var(--text)] hover:underline hover:text-rose-400 transition "
          >
            Показать все
          </SmartLink>
        </div>
        {isLoading ? <p>Загрузка...</p> : <PageContent songs={songs.slice(0, 24)} />}

      </div>

    </div >
  );
}
