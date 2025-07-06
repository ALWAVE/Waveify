import { useState, useEffect } from "react";

export function useLikeSong(songId: string, userId?: string | undefined) {
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!songId) return;

    async function fetchLikesCount() {
      setLoading(true);
      try {
        // Получаем количество лайков
        const res = await fetch(`http://77.94.203.78:5000/api/LikedSongs/${songId}/likesCount`);
        const data = await res.json();
        setLikes(data.likesCount ?? 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    async function checkUserLiked() {
      if (!userId) return;
      try {
        // Получаем все лайки пользователя, чтобы проверить, лайкал ли он эту песню
        const res = await fetch(`http://77.94.203.78:5000/api/LikedSongs/${userId}`);
        const likedSongs = await res.json();
        // likedSongs — массив песен, которые лайкал пользователь
        const isLiked = likedSongs.some((song: any) => song.id === songId);
        setLikedByUser(isLiked);
      } catch (e) {
        console.error(e);
      }
    }

    fetchLikesCount();
    checkUserLiked();
  }, [songId, userId]);

  async function likeSong() {
    if (!userId) {
      alert("Нужно войти, чтобы лайкать");
      return;
    }
    setLoading(true);
    try {
      if (likedByUser) {
        // Убираем лайк
        await fetch(`http://77.94.203.78:5000/api/LikedSongs/unlike`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ songId, userId }),
        });
        setLikedByUser(false);
        setLikes((prev) => prev - 1);
      } else {
        // Ставим лайк
        await fetch(`http://77.94.203.78:5000/api/LikedSongs/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ songId, userId }),
        });
        setLikedByUser(true);
        setLikes((prev) => prev + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return { likes, likedByUser, likeSong, loading };
}
