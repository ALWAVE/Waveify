// hooks/useTopChartSongs.ts
import { useState, useEffect } from "react";
import { Song } from "@/models/Song";

const normalizeTopChartSong = (raw: any): Song => ({
  id: raw.songId,
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
});

const useTopChartSongs = (limit = 40) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopChartSongs = () => {
      setIsLoading(true);

      fetch(`http://77.94.203.78:5000/api/LikedSongs/top-charts?top=${limit}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const normalized = data.map(normalizeTopChartSong);
          setSongs(normalized);
        })
        .catch((err) => {
          console.error("Ошибка при загрузке топовых песен:", err);
          setSongs([]);
        })
        .finally(() => setIsLoading(false));
    };

    fetchTopChartSongs();
  }, [limit]);

  return { songs, isLoading };
};

export default useTopChartSongs;
