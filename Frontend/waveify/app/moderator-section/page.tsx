"use client";

import React, { useEffect, useState } from "react";
import SongModerationCard from "@/component/SongModeratorCard";
import { useIsModerator } from "@/hooks/useIsModerator";
import { Song } from "@/models/Song";


const ModeratorSection = () => {
  const { isModerator, loading: loadingRole } = useIsModerator();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isModerator) return; // если не модератор - не грузим

    const fetchPendingSongs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://77.94.203.78:5000/api/Moderator/pending", {
          credentials: "include", // важно для куки с JWT
        });
        if (!res.ok) throw new Error("Ошибка при загрузке песен");
        const data = await res.json();
        setSongs(data);
      } catch (e: any) {
        setError(e.message || "Ошибка сети");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSongs();
  }, [isModerator]);

  // Коллбек для обновления песни в списке после модерации
 const handleStatusChange = (songId: string, newStatus: string) => {
  if (newStatus === "Published" || newStatus === "Rejected" || newStatus === "Deleted") {
    setSongs((prev) => prev.filter((s) => s.id !== songId));
  } else {
    setSongs((prev) =>
      prev.map((s) =>
        s.id === songId ? { ...s, moderationStatus: Number(newStatus) } : s
      )
    );
  }
};


  if (loadingRole) return <p>Загрузка роли...</p>;

  if (!isModerator)
    return <div className=" text-[var(--text)]">⛔ У вас нет прав для просмотра этого раздела</div>;

  if (loading) return <p className=" text-[var(--text)]">Загрузка песен для модерации...</p>;

  if (error) return <p className="text-red-600">Ошибка: {error}</p>;

 return (
  <div className="flex flex-col text-[var(--text)] items-center justify-center min-h-screen px-4">
    <h2 className="text-xl font-bold mb-4">Песни на модерации</h2>
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
