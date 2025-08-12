"use client";

import React, { useEffect, useState, useCallback } from "react";
import SongModerationCard from "@/component/SongModeratorCard";
import { useIsModerator } from "@/hooks/useIsModerator";
import { Song } from "@/models/Song";
import { apiFetch } from "@/libs/apiClient";

const ModeratorSection = () => {
  const { isModerator, loading: loadingRole } = useIsModerator();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPending = useCallback(async () => {
    if (!isModerator) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/Moderator/pending", { method: "GET" });
      if (!res.ok) throw new Error(`Ошибка при загрузке песен (${res.status})`);
      const data = await res.json();
      setSongs(data);
    } catch (e: any) {
      setError(e?.message || "Ошибка сети");
    } finally {
      setLoading(false);
    }
  }, [isModerator]);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  // Шлём именно Approved/Rejected согласно API
  async function changeStatus(songId: string, status: "Approved" | "Rejected") {
    setError(null);
    const res = await apiFetch(`/api/Moderator/song/${songId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Не удалось изменить статус (${res.status}): ${text}`);
    }

    // убираем из списка — он больше не pending
    setSongs((prev) => prev.filter((s) => s.id !== songId));
  }

  // коллбек из карточки: мапим любые названия к двум допустимым
  const handleStatusChange = async (songId: string, newStatus: string) => {
    try {
      if (newStatus === "Published" || newStatus === "Approved") {
        await changeStatus(songId, "Approved");
        return;
      }
      if (newStatus === "Rejected") {
        await changeStatus(songId, "Rejected");
        return;
      }
      // если прилетело что-то иное — можно расширить маппинг при необходимости
      throw new Error(`Неизвестный статус: ${newStatus}`);
    } catch (e: any) {
      setError(e?.message || "Ошибка обновления статуса");
    }
  };

  if (loadingRole) return <p>Загрузка роли...</p>;
  if (!isModerator) return <div className="text-[var(--text)]">⛔ У вас нет прав для этого раздела</div>;
  if (loading) return <p className="text-[var(--text)]">Загрузка песен для модерации...</p>;

  return (
    <div className="flex flex-col text-[var(--text)] items-center justify-center min-h-screen px-4">
      <h2 className="text-xl font-bold mb-4">Песни на модерации</h2>
      {error && <p className="text-red-500 mb-2">Ошибка: {error}</p>}
      {songs.length === 0 ? (
        <p>Нет песен для модерации</p>
      ) : (
        songs.map((song) => (
          <SongModerationCard
            key={song.id}
            song={song}
            onStatusChange={(newStatus) => handleStatusChange(song.id, newStatus)}
          />
        ))
      )}
    </div>
  );
};

export default ModeratorSection;
