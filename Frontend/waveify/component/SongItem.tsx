"use client";

import Image from "next/image";
import useOnPlay from "@/hooks/useOnPlay";
import usePlayer from "@/hooks/usePlayer"; // Импортируем хук состояния плеера

import PlayButton from "./PlayButton";

import { Song } from "@/models/Song";
import SmartLink from "./SmartLink";




interface SongItemProps {
  data: Song;
}

const SongItem: React.FC<SongItemProps> = ({ data }) => {
  const onPlay = useOnPlay([data]);
  const player = usePlayer(); // Получаем состояние плеера

  // Проверяем, является ли текущий трек активным и воспроизводится ли он
  const isPlaying = player.activeId === data.id && player.isPlaying;

  // Путь к изображению
  const imageSrc = data?.imagePath && data.imagePath.trim() !== ""
    ? data.imagePath
    : "/music-placeholder.jpg";

  return (
    <div
      // onClick={() => onPlay(data.id)}
      className="
        relative 
        group 
        flex 
        flex-col 
        items-center 
        justify-center 
        rounded-md 
        overflow-hidden 
        gap-x-4 
        bg-neutral-400/5 
        cursor-pointer 
        hover:bg-neutral-400/10 
        transition 
        p-3
      "
    >
      <div
        className="
          relative 
          aspect-square 
          w-full
          h-full 
          rounded-md 
          overflow-hidden
        "
      >
        <SmartLink href={`/song/${data.id}`} passHref>
          <Image
            src={imageSrc}
            alt="cover"
            fill
            className="object-cover rounded-md"
          />
        </SmartLink>

      </div>

      <div onClick={() => onPlay(data.id)} className=" flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold text-[var(--text)] truncate w-full">{data.title}</p>
        <p
          className="
            text-neutral-400 
            text-sm 
            pb-4 
            w-full 
            truncate
          "
        >
          {data.author}
        </p>
      </div>

      {/* Кнопка воспроизведения */}
      <div className="absolute bottom-24 right-5">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onPlay(data.id); // Запускаем песню
          }}
        >
         <PlayButton
          isPlaying={isPlaying}
          onClick={() => {
            onPlay(data.id);
          }}
          className="p-4 active:scale-85"
        />
        </div>
      </div>

      {/* Рейтинг песни */}
      <div className="absolute top-0">
        {/* <SongRating /> */}
        {/* <SongLikeButton songId = {data.id} /> */}
      </div>
    </div>
  );
};

export default SongItem;
