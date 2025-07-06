// "use client"


// import usePlayer from "@/hooks/usePlayer"
// import { useEffect, useRef, useState } from "react"
// import { Pause, Play, SkipBack, SkipForward, X } from "lucide-react"
// import { Song } from "@/models/Song"

// interface FullScreenPlayerProps {
//   song: Song
//   songUrl: string
//   play: () => void
//   pause: () => void
//   sound: any
// }

// const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
//   song,
//   play,
//   pause,
//   sound
// }) => {
//   const player = usePlayer()
//   const [isPlaying, setIsPlaying] = useState(player.isPlaying)
//   const [progress, setProgress] = useState(0)
//   const intervalRef = useRef<NodeJS.Timeout | null>(null)

//   // Автоматическое обновление прогресса
//   useEffect(() => {
//     if (sound) {
//       if (isPlaying) {
//         intervalRef.current = setInterval(() => {
//           const current = sound.seek() || 0
//           const total = sound.duration() || 1
//           setProgress((current / total) * 100)
//         }, 500)
//       } else {
//         clearInterval(intervalRef.current!)
//       }
//     }
//     return () => clearInterval(intervalRef.current!)
//   }, [isPlaying, sound])

//   const handlePlayPause = () => {
//     if (isPlaying) {
//       pause()
//       setIsPlaying(false)
//     } else {
//       play()
//       setIsPlaying(true)
//     }
//   }

//   const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = parseFloat(e.target.value)
//     setProgress(value)
//     const duration = sound?.duration() || 1
//     sound.seek((value / 100) * duration)
//   }

//   const handlePrev = () => {
//     const currentIndex = player.ids.findIndex(id => id === player.activeId)
//     const prevId = player.ids[currentIndex - 1] || player.ids[player.ids.length - 1]
//     player.setId(prevId)
//   }

//   const handleNext = () => {
//     const currentIndex = player.ids.findIndex(id => id === player.activeId)
//     const nextId = player.ids[currentIndex + 1] || player.ids[0]
//     player.setId(nextId)
//   }

//   return (
//     <div className="fixed inset-0 bg-[var(--bg)] text-[var(--text)] z-[9999] flex flex-col items-center justify-center p-6">
//       {/* Закрыть полноэкранный режим */}
//       <button
//         onClick={() => player.setFullScreen(false)}
//         className="absolute top-4 right-4 text-white"
//       >
//         <X size={28} />
//       </button>

//       {/* Обложка */}
//       <img
//         src={song.imagePath}
//         alt={song.title}
//         className="w-64 h-64 object-cover rounded-xl shadow-xl mb-6"
//       />

//       {/* Инфо */}
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-bold">{song.title}</h2>
//         <p className="text-sm opacity-80">{song.author}</p>
//       </div>

//       {/* Прогресс */}
//       <input
//         type="range"
//         min={0}
//         max={100}
//         value={progress}
//         onChange={handleSeek}
//         className="w-full max-w-md mb-4"
//       />

//       {/* Контроллы */}
//       <div className="flex gap-8 items-center justify-center">
//         <button onClick={handlePrev}>
//           <SkipBack size={32} />
//         </button>
//         <button
//           onClick={handlePlayPause}
//           className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-black"
//         >
//           {isPlaying ? <Pause size={32} /> : <Play size={32} />}
//         </button>
//         <button onClick={handleNext}>
//           <SkipForward size={32} />
//         </button>
//       </div>
//     </div>
//   )
// }

// export default FullScreenPlayer
