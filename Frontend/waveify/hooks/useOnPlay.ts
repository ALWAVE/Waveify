
import { Song } from "@/models/Song";
import usePlayer from "./usePlayer";

import { useState, useEffect } from "react";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);

  // Загружаем сохраненную громкость из localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem("volume");
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume)); // Восстанавливаем сохраненную громкость
    }
  }, []);

  const onPlay = (id: string) => {
    // Убедитесь, что громкость передается в плеер
    if (player.activeId === id) {
      // 👉 Остановить проигрывание
      return player.setId(null);
    }

    player.setId(id); // активный трек
    player.setIds(songs.map(song => song.id)); // список треков

    // Устанавливаем громкость для нового трека
    player.setVolume(volume); // Передаем текущую громкость
  };

  return onPlay;
};

export default useOnPlay;
