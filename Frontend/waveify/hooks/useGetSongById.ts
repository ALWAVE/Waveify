import { useEffect, useState } from "react";
import { Song } from "@/models/Song";

interface UseGetSongByIdResult {
  song: Song | null;
  isLoading: boolean;
  error: string | null;
}

const useGetSongById = (id?: string): UseGetSongByIdResult => {
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    console.log("Fetching song:", id);
    setIsLoading(true);
    setError(null); // Сбрасываем ошибку перед новым запросом

    fetch(`http://77.94.203.78:5000/Song/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch song with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSong(data);
      })
      .catch((err) => {
        console.error("Error fetching song:", err);
        setError(err.message || "An unknown error occurred");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return { song, isLoading, error };
};

export default useGetSongById;