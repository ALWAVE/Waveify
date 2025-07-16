"use client";

import SongItem from "@/component/SongItem";
import { SongWithListenCount } from "@/models/SongWithListenCount";
import React from "react";

interface PageContentForYouProps {
  songs: SongWithListenCount[];
}

const PageContentForYou: React.FC<PageContentForYouProps> = ({ songs }) => {
  const topUnique = Array.from(
    new Map(
      songs
        .sort((a, b) => b.listenCount - a.listenCount)
        .map(song => [song.id, song])
    ).values()
  ).slice(0, 8); // Возьмём только топ-8

  if (!topUnique.length) {
    return (
      <div className="mt-4 text-neutral-400">
        Для тебя ещё нет рекомендаций.
      </div>
    );
  }

  return (
    <div className="    grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        2xl:grid-cols-8 
        gap-4 
        mt-4">
      {topUnique.map(item => (
        <SongItem key={item.id} data={item} />
      ))}
    </div>
  );
};

export default PageContentForYou;
