import { Song } from "@/models/Song"

const useLoadImage = (song?: Song  | null) => {
  if (!song) {
    return ""
  }
  console.log("Song URL:", song.imagePath);
  return song.imagePath;
}

export default useLoadImage
