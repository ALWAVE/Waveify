"use client";

import SongItem from "@/component/SongItem";
import { Song } from "@/models/Song";
import React from "react";
import { IoHeart } from "react-icons/io5";

interface PageContentTopChartProps {
  songs: Song[];
}

const specialTitles = [
  "🔥 ",   // 1 место
  "💖 ",       // 2 место
  "💎 ",    // 3 место
];

const PageContentTopChart: React.FC<PageContentTopChartProps> = ({ songs }) => {
  if (!songs.length) {
    return <div className="mt-4 text-neutral-400">No top chart songs available.</div>;
  }

  return (
    <div
      className="
            grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        2xl:grid-cols-8 
        gap-4 
        mt-4
      "
    >
      {songs.map((item, index) => (
        <div key={item.id} className="relative">
          {/* Позиция и спецназвание */}
          <div className="absolute bottom-1 right-1 text-2xl font-bold text-[var(--text)] z-200 flex items-center space-x-2">
            {index < 3 ? (
              <span className="text-lg">{specialTitles[index]}</span>
            ) : index < 8 ? (
              <span className="text-2xl ml-1">👑</span>
            ) : null}
            <span>#{index + 1}</span>
          </div>
          {/* <div className="absolute bottom-1  left-50  " >
            {index < 8 && <span className="ml-1 text-2xl">👑</span>}
          </div> */}
          {/* ❤️ Кол-во лайков */}
          <div className="absolute bottom-1 left-3 flex items-center text-sm text-rose-500 font-semibold">
            <IoHeart className="mr-1" /> {item.like}
          </div>

          <SongItem key={item.id} data={item} />
        </div>
      ))}
    </div>
  );
};

export default PageContentTopChart;
