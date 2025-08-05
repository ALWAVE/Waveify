import { useState } from "react";
import { Clock, Pencil } from "lucide-react";
import Image from "next/image";
import { Song } from "@/models/Song";
import useOnPlay from "@/hooks/useOnPlay";
import usePlayer from "@/hooks/usePlayer";
import PlayButton from "@/component/PlayButton";
import EditSongModal from "./EditSongModal";
import SongLikeButton from "./SongLikeButton";
import { Badge } from "./Badge";

interface TrackTableProps {
  tracks: Song[];
  updateLikedSongs: (updatedSong: any) => void;
  editMode?: boolean;
}

const TrackTable: React.FC<TrackTableProps> = ({ tracks = [], updateLikedSongs, editMode = false }) => {
  const [editTrack, setEditTrack] = useState<Song | null>(null);
  const onPlay = useOnPlay(tracks);
  const player = usePlayer();

  if (!tracks.length) {
    return <div className="p-4 text-neutral-400">Нет песен для отображения.</div>;
  }

  // Функция для отображения текста и варианта Badge по числовому статусу
  // Обновленная функция getStatusInfo
  const getStatusInfo = (status: number | null): { text: string; variant: "default" | "destructive" | "outline" | "secondary" } => {
    switch (status) {
      case 1:
        return { text: "Publish", variant: "secondary" }; // зелёный
      case 2:
        return { text: "Rejected", variant: "destructive" };  // красный
      case 0:
      default:
        return { text: "Check your track", variant: "outline" }; // серый
    }
  };


  return (
    <div className="bg-[var(--bgPage)] rounded-lg border border-neutral-800 mt-6 overflow-x-auto">
      <div className="p-4 rounded-lg border-b border-neutral-800">
        <h2 className="text-xl rounded-lg font-bold text-[var(--text)]">Your Collection</h2>
      </div>

      <div className="p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-neutral-400 border-b border-neutral-800">
              <th className="pb-2 pl-2">#</th>
              <th className="pb-2">TITLE</th>
              <th className="pb-2">AUTHOR</th>
              <th className="pb-2">GENRE</th>
              {editMode && <th className="pb-2">STATUS</th>}
              <th className="pb-2 text-right pr-4">
                <Clock size={16} />
              </th>
              {editMode && <th className="pb-2 text-right pr-4">Edit</th>}
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, i) => {
              const isActive = player.activeId === track.id;
              const isPlaying = isActive && player.isPlaying;

              const { text: statusText, variant: statusVariant } = getStatusInfo(track.moderationStatus);

              return (
                <tr
                  key={track.id}
                  className="hover:bg-[var(--bg)] group cursor-pointer"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button")) return;
                    onPlay(track.id);
                  }}
                >
                  <td className="py-3 pl-2 pr-2 w-15 rounded-l-lg">
                    <PlayButton
                      isPlaying={isPlaying}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlay(track.id);
                      }}
                      className="p-2 active:scale-85"
                    />
                  </td>

                  <td className="py-3 flex items-center gap-3">
                    <div className="relative w-12 h-12 min-w-[40px] rounded-md overflow-hidden">
                      <Image
                        src={track.imagePath?.trim() ? track.imagePath : "/music-placeholder.jpg"}
                        alt={track.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className={`font-medium truncate ${isActive ? "text-rose-500" : "text-[var(--text)]"}`}>
                        {track.title}
                      </p>
                      {track.like > 10 && (
                        <Badge variant="secondary" className="bg-neutral-800 mt-1 text-[10px]">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </td>

                  <td className="py-3 text-[var(--text)]">{track.author}</td>
                  <td className="py-3 text-[var(--text)]">{track.genre}</td>

                  {editMode && (
                    <td className="py-3 text-[var(--text)]">
                      <Badge variant={statusVariant}>{statusText}</Badge>
                    </td>
                  )}

                  <td className="py-3 text-right pr-4 text-neutral-400">{track.duration}</td>

                  {editMode ? (
                    <td className="text-right pr-4 rounded-r-lg flex items-center justify-end gap-2">
                      <SongLikeButton
                        songId={track.id}
                        title={track.title}
                        author={track.author}
                        imagePath={track.imagePath}
                        toolTipePosition="left"
                        // updateLikedSongs={updateLikedSongs}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditTrack(track);
                        }}
                        className="text-neutral-400 hover:text-rose-500"
                        title="Edit track"
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                  ) : (
                    <td className="text-right pr-4 rounded-r-lg">
                      <SongLikeButton
                        songId={track.id}
                        title={track.title}
                        author={track.author}
                        imagePath={track.imagePath}
                        toolTipePosition="left"
                        // updateLikedSongs={updateLikedSongs}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editTrack && <EditSongModal song={editTrack} onClose={() => setEditTrack(null)} />}
    </div>
  );
};

export default TrackTable;
