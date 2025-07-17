"use client";

import { useParams } from "next/navigation";
import useGetSongById from "@/hooks/useGetSongById";
import usePlayer from "@/hooks/usePlayer";
import PlayButtonVisible from "@/component/PlayButtonVisible";
import { Share2, Heart } from "lucide-react";
import Tooltip from "@/component/Tooltipe";
import toast from "react-hot-toast";
import { IoIosFlag } from "react-icons/io";
import Link from "next/link";
import { useLikeSong } from "@/hooks/useLikeSong";
import useOnPlay from "@/hooks/useOnPlay";

const SongPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { song, isLoading, error } = useGetSongById(id);
  const player = usePlayer();

  const { likes } = useLikeSong(song?.id ?? "");
  const onPlay = useOnPlay(song ? [song] : []);
  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!song) return <div>Песня не найдена.</div>;

  const isPlaying = player.activeId === song.id && player.isPlaying;

  const handlePlayStop = () => {
    if (isPlaying) player.stop?.();
    else onPlay(song.id);
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Ссылка скопирована!");
      } else {
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
    <div className="
      p-4
      bg-[var(--bgPage)]
      rounded-lg
      w-full h-full
      overflow-hidden
      overflow-y-auto"
    >
      {/* Заголовок с изображением и информацией о песне */}
      <div className="relative bg-[var(--bg)] py-5 rounded-lg mb-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-left items-center gap-6">
          {song.imagePath && (
            <img src={song.imagePath} alt={song.title} className="w-64 h-64 rounded-lg shadow-lg" />
          )}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-[var(--text)]">{song.title}</h1>
            <div>
              <Link href={`/explore?query=${song.author}`} className="cursor-pointer hover:underline relative group text-[var(--text)]">
                {song.author}
                <Tooltip label={`Search: ${song.author}`} position="bottom" />
              </Link>
              <span className="text-[var(--text)]">
                • {song.createAt ? new Date(song.createAt).toLocaleDateString('en-En', { year: 'numeric', month: 'long', day: 'numeric' }) : ""}
              </span>
            </div>
            <span className="text-sm text-neutral-400 mt-6">Длительность: {song.duration}</span>
            <Link href={`/profile/${song.userId}`} className="text-neutral-500 hover:underline hover:text-[var(--text)] cursor-pointer transition">
              Go to the author's profile
            </Link>
          </div>
        </div>

        {/* КНОПКИ управления: лайк - плей - поделиться */}
        <div className="flex items-center justify-center gap-10 mt-8">
          {/* Like */}
          <button
            className="flex flex-col items-center text-rose-300 hover:bg-rose-100/10 p-4 rounded-full transition"
          >
            <Heart size={28} />
            <span className="text-xs text-rose-300 font-bold mt-1">{likes}</span>
            <Tooltip label="В избранное" position="top" />
          </button>

          {/* Play */}
          <PlayButtonVisible
            isPlaying={isPlaying}
            onClick={handlePlayStop}
            className="p-6 text-3xl bg-rose-500/90 hover:bg-rose-400 shadow-xl active:scale-95"
          />

          {/* Share */}
          <button
            className="flex flex-col items-center text-neutral-400 hover:bg-neutral-700/20 p-4 rounded-full transition"
            onClick={handleShare}
          >
            <Share2 size={28} />
            <span className="text-xs text-neutral-400 mt-1">Share</span>
            <Tooltip label="Поделиться" position="top" />
          </button>
        </div>
      </div>

      {/* About section */}
      <div className="container mx-auto bg-[var(--bg)] rounded-lg border border-neutral-800 mt-6">
        <div className="p-4 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-[var(--text)]">About this song</h2>
        </div>
        <div className="p-4">
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
          <span className="flex items-center text-rose-500 hover:text-rose-400 cursor-pointer transition">
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
          {/* Можно добавить описание песни или комментарии */}
        </div>
      </div>
    </div>
  );
};

export default SongPage;
