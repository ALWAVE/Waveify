import { Song } from "@/models/Song";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";



interface Props {
  song: Song;
  onStatusChange?: (newStatus: string) => void;
}

const SongModerationCard: React.FC<Props> = ({ song, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(song.moderationStatus);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    setError(null);

    try {
      let actionParam = "";
      if (newStatus === "Published") {
        actionParam = "approve";
      } else if (newStatus === "Rejected") {
        actionParam = "reject";
      } else {
        setError("Неверный статус");
        setLoading(false);
        return;
      }

      const res = await fetch(`http://77.94.203.78:5000/api/Moderator/${song.id}/moderate?action=${actionParam}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Ошибка при обновлении статуса");
      }

      setStatus(Number(newStatus));
      if (onStatusChange) onStatusChange(newStatus);
      toast.success(`Успешно изменен статус на ${newStatus}`);
    } catch (e: any) {
      setError(e.message || "Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async () => {
    if (!confirm("Вы уверены, что хотите удалить эту песню?")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://77.94.203.78:5000/Song/${song.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Ошибка при удалении песни");
      }

      toast.success("Песня успешно удалена");
      if (onStatusChange) onStatusChange("Deleted"); // можно передавать специальный статус
    } catch (e: any) {
      setError(e.message || "Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="song-card border p-4 rounded shadow-md max-w-md mb-6">
      <img src={song.imagePath} alt={song.title} className="w-full h-89 object-cover rounded" />
      <h2 className="text-xl font-semibold mt-2">{song.title}</h2>
      <p className="text-sm text-gray-600">Автор: {song.author}</p>
      <p className="text-sm text-gray-600">Длительность: {song.duration}</p>
      <audio controls className="w-full mt-2" src={song.songPath} />
      <p className="mt-2">Текущий статус: <b>{status}</b></p>
      <Link href={`/profile/${song.userId}`} className="text-neutral-500 hover:underline hover:text-white cursor-pointer transition">
        Ссылка на профиль автора
      </Link>
      {error && <p className="text-red-600 mt-2">Ошибка: {error}</p>}

      {status === 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          <button
            disabled={loading}
            onClick={() => updateStatus("Published")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:scale-95 disabled:opacity-50"
          >
            Опубликовать
          </button>
          <button
            disabled={loading}
            onClick={() => updateStatus("Rejected")}
            className="bg-red-600 text-white px-4 py-2 rounded hover:scale-95 disabled:opacity-50"
          >
            Отклонить
          </button>
          <button
            disabled={loading}
            onClick={deleteSong}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:scale-95 disabled:opacity-50"
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
};
export default SongModerationCard;