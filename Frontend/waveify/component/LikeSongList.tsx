import { useEffect, useState } from "react";


import { Song } from "@/models/Song"; // Импортируйте модель, если она у вас есть

interface LikeSongListProps {
  songs: Song[]; // Укажите тип для songs
}
function LikeSongList({ songs }: LikeSongListProps) {
  const [likesCounts, setLikesCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (songs.length === 0) return;

    const songIds = songs.map(song => song.id);

    fetch("/api/LikedSongs/likesCounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(songIds),
    })
      .then(res => res.json())
      .then(data => {
        setLikesCounts(data);
      })
      .catch(console.error);
  }, [songs]);

  return (
    <div>
      {songs.map(song => (
        <div key={song.id}>
          <span>{song.title}</span>
          <span>Likes: {likesCounts[song.id] ?? 0}</span>
        </div>
      ))}
    </div>
  );
}
export default LikeSongList;