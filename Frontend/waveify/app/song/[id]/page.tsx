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
import { useEffect, useRef, useState } from "react";
import { FastAverageColor } from "fast-average-color";

const SongPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { song, isLoading, error } = useGetSongById(id);
  const player = usePlayer();
  const { likes } = useLikeSong(song?.id ?? "");
  const onPlay = useOnPlay(song ? [song] : []);

  const [bgColor, setBgColor] = useState("#000000");
  const imgRef = useRef<HTMLImageElement>(null);

  // Определяем доминирующий цвет
  useEffect(() => {
    if (!song?.imagePath || !imgRef.current) return;

    const imgEl = imgRef.current;
    const fac = new FastAverageColor();

    const handleLoad = () => {
      fac.getColorAsync(imgEl, { mode: "speed" })
        .then(color => {
          if (color.hex) {
            setBgColor(color.hex);
          }
        })
        .catch(err => {
          console.warn("Не удалось извлечь цвет:", err);
        });
    };


    if (imgEl.complete && imgEl.naturalWidth > 0) {
      handleLoad();
    } else {
      imgEl.addEventListener("load", handleLoad);
    }

    return () => imgEl.removeEventListener("load", handleLoad);
  }, [song?.imagePath]);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!song) return <div>Песня не найдена.</div>;

  const isPlaying = player.activeId === song.id && player.isPlaying;
  const proxyUrl = song?.imagePath
    ? `http://77.94.203.78:5000/api/ImageProxy?url=${encodeURIComponent(song.imagePath)}`
    : "";
  const handlePlayStop = () => {
    if (isPlaying) player.stop?.();
    else onPlay(song.id);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Ссылка скопирована!");
    } catch {
      toast.error("Не удалось скопировать ссылку");
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-y-auto rounded-lg"
      style={{
        backgroundColor: bgColor,
        transition: "background-color 0.5s ease",
      }}
    >
      {/* Скрытая картинка для анализа цвета */}
      {song.imagePath && (
        <img
          ref={imgRef}
          src={proxyUrl}
          alt=""
          crossOrigin="anonymous"
          className="hidden"
        />
      )}

      {/* Контент */}
      <div className="relative p-6">
        <div className="max-w-5xl mx-auto bg-black/40 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Обложка */}
            {song.imagePath && (
              <img
                src={song.imagePath}
                alt={song.title}
                className="w-64 h-64 rounded-xl shadow-2xl object-cover"
              />
            )}

            {/* Информация */}
            <div className="flex flex-col flex-1 min-w-0">
              <h1 className="text-4xl font-bold mb-2 text-white">{song.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-white/80">
                <Link
                  href={`/explore?query=${song.author}`}
                  className="hover:underline"
                >
                  {song.author}
                  <Tooltip label={`Search: ${song.author}`} position="bottom" />
                </Link>
                <span>• {song.createAt
                  ? new Date(song.createAt).toLocaleDateString("en-En", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : ""}</span>
              </div>
              <span className="text-sm text-white/60 mt-4">
                Длительность: {song.duration}
              </span>
              <Link
                href={`/profile/${song.userId}`}
                className="text-white/70 hover:text-white mt-1"
              >
                Go to the author's profile
              </Link>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex items-center justify-center gap-10 mt-8">
            <button className="flex flex-col items-center text-rose-300 hover:bg-rose-100/10 p-4 rounded-full transition">
              <Heart size={28} />
              <span className="text-xs font-bold mt-1">{likes}</span>
              <Tooltip label="В избранное" position="top" />
            </button>

            <PlayButtonVisible
              isPlaying={isPlaying}
              onClick={handlePlayStop}
              className="p-6 text-3xl bg-rose-500/90 hover:bg-rose-400 shadow-xl active:scale-95"
            />

            <button
              className="flex flex-col items-center text-white/80 hover:bg-white/10 p-4 rounded-full transition"
              onClick={handleShare}
            >
              <Share2 size={28} />
              <span className="text-xs mt-1">Share</span>
              <Tooltip label="Поделиться" position="top" />
            </button>
          </div>

          {/* About */}
          <div className="mt-6 bg-black/30 rounded-xl p-4 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">About this song</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-white/70">Release Date</h3>
                <p className="text-white/50 text-sm">{song.createAt}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/70">Producer</h3>
                <p className="text-white/50 text-sm">{song.author}</p>
              </div>
            </div>
            <span className="flex items-center text-rose-400 hover:text-rose-300 cursor-pointer mt-4">
              <IoIosFlag className="mr-1" /> Report Track
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongPage;
