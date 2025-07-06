"use client";
import useTopChartSongs from "@/hooks/useTopChartSongs";
import PageContentTopChart from "./PageContentTopChart";

export default function TopChart() {
  const { songs, isLoading } = useTopChartSongs();

  return (
    <div className="bg-[var(--bgPage)] text-neutral-400 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-[var(--text)] text-2xl font-semibold">Top Chart</h1>
        </div>
        {isLoading ? <p>Loading...</p> : <PageContentTopChart songs={songs} />}
      </div>
    </div>
  );
}
