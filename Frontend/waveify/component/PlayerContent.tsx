import React, { useState, useEffect, useRef } from "react";
import useSound from "use-sound";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { TbPlayerPlayFilled } from "react-icons/tb";
import { FaBackwardStep, FaForwardStep } from "react-icons/fa6";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { RxSize } from "react-icons/rx";
import * as RadixSlider from "@radix-ui/react-slider";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/models/Song";
import MediaItem from "./MediaItem";
import Slider from "./Slider";
import Tooltip from "./Tooltipe";
import SongLikeButton from "./SongLikeButton"; // Импортируем компонент для лайков
import { twMerge } from "tailwind-merge";
import Link from "next/link";

import toast from "react-hot-toast";
import SubscribeModal from "./SubscribeModal";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
  favorites?: Set<string>;
  isSecondary?: boolean;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl, favorites, isSecondary }) => {


  const player = usePlayer();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [tooltipTime, setTooltipTime] = useState(0);
  const [hoveringSlider, setHoveringSlider] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [isOpen, setIsOpen] = useState(false);


  const isSeeking = useRef(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const volume = player.volume;

  const Icon = isPlaying ? BsPauseFill : TbPlayerPlayFilled;
  const iconSize = isPlaying ? 26 : 22;

  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  useEffect(() => {
    const highQuality = localStorage.getItem("toggleHighQuality");
    if (highQuality != null) {
      setIsChecked(JSON.parse(highQuality));
    }
  }, []);

  const handleHighQuality = () => {
    const newCheckedHighQuality = !isChecked;
    setIsChecked(newCheckedHighQuality);
    localStorage.setItem("toggleHighQuality", JSON.stringify(newCheckedHighQuality));

    if (newCheckedHighQuality) {
      toast.success("High Quality On");
      setIsOpen(true); // Открываем модалку
    } else {
      toast.error("High Quality Off");
    }
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume,
    onplay: () => setIsPlaying(true),
    onpause: () => setIsPlaying(false),
    onend: () => {
      setIsPlaying(false);
      handleNext();
    },
    format: ["mp3"],

  });
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)

  // const handleSwipe = () => {
  //   const diff = touchStartY.current - touchEndY.current;

  //   if (Math.abs(diff) < 30) return; // свайп слишком маленький — игнор
  //   if (diff > 100) {
  //     player.setFullScreen(true); // свайп вверх
  //   }
  // };
  const handlePlayPause = () => {
    if (!sound) return;

    if (isPlaying) {
      pause();
    } else {
      const current = sound.seek();
      if (typeof current === "number" && current >= duration) {
        sound.seek(0);
        setPosition(0);
        setSliderValue(0);
      }

      play();

      if (!intervalRef.current) {
        const id = setInterval(() => {
          const current = sound.seek();
          if (typeof current === "number" && !isSeeking.current) {
            setPosition(current);
            setSliderValue(current);
          }
        }, 500);
        intervalRef.current = id as NodeJS.Timeout;
      }
    }
  };

  const handleNext = () => {
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextId = player.ids[currentIndex + 1] || player.ids[0];
    player.setId(nextId);
  };

  const handlePrev = () => {
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const prevId = player.ids[currentIndex - 1] || player.ids[player.ids.length - 1];
    player.setId(prevId);
  };

  const handleSeek = (value: number) => {
    setSliderValue(value);
    setTooltipTime(value);
    isSeeking.current = true;
  };

  const handleSeekCommit = (value: number) => {
    sound?.seek(value);
    setPosition(value);
    setSliderValue(value);
    isSeeking.current = false;
  };


  let previousVolume = 1;
  const toggleMute = () => {
    if (volume === 0) {
      player.setVolume(previousVolume);
    } else {
      previousVolume = volume;
      player.setVolume(0);
    }
  };
  const handleVolumeChange = (newVolume: number) => {
    player.setVolume(newVolume); // Немедленно сохраняем новую громкость в состояние и localStorage
  };


  useEffect(() => {
    if (sound) {
      const id = setInterval(() => {
        const current = sound.seek();
        if (typeof current === "number" && !isSeeking.current) {
          setPosition(current);
          setSliderValue(current);
        }
      }, 500);

      intervalRef.current = id as NodeJS.Timeout;

      return () => clearInterval(id);
    }
  }, [sound]);

  useEffect(() => {
    if (sound) {
      const duration = sound.duration();
      if (typeof duration === "number") {
        setDuration(duration);
      }
    }
  }, [sound]);

  useEffect(() => {
    if (sound && !isSecondary) {
      sound.play()
    }
    return () => {
      sound?.unload()
    }
  }, [sound, isSecondary])


  return (
    <div
      onTouchStart={(e) => (touchStartY.current = e.touches[0].clientY)}
      onTouchMove={(e) => (touchEndY.current = e.touches[0].clientY)}
      // onTouchEnd={(e) => {
      //   const diff = touchStartY.current - touchEndY.current;
      //   if (Math.abs(diff) > 50) {
      //     handleSwipe();
      //   }
      // }}

      className={twMerge(`grid bg-[var(--bg)]  grid-cols-2 md:grid-cols-3 h-full items-center px-2  `, player.activeId && "h-[calc(100%-80px)]")}>
      {/* Left: Song info */}

      <div className="flex justify-start items-center min-w-0 gap-2">
        <div className="min-w-0 max-w-[60%]">
          <Link href={`/song/${song.id}`} passHref>
            <MediaItem data={song} />
          </Link>
        </div>
        <SongLikeButton
          songId={song?.id}
          title={song?.title}
          author={song?.author}
          imagePath={song?.imagePath}
          toolTipePosition="top"
        />

      </div>


      {/* Heart icon to mark as favorite */}
      {/*  Используем компонент SongLikeButton */}

      {/* Center: Controls + Progress */}
      <div className="flex flex-col items-center gap-2 w-full ">
        <div className="flex items-center gap-6">
          <FaBackwardStep
            onClick={handlePrev}
            size={22}
            className="text-neutral-400 hover:text-[var(--text)] cursor-pointer"
          />
          <div
            onClick={handlePlayPause}
            className="transition-all duration-200 ease-in-out active:scale-95 hover:scale-109 
            active:opacity-80 flex items-center justify-center h-9 w-9 rounded-full bg-[var(--lightRose)] p-1 cursor-pointer"
          >
            <Icon size={iconSize} className="text-[var(--textBW)]" />
          </div>
          <FaForwardStep
            onClick={handleNext}
            size={22}
            className="text-neutral-400 hover:text-[var(--text)] cursor-pointer"
          />

        </div>

        <div className="flex items-center gap-2 w-full mb-2">
          <span className="text-xs text-neutral-400">{formatTime(position)}</span>
          <div
            className="relative w-full "
            onMouseEnter={() => setHoveringSlider(true)}
            onMouseLeave={() => setHoveringSlider(false)}
          >
            <RadixSlider.Root
              className="relative flex items-center select-none touch-none w-full h-2 group cursor-pointer"
              value={[sliderValue]}
              min={0}
              max={duration}
              step={0.1}
              onValueChange={([val]) => handleSeek(val)}
              onValueCommit={([val]) => handleSeekCommit(val)}
            >
              <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
                <RadixSlider.Range className="absolute rounded-full h-full transition-colors bg-[var(--lightRose)] group-hover:bg-rose-500" />
              </RadixSlider.Track>
              <RadixSlider.Thumb className="block w-4 h-4 rounded-full bg-[var(--lightRose)] border border-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </RadixSlider.Root>

            {hoveringSlider && (
              <Tooltip label={formatTime(tooltipTime)} position="top" />
            )}
          </div>
          <span className="text-xs text-neutral-400">{formatTime(duration)}</span>

        </div>

      </div>

      {/* Right: Volume */}
      <div className="hidden md:flex justify-end w-full pr-2">
        <button
          onClick={handleHighQuality}
          className={twMerge(
            "ml-11 cursor-pointer text-xs rounded-lg px-2 py-1 text-[var(--text)] transition",
            isChecked && "bg-gradient-to-r from-rose-500 to-purple-100 bg-clip-text text-transparent text-base font-black"
          )}
        >
          HQ
        </button>

        <button
          // onClick={() => player.setFullScreen(true)}
          className="cursor-pointer  ml-4 px-3 py-1 text-[var(--text)] transition"
        >
          <RxSize size={26} />
        </button>
        <div className="flex items-center gap-x-2 w-[180px]">
          <VolumeIcon
            onClick={toggleMute}
            size={26}
            className="cursor-pointer text-[var(--lightRose)]"
          />
          <Slider value={volume} onChange={handleVolumeChange} />
        </div>
      </div>
      <SubscribeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>

  );
};

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default PlayerContent;
