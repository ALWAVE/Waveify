import Image from "next/image";
import usePlayer from "@/hooks/usePlayer";
import PlayButton from "./PlayButton";
import { Song } from "@/models/Song";
import SmartLink from "./SmartLink";

interface SongItemProps {
  data: Song;
  onPlay?: (id: string) => void;
}

const SongItem: React.FC<SongItemProps> = ({ data, onPlay }) => {
  const player = usePlayer();

  const isPlaying = player.activeId === data.id && player.isPlaying;
  const imageSrc = data?.imagePath && data.imagePath.trim() !== ""
    ? data.imagePath
    : "/music-placeholder.jpg";

  return (
    <div className="
        relative 
        group 
        flex 
        flex-col 
        items-center 
        justify-center 
        rounded-md 
        overflow-hidden 
        gap-x-4
        bg-transparent 
        cursor-pointer 
        hover:bg-neutral-400/10 
        transition 
        p-3
      "
    >
      <div className="
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

      <div onClick={() => onPlay?.(data.id)} className=" flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold text-[var(--text)] truncate w-full">{data.title}</p>
        <p className="text-neutral-400 text-sm pb-2 w-full truncate">{data.author}</p>
      </div>

      {/* Кнопка воспроизведения */}
      <div className="absolute bottom-24 right-5">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.(data.id);
          }}
        >
          <PlayButton
            isPlaying={isPlaying}
            onClick={() => onPlay?.(data.id)}
            className="p-4 active:scale-85"
          />
        </div>
      </div>
      <div className="absolute top-0">{/* ... */}</div>
    </div>
  );
};

export default SongItem;
