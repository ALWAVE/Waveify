"use client";

import { useEffect, useRef } from "react";
import { Song } from "@/models/Song";
import { listenToSong } from "./listenToSong";
import { useAuth } from "@/providers/AuthProvider";
import usePlayer from "./usePlayer";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const { user } = useAuth();

  // защита от двойных кликов / гонок
  const lockRef = useRef(false);

  // Подтягиваем громкость один раз из localStorage (если ещё не загружена)
  useEffect(() => {
    if (!player.volumeLoaded) {
      player.loadVolume();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlay = (id: string) => {
    if (lockRef.current) return;
    lockRef.current = true;

    try {
      const isSame = player.activeId === id;

      if (isSame) {
        // ← ЖЁСТКИЙ СТОП текущего трека
        player.stop(); // isPlaying:false + activeId:undefined
        return;
      }

      // Новый трек: очередь + активный id
      player.setIds(songs.map((s) => s.id));
      player.setId(id); // включает isPlaying: true

      // ГРОМКОСТЬ НЕ ТРОГАЕМ (уже в store, загружена выше).

      // Аналитика — без await, чтобы не блокировать UX
      if (user?.id) {
        void listenToSong(user.id, id).catch(() => {});
      }
    } finally {
      lockRef.current = false;
    }
  };

  return onPlay;
};

export default useOnPlay;
