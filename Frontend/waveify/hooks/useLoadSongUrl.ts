// hooks/useLoadSongUrl.ts
import { Song } from "@/models/Song";

export default function useLoadSongUrl(song?: Song) {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ?? "http://77.94.203.78:5000";

  if (!song?.id) return "";
  // ВСЕГДА стримим через свой бэкенд — никакого прямого S3 в браузере
  return `${API_BASE}/song/stream/${song.id}`;
}
