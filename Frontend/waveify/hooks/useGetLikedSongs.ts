import { useState, useEffect } from "react";

const useGetLikedSongs = (userId: string, page: number, pageSize: number) => {
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://77.94.203.78:5000/api/LikedSongs/${userId}?page=${page}&pageSize=${pageSize}`
        );
        const data = await response.json();
        setLikedSongs(data.songs);       // ✅ теперь только песни
        setTotalCount(data.totalCount);  // ✅ общее количество
      } catch (error) {
        console.error("Ошибка при получении лайкнутых песен:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchLikedSongs();
    }
  }, [userId, page, pageSize]);

  return { songs: likedSongs, isLoading, totalCount };
};

export default useGetLikedSongs;
