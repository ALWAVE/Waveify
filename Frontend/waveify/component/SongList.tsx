"use client";
import { Song } from "@/models/Song";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import SongItem from "./SongItem"; // Компонент для отображения песни

interface SongListProps {
  songs: Song[];
  onAddFavorite: (songId: string) => void; // Функция для добавления в избранное
  favorites: Set<string>; // Множество избранных песен
}

const SongList: React.FC<SongListProps> = ({ songs, onAddFavorite, favorites }) => {
  const handleFavoriteClick = (songId: string) => {
    onAddFavorite(songId); // Добавляем или удаляем песню из избранного
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {songs.map((song) => (
        <div key={song.id} className="relative group">
          <SongItem data={song} />

          <div
            onClick={() => handleFavoriteClick(song.id)}
            className="absolute top-2 right-2 p-2 cursor-pointer"
          >
            {favorites.has(song.id) ? (
              <AiFillHeart size={28} className="text-red-500" />
            ) : (
              <AiOutlineHeart size={28} className="text-white" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongList;
