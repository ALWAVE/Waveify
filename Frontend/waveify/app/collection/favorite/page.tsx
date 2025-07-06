"use client";

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useAuth } from "@/providers/AuthProvider";
import useGetLikedSongs from "@/hooks/useGetLikedSongs";
import TrackTable from "@/component/TrackTable";

const Favorite = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [songs, setSongs] = useState<any[]>([]); // Убедимся, что songs — это массив

  const pageSize = 10;

  const {
    songs: fetchedSongs, // Песни, которые получаем с сервера
    isLoading,
    totalCount,
  } = useGetLikedSongs(user?.id || "", currentPage, pageSize);

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    // Загружаем песни с сервера, когда мы получаем их впервые
    if (fetchedSongs?.length > 0) {
      setSongs(fetchedSongs);
    }
  }, [fetchedSongs]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Функция для обновления списка любимых песен
  const updateLikedSongs = (updatedSong: any) => {
    setSongs((prevSongs) => {
      // Найдем песню в списке и обновим её, если она уже существует
      const songIndex = prevSongs.findIndex((song: any) => song.id === updatedSong.id);
      if (songIndex > -1) {
        prevSongs[songIndex] = updatedSong; // Обновляем существующую песню
      } else {
        prevSongs.unshift(updatedSong); // Добавляем песню в начало, если её нет
      }
      return [...prevSongs];
    });
  };

  return (
    <div className="p-4 bg-[var(--bgPage)] rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <h1 className="text-2xl font-semibold text-[var(--text)] mb-4">Мои любимые песни</h1>

      {isLoading ? (
        <p className="text-neutral-400">Загрузка песен...</p>
      ) : songs.length > 0 ? (
        <>
          <TrackTable  tracks={songs} updateLikedSongs={updateLikedSongs} />
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="text-[var(--text)] disabled:text-neutral-400"
            >
              <FaArrowLeft />
            </button>
            <span className="text-[var(--text)]">
              Страница {currentPage} из {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="text-[var(--text)] disabled:text-neutral-400"
            >
              <FaArrowRight />
            </button>
          </div>
        </>
      ) : (
        <p className="text-neutral-400">У вас нет любимых песен.</p>
      )}
    </div>
  );
};

export default Favorite;
