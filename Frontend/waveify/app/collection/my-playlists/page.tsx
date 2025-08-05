"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

interface Playlist {
  id: string;
  name: string;
  cover?: string;
}

export default function MyPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: "1",
      name: "ICE",
      cover: "/covers/ice.jpg", // пример обложки
    },
  ]);

  const handleCreate = () => {
    const name = prompt("Введите название нового плейлиста");
    if (name) {
      setPlaylists((prev) => [
        ...prev,
        { id: Date.now().toString(), name, cover: undefined },
      ]);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-[var(--text)] mb-5">
        Мои плейлисты
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
        {/* Кнопка создания нового */}
        <button
          onClick={handleCreate}
          className="aspect-square rounded-xl bg-gradient-to-br from-gray-700 to-gray-500 flex flex-col items-center justify-center text-white text-center shadow-lg hover:scale-105 transition"
        >
          <AiOutlinePlus size={40} />
          <span className="mt-2 text-sm">Новый плейлист</span>
        </button>

        {/* Список плейлистов */}
        {playlists.map((playlist) => (
          <Link
            key={playlist.id}
            href={`/playlist/${playlist.id}`}
            className="group"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg bg-gray-800 hover:scale-105 transition">
              {playlist.cover ? (
                <Image
                  src={playlist.cover}
                  alt={playlist.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  🎵
                </div>
              )}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-[var(--text)] truncate">
              {playlist.name}
            </h3>
            <p className="text-sm text-gray-400">Плейлист</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
