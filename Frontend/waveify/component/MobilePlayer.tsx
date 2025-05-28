// "use client";
// import { BsPlayFill, BsPauseFill } from "react-icons/bs";
// import { useEffect, useState } from "react";
// import usePlayer from "@/hooks/usePlayer";
// import MediaItem from "./MediaItem";
// import Link from "next/link";

// const MobilePlayer = () => {
//   const player = usePlayer();
//   const [isPlaying, setIsPlaying] = useState(false);
//   const activeSong = player.activeSong;

//   useEffect(() => {
//     if (!player.sound || !activeSong) return;

//     const update = () => {
//       setIsPlaying(player.sound?.playing() || false);
//     };

//     player.sound.on("play", update);
//     player.sound.on("pause", update);
//     player.sound.on("end", () => setIsPlaying(false));

//     update();

//     return () => {
//       player.sound?.off("play", update);
//       player.sound?.off("pause", update);
//       player.sound?.off("end");
//     };
//   }, [player.sound, activeSong]);

//   if (!activeSong) return null; // 👈 ключевое условие

//   return (
//     <div className="fixed bottom-[64px] left-0 right-0 z-30 bg-black p-3 flex justify-between items-center md:hidden">
//       <Link href={`/song/${activeSong.id}`} className="flex-1">
//         <MediaItem data={activeSong} small />
//       </Link>

//       <button
//         onClick={() => {
//           if (!player.sound) return;
//           isPlaying ? player.sound.pause() : player.sound.play();
//         }}
//         className="text-white p-2 ml-4 rounded-full bg-rose-600"
//       >
//         {isPlaying ? <BsPauseFill size={24} /> : <BsPlayFill size={24} />}
//       </button>
//     </div>
//   );
// };

// export default MobilePlayer;
