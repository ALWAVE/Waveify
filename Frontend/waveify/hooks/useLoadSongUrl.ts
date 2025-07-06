import { Song } from "@/models/Song"

const useLoadSongUrl = (song?: Song  | null) => {
  if (!song) {
    return ""
  }
  console.log("Song URL:", song.songPath);
  return song.songPath;
}

export default useLoadSongUrl
