import React, { useState, useEffect } from "react";
import { getLikedSongs, LikedSongRequest, likeSong, unlikeSong } from "@/services/likedSongs";
import { useAuth } from "@/providers/AuthProvider";
import { LuHeart } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import Tooltip from "./Tooltipe";
import toast from "react-hot-toast";
import Image from "next/image";
import SmartLink from "./SmartLink";

interface SongLikeButtonProps {
  songId: string;
  title: string;
  author: string;
  imagePath?: string;
  toolTipePosition?: "top" | "bottom" | "left" | "right";
  updateLikedSongs?: (newSong: any) => void;
}

let activeToastId: string | null = null;

const SongLikeButton: React.FC<SongLikeButtonProps> = ({
  songId,
  title,
  author,
  imagePath,
  toolTipePosition,
  updateLikedSongs,
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !songId) return;

    const checkIfLiked = async () => {
      try {
        const likedSongs = await getLikedSongs(user.id, 1, 10);
        const liked = (likedSongs as { id: string }[]).some((song) => song.id === songId);
        setIsLiked(liked);
      } catch (err) {
        console.error("Ошибка получения лайков:", err);
      }
    };

    checkIfLiked();
  }, [user?.id, songId]);

 const showCustomToast = (type: "add" | "remove") => {
  // Закрыть предыдущий тост перед показом нового
  if (activeToastId) {
    toast.dismiss(activeToastId);
  }

  activeToastId = toast.custom(
    (t) => (
      <div
        className={`flex items-center bg-[#1c1c1e] text-white px-4 py-2 rounded-lg shadow-lg max-w-[500px] min-w-[400px] ${
          t.visible ? "animate-toastIn" : "animate-toastOut"
        }`}
        style={{ marginBottom: "80px" }} // чуть ниже PlayerContent
      >
        {/* Обложка */}
        <div className="flex-shrink-0 w-[56px] h-[56px] relative rounded overflow-hidden">
          <Image
            src={imagePath || "/default-cover.png"}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Текст */}
        <div className="flex-1 ml-4 overflow-hidden">
          <p className="text-[15px] text-gray-300 leading-snug">
            Трек{" "}
            <span className="text-white font-semibold truncate inline-block max-w-[220px] align-middle">
              {title}
            </span>{" "}
            {type === "add" ? "добавлен в" : "удалён из"} плейлист{" "}
            <SmartLink
              href="/collection/favorite"
              className="font-semibold text-white hover:opacity-75 whitespace-nowrap"
            >
              «Моя музыка»
            </SmartLink>
          </p>
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-4 text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>
    ),
    {
      position: "bottom-center",
      duration: 3500,
    }
  );
};


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
        showCustomToast("remove");
      } else {
        await likeSong(likedSong);
        setIsLiked(true);
        showCustomToast("add");
        updateLikedSongs?.({ id: songId, title, author, imagePath });
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
        position={toolTipePosition}
      />
    </button>
  );
};

export default SongLikeButton;
