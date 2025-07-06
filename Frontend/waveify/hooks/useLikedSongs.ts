
import { useState, useEffect } from "react";
import { Song } from "@/models/Song"; // Это интерфейс для песни

export const useLikedSongs = (userId: string, page: number, pageSize: number) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    if (!userId) return;

    const fetchLikedSongs = async () => {
      try {
        const response = await fetch(
          `http://77.94.203.78:5000/api/LikedSongs/${userId}?page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok) {
          throw new Error("Ошибка загрузки понравившихся песен.");
        }

        const data = await response.json();
        setSongs(data.Songs || []); // Переименовать на "Songs", чтобы было совместимо с сервером
        setTotalCount(data.TotalCount || 0); // Переименовать на "TotalCount"
      } catch (err) {
        setError("Не удалось загрузить любимые песни.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedSongs();
  }, [userId, page, pageSize]);

  return { songs, isLoading, error, totalCount };
};
