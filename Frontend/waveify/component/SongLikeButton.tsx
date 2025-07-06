import React, { useState, useEffect } from "react";
import { getLikedSongs, LikedSongRequest, likeSong, unlikeSong } from "@/services/likedSongs";
import { useAuth } from "@/providers/AuthProvider";
import { LuHeart } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import Tooltip from "./Tooltipe";
import toast from "react-hot-toast";
import { Song } from "@/models/Song";

interface SongLikeButtonProps {
  songId: string;
  toolTipePosition?: 'top' | 'bottom' | 'left' | 'right';
  updateLikedSongs?: (newSong: any) => void; // Обновляем тип, чтобы передавать песню
}

const SongLikeButton: React.FC<SongLikeButtonProps> = ({ songId, toolTipePosition, updateLikedSongs }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !songId) return;

    const checkIfLiked = async () => {
      try {
        const likedSongs = await getLikedSongs(user.id, 1, 10) as Song[];
        const liked = (likedSongs as { id: string }[]).some((song) => song.id === songId);
        setIsLiked(liked);
      } catch (err) {
        console.error("Ошибка получения лайков:", err);
      }
    };

    checkIfLiked();
  }, [user?.id, songId]);

  const handleLike = async () => {
    if (!user || loading) return;
  
    const likedSong: LikedSongRequest = {
      userId: user.id,
      songId,
    };
  
    setLoading(true);
  
    try {
      if (isLiked) {
        await unlikeSong(likedSong);
        setIsLiked(false);
        toast("You removed from Favorites", {
          icon: "💔",
          position: "bottom-right",
        });
      } else {
        await likeSong(likedSong);
        setIsLiked(true);
        toast("You added to Favorites", {
          icon: "❤️",
          position: "bottom-right",
        });

        // После добавления лайка, передаем новую песню для немедленного обновления
        updateLikedSongs?.({ id: songId, title: "Song Title", author: "Author" }); // пример объекта песни
      }
    } catch (error) {
      console.error("Ошибка при изменении статуса лайка:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="text-neutral-400 hover:scale-112 p-2 m-4 cursor-pointer rounded-full hover:text-[var(--text)] transition relative group active:scale-95 disabled:opacity-50"
    >
      {isLiked ? (
        <FaHeart size={25} className="text-rose-500" />
      ) : (
        <LuHeart size={25} />
      )}
      <Tooltip
        label={isLiked ? "Remove from Favorites" : "Add to Favorites"}
        position= {toolTipePosition}
      />
    </button>
  );
};

export default SongLikeButton;
