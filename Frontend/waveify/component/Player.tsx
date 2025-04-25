"use client"

import usePlayer from "@/hooks/usePlayer"
import PlayerContent from "./PlayerContent"
import useGetSongById from "@/hooks/useGetSongById"
import useLoadSongUrl from "@/hooks/useLoadSongUrl"

const Player = () => {
  const player = usePlayer()

  const { song, isLoading } = useGetSongById(player.activeId)
  const songUrl = useLoadSongUrl(song ?? undefined)

  if (isLoading || !song || !songUrl || !player.activeId) {
    console.log("Player not shown:", {
      isLoading,
      song,
      songUrl,
      activeId: player.activeId
    });
    return null;
  }

  return (
    <div
      className="
        fixed 
        bottom-0 
        bg-[var(--bg)] 
        w-full 
        py-2 
        h-[80px] 
        px-4
        z-50
      "
    >
      <PlayerContent key={player.activeId} song={song} songUrl={songUrl} />
    </div>
  )
}

export default Player
