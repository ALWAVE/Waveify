"use client";

import { Song } from "@/models/Song";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/libs/apiClient";

// предполагаем значения enum: Pending=0, Approved=1, Rejected=2
const Pending = 0;
const Approved = 1;
const Rejected = 2;

interface Props {
  song: Song;
  onStatusChange?: (newStatus: string) => void; // оставил совместимость
}

const statusToText = (s: number | string) => {
  if (typeof s === "string") return s;
  switch (s) {
    case Pending: return "Pending";
    case Approved: return "Approved";
    case Rejected: return "Rejected";
    default: return String(s);
  }
};

const SongModerationCard: React.FC<Props> = ({ song, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number>(song.moderationStatus as unknown as number);

  const updateStatus = async (target: "Approved" | "Rejected") => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch(`/api/Moderator/song/${song.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: target }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Ошибка при обновлении статуса");
      }

      // обновляем локально enum-числом
      setStatus(target === "Approved" ? Approved : Rejected);
      onStatusChange?.(target);
      toast.success(`Успешно изменён статус на ${target}`);
    } catch (e: any) {
      setError(e?.message || "Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async () => {
    if (!confirm("Вы уверены, что хотите удалить эту песню?")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch(`/Song/${song.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Ошибка при удалении песни");
      }

      toast.success("Песня успешно удалена");
      onStatusChange?.("Deleted");
    } catch (e: any) {
      setError(e?.message || "Ошибка сети");
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
      <p className="mt-2">Текущий статус: <b>{statusToText(status)}</b></p>
      <Link href={`/profile/${song.userId}`} className="text-neutral-500 hover:underline hover:text-white cursor-pointer transition">
        Ссылка на профиль автора
      </Link>
      {error && <p className="text-red-600 mt-2">Ошибка: {error}</p>}

      {status === Pending && (
        <div className="flex flex-wrap gap-4 mt-4">
          <button
            disabled={loading}
            onClick={() => updateStatus("Approved")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:scale-95 disabled:opacity-50"
          >
            {loading ? "Обновляем..." : "Опубликовать"}
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
