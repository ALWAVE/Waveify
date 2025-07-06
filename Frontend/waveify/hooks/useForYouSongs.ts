import { useState, useEffect, useCallback } from "react";
import { SongWithListenCount } from "@/models/SongWithListenCount";

const API_BASE = "http://77.94.203.78:5000";

const normalizeForYouSong = (raw: any): SongWithListenCount => ({
  id: raw.songId ?? raw.id,
  title: raw.title,
  author: raw.author,
  userId: raw.userID,
  duration: raw.duration,
  createAt: raw.createdAt,
  genre: raw.genre,
  vibe: raw.vibe,
  like: raw.likesCount,
  songPath: raw.songPath,
  imagePath: raw.imagePath,
  moderationStatus: 1,
  tag: raw.tags ?? [],
  listenCount: raw.listenCount ?? 0,
});

const useForYouSongs = (userId: string | undefined) => {
  const [songs, setSongs] = useState<SongWithListenCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchForYouSongs = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Song/user/${userId}/top-for-you`);
      if (!res.ok) throw new Error("Ошибка загрузки For You песен");
      const data = await res.json();
      const normalized = data.map(normalizeForYouSong);
      setSongs(normalized);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchForYouSongs();
  }, [fetchForYouSongs]);

  return { songs, isLoading, refresh: fetchForYouSongs };
};

export default useForYouSongs;
