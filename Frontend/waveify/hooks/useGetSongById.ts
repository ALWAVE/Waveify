import { useEffect, useState } from "react"
import { Song } from "@/models/Song"

const useGetSongById = (id?: string) => {
  const [song, setSong] = useState<Song | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    console.log("Fetching song:", id);
    setIsLoading(true)
    fetch(`https://localhost:7040/Song/${id}`)
      .then(res => res.json())
      .then(data => setSong(data))
      .finally(() => setIsLoading(false))
  }, [id])

  return { song, isLoading }
}

export default useGetSongById
