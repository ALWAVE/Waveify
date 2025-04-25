import { useEffect, useState } from "react"
import { Song } from "@/models/Song"
import { getAllSongs } from "@/services/songs"

const useSongs = () => {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSongs = async () => {
    try {
      setIsLoading(true)
      const data = await getAllSongs()
      setSongs(data)
    } catch (err) {
      console.error("Ошибка при загрузке песен:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  return {
    songs,
    isLoading,
    refresh: fetchSongs,
  }
}

export default useSongs
