import { useState } from "react";
import { Song } from "@/models/Song"; // если тип есть

const useSongs = (selectedVibes: string[]) => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = () => {
    setIsLoading(true);

    const isAllSelected = selectedVibes.length === 0;

    const url = isAllSelected
      ? "http://77.94.203.78:5000/Song"
      : `http://77.94.203.78:5000/Song/by-vibe?vibes=${selectedVibes.map(encodeURIComponent).join("&vibes=")}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Сортировка: новые сверху
        const sorted = data.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
        setSongs(sorted);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке песен:", err);
        setSongs([]);
      })
      .finally(() => setIsLoading(false));
  };

  return { songs, isLoading, refresh };
};


export default useSongs;
