import { Song } from "@/models/Song";

import { useEffect, useState } from "react";
import { listenToSong } from "./listenToSong";
import { useAuth } from "@/providers/AuthProvider";
import usePlayer from "./usePlayer";



const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const { user } = useAuth(); // Подставь под свою реализацию
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const savedVolume = localStorage.getItem("volume");
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

let isSending = false;

const onPlay = async (id: string) => {
  if (isSending) return;
  isSending = true;

  if (user?.id) {
    await listenToSong(user.id, id);
  }

  if (player.activeId === id) {
    player.setId("");
  } else {
    player.setId(id);
    player.setIds(songs.map(song => song.id));
    player.loadVolume();
    player.setVolume(volume);
  }

  isSending = false;
};



  return onPlay;
};

export default useOnPlay;
