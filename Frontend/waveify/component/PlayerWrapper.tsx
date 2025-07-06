"use client";

import usePlayer from "@/hooks/usePlayer";
import { twMerge } from "tailwind-merge";

const PlayerWrapper = () => {
  const player = usePlayer();

//   useEffect(() => {
//     const storedVolume = localStorage.getItem("volume");
//     if (storedVolume) {
//       player.setVolume(parseFloat(storedVolume));
//     }
//   }, [player]);

  return (
     <div className={twMerge(`flex h-full`, player.activeId && "h-[calc(100%-80px)]")}>

    </div>
  )
};

export default PlayerWrapper;
