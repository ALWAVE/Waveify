import { useAuth } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";

export const useLikeSong = (songId: string) => {
    const [likes, setLikes] = useState<number>(0);
    const [dislikes, setDislikes] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const token = user?.token;


    const fetchReactions = async () => {
        try {
            const [likesRes, dislikesRes] = await Promise.all([
                fetch(`https://localhost:7040/api/SongReactions/likes?songId=${songId}`),
                fetch(`https://localhost:7040/api/SongReactions/dislikes?songId=${songId}`)
            ]);

            const likesData = await likesRes.json();
            const dislikesData = await dislikesRes.json();

            setLikes(likesData.likes || 0);
            setDislikes(dislikesData.dislikes || 0);
        } catch (err) {
            console.error("Ошибка при загрузке лайков/дизлайков", err);
        }
    };

  const react = async (like: boolean) => {
  setLoading(true);
  try {
  await fetch(`https://localhost:7040/api/SongReactions/react?songId=${songId}&isLike=${like}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // <-- ОБЯЗАТЕЛЬНО
      },
      body: JSON.stringify({ songId, like }),
    });
  
    await fetchReactions(); // обновить лайки/дизлайки
  } catch (err) {
    console.error("Ошибка при отправке реакции", err);
  } finally {
    setLoading(false);
  }
};



    useEffect(() => {
        if (songId) {
            fetchReactions();
        }
    }, [songId]);

    return {
        likes,
        dislikes,
        loading,
        likeSong: react,
    };
};
