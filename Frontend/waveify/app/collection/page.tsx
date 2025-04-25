"use client";
import BeatItem from "@/component/BeatItem";
import PageTitle from "@/component/PageTitle";
import TrackTable from "@/component/TrackTable";
import PageContent from "./PageContent";
import { useEffect } from "react";

// ВАЖНО: тут уже новый хук
import { useUserSongs } from "@/hooks/useUserSongs";

const Collection = () => {
  const { songs, isLoading } = useUserSongs();

  return (
    <div className="
      p-4
      bg-[var(--bgPage)]
      rounded-lg
      w-full h-full
      overflow-hidden
      overflow-y-auto
    ">
      <PageTitle title="Collection" />
      <PageTitle title="Tracks" />

      {isLoading ? (
        <p className="text-neutral-400">Загрузка песен...</p>
      ) : (
        <TrackTable tracks={songs} />
      )}

      <PageTitle title="Beats" />
      <div className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        2xl:grid-cols-8 
        gap-4 
        mt-4
      ">
       
      </div>
    </div>
  );
};

export default Collection;
