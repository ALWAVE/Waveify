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
    // Определяем action для query параметра
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

    const res = await fetch(`https://localhost:7040/api/Moderator/${song.id}/moderate?action=${actionParam}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      // тело можно оставить пустым или {} если сервер требует body
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Ошибка при обновлении статуса");
    }

   setStatus(Number(newStatus));
    if (onStatusChange) onStatusChange(newStatus);
  } catch (e: any) {
    setError(e.message || "Ошибка сети");
  } finally {
    setLoading(false);
  }
  toast.success(`Успешно изменен статус на ${newStatus}`);

};

  return (
    <div className="song-card border p-4 rounded shadow-md max-w-md mb-6">
      <img src={song.imagePath} alt={song.title} className="w-full h-89 object-cover rounded" />
      <h2 className="text-xl font-semibold mt-2">{song.title}</h2>
      <p className="text-sm text-gray-600">Автор: {song.author}</p>
      <p className="text-sm text-gray-600">Длительность: {song.duration}</p>
      <audio controls className="w-full mt-2" src={song.songPath} />
      <p className="mt-2">Текущий статус: <b>{status}</b></p>
       <Link href={`/profile/${song.userId}`} className="text-neutral-500 hover:underline hover:text-white cursor-pointer transition ">
            Ссылка на профиль автора
        </Link>
      {error && <p className="text-red-600 mt-2">Ошибка: {error}</p>}

      {status === 0 && (
        <div className="flex space-x-4 mt-4">
          <button
            disabled={loading}
            onClick={() => updateStatus("Published")}
            className="cursor-pointer hover:scale-95 hover:opacity-95 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Опубликовать
          </button>
          <button
            disabled={loading}
            onClick={() => updateStatus("Rejected")}
            className="cursor-pointer hover:scale-95 hover:opacity-95 bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Отклонить
          </button>
        </div>
      )}
    </div>
  );
};

export default SongModerationCard;
