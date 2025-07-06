"use client";

import { useParams } from "next/navigation";
import useGetSongById from "@/hooks/useGetSongById";
import usePlayer from "@/hooks/usePlayer";
import PlayButtonVisible from "@/component/PlayButtonVisible";
import { Share2, Heart } from "lucide-react";
import Tooltip from "@/component/Tooltipe";
import toast from "react-hot-toast";
import { AiOutlineDislike } from "react-icons/ai";
import { LuPlus } from "react-icons/lu";
import { useAuth } from "@/providers/AuthProvider";
import { IoIosFlag } from "react-icons/io";
import Link from "next/link";
import { useLikeSong } from "@/hooks/useLikeSong";
const SongPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;



  // Получаем данные о песне
  const { song, isLoading, error } = useGetSongById(id);
  const { user } = useAuth();
  const player = usePlayer();

  const hasPremiumSubscription = user?.subscription;

  const { likes, likeSong, loading } = useLikeSong(song?.id ?? "");
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!song) {
    return <div>Песня не найдена.</div>;
  }

  const handlePlay = () => {
    player.setId(song.id); // Устанавливаем активный трек
    player.play(); // Запускаем воспроизведение
  };
  const handleShare = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Ссылка скопирована!");
      } else {
        // Fallback для старых браузеров
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success("Ссылка скопирована!");
      }
    } catch (error) {
      toast.error("Не удалось скопировать ссылку");
      console.error("Ошибка копирования:", error);
    }
  };

  return (
    <div className="p-4
      bg-[var(--bgPage)]
      rounded-lg
      w-full h-full
      overflow-hidden
      overflow-y-auto">
      {/* Заголовок с изображением и информацией о песне */}
      <div className="relative bg-[var(--bg)] py-5 rounded-lg">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-left items-center gap-6 ">
          {song.imagePath && (
            <img src={song.imagePath} alt={song.title} className="w-64 h-64  rounded-lg shadow-lg" />
          )}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-[var(--text)]">{song.title}</h1>
            <div>
              <span className="cursor-pointer hover:underline relative group text-[var(--text)]">{song.author}
                <Tooltip label={`Search: ${song.author}`} position="bottom" />
              </span>
              <span className="text-[var(--text)]"> • {song.createAt ? new Date(song.createAt).toLocaleDateString('en-En', { year: 'numeric', month: 'long', day: 'numeric' }) : ""}
              </span>
            </div>
            <span className="text-sm text-neutral-400 mt-6">Длительность: {song.duration}</span>
            <Link href={`/profile/${song.userId}`} className="text-neutral-500 hover:underline hover:text-[var(--text)] cursor-pointer transition ">
              Link Author
            </Link>
          </div>
        </div>
      </div>


      {/* Кнопки управления */}
      <div className="container mx-auto px-4 py-6 flex items-center justify-left gap-4 bg-[var(--bg)] rounded-lg mt-2 pr-60">
        <PlayButtonVisible onClick={handlePlay} className="p-4 mt-1 transition" />
        <div className="flex justify-center ">
          <div className="flex flex-col items-center justify-center mt-5">
            {/* <button onClick={onLikeClick} >
            <Heart size={28} />
            <Tooltip label="Like" position="top" />
          </button> */}
            {/* <button onClick={onDisLikeClick}>
          <AiOutlineDislike size={28} />
          <Tooltip label="Dislike" position="top" />
        </button>
        <span>{dislikes}</span> */}

            {/* <span className="text-sm text-[var(--text)]">{dislikes}</span> */}
          </div>
        </div>
        {/* <button className="bg text-neutral-400 cursor-pointer p-2 rounded-full hover:bg-neutral-600 hover:text-white  transition relative group">
          <LuPlus size={34} onClick={() => { }} />
          <Tooltip label="Add to Liked Songs" position="top" />
        </button> */}
        <button className="bg text-neutral-400 cursor-pointer p-3 rounded-full hover:bg-neutral-600 hover:text-white  transition relative group">
          <Share2 className="pr-1" size={28} onClick={() => handleShare()} />
          <Tooltip label="Copy URL Songs" position="top" />
        </button>
        <div className="flex bg-[var(--bgPage)] p-3 rounded">
          <Heart className="mt-2 text-[var(--text)]" size={28} />
          <span className="ml-2 mt-2 text-[var(--text)]">Добавлено в любимые:</span>
          <span className="ml-2 text-rose-500 font-black text-4xl">{likes}</span>
        </div>
      </div >

      {/* Описание песни */}
      {/* <div className="container mx-auto px-4 py-6 bg-[var(--bg)] rounded-lg border border-neutral-800">
        <h2 className="text-xl font-bold text-[var(--text)]">Описание</h2>
        <p className="text-neutral-400">{song.description || "Описание отсутствует."}</p>
      </div> */}


      {/* About section */}
      <div className="container mx-auto bg-[var(--bg)]  rounded-lg border border-neutral-800 mt-6">
        <div className="p-4 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-[var(--text)]">About this song</h2>
        </div>

        <div className="p-4 ">
          {/* <p className="text-neutral-400">{song.description}</p> */}

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-300 mb-1">Release Date</h3>
              <p className="text-neutral-400 text-sm">{song.createAt}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-300 mb-1">Producer</h3>
              <p className="text-neutral-400 text-sm">{song.author}</p>
            </div>
          </div>
          <span className="flex  items-center text-rose-500 hover:text-rose-400 cursor-pointer transition ">
            <IoIosFlag className="mr-1" />
            Report Track
          </span>
        </div>

      </div>
      {/* Comment section */}
      <div className="container mx-auto bg-[var(--bg)] rounded-lg border border-neutral-800 mt-6">
        <div className="p-4">
          <h2 className="text-xl font-bold text-[var(--text)]">Comments</h2>
        </div>

        <div className="p-4">
          {/* Здесь можно добавить описание песни, если нужно */}
          {/* <p className="text-neutral-400">{song.description}</p> */}
        </div>
      </div>

    </div >
  );
};

export default SongPage;
