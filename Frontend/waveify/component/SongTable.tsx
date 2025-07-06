import { useState } from "react";
import { Song } from "@/models/Song";
import SongLikeButton from "./SongLikeButton";
import { Clock } from "lucide-react";
import PlayButton from "./PlayButton";

interface SongTableProps {
  tracks: Song[];
  updateLikedSongs: (songId: string) => void; // Функция для обновления лайков
  onPlay: (songId: string) => void; // Функция для воспроизведения
}

const SongTable: React.FC<SongTableProps> = ({ tracks, updateLikedSongs, onPlay }) => {
  if (!tracks.length) {
    return (
      <div className="p-4 text-neutral-400">
        У вас нет понравившихся песен.
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 mt-6 overflow-x-auto">
      <div className="p-4 rounded-lg border-b border-neutral-800">
        <h2 className="text-xl rounded-lg font-bold text-white">Your Liked Songs</h2>
      </div>

      <div className="p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-neutral-400 border-b border-neutral-800">
              <th className="pb-2 pl-2">#</th>
              <th className="pb-2">TITLE</th>
              <th className="pb-2">AUTHOR</th>
              <th className="pb-2">GENRE</th>
              <th className="pb-2 text-right pr-4">
                <Clock size={16} />
              </th>
              <th className="pb-2 text-right pr-4">Like</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, i) => (
              <tr key={track.id} className="hover:bg-neutral-800 group cursor-pointer">
                <td className="py-3 pl-2 pr-2 w-15 rounded-l-lg">
                  <PlayButton
                    isPlaying={false} // сюда можно добавить логику для отображения текущего состояния воспроизведения
                    onClick={() => onPlay(track.id)} // вызываем onPlay для воспроизведения
                    className="p-4 active:scale-85"
                  />
                </td>

                <td className="py-3 flex items-center gap-3">
                  <div className="relative w-10 h-10 min-w-[40px] rounded-md overflow-hidden">
                    <img
                      src={track.imagePath?.trim() ? track.imagePath : "/music-placeholder.jpg"}
                      alt={track.title}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium truncate">{track.title}</p>
                  </div>
                </td>

                <td className="py-3">{track.author}</td>
                <td className="py-3">{track.genre}</td>
                <td className="py-3 text-right pr-4 text-neutral-400">
                  {track.duration}
                </td>

                <td className="py-3 text-right pr-4">
                  <SongLikeButton
                    songId={track.id} // передаем id песни
                    toolTipePosition="left"
                    updateLikedSongs={updateLikedSongs} // передаем функцию для обновления лайков
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongTable;
