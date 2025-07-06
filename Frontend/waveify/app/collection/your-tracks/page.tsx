"use client";

import PageTitle from "@/component/PageTitle";
import TrackTable from "@/component/TrackTable";

import {  useState } from "react";

// ВАЖНО: тут уже новый хук
import { useUserSongs } from "@/hooks/useUserSongs";

const YourTracks = () => {
  const [songss, setSongs] = useState<any[]>([]); // Убедимся, что songs — это массив
  const { songs, isLoading } = useUserSongs();
  const updateLikedSongs = (updatedSong: any) => {
    setSongs((prevSongs) => {
      // Найдем песню в списке и обновим её, если она уже существует
      const songIndex = prevSongs.findIndex((song: any) => song.id === updatedSong.id);
      if (songIndex > -1) {
        prevSongs[songIndex] = updatedSong; // Обновляем существующую песню
      } else {
        prevSongs.unshift(updatedSong); // Добавляем песню в начало, если её нет
      }
      return [...prevSongs];
    });
  };
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
        <TrackTable tracks={songs} updateLikedSongs={updateLikedSongs} editMode={true}/>
      )}

      {/* <PageTitle title="Beats" />
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
      "> */}
{/*        
      </div> */}
    </div>
  );
};

export default YourTracks;
