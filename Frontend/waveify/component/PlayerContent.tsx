// component/PlayerContent.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import useSound from "use-sound";
import { Howler } from "howler"; // ⟵ добавили
import { BsPauseFill } from "react-icons/bs";
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
import SongLikeButton from "./SongLikeButton";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import toast from "react-hot-toast";
import SubscribeModal from "./SubscribeModal";
import FullScreenPlayer from "./FullScreenPlayer";
import useAudioFx from "@/hooks/useAudioFx";
import VolumeControl from "./VolumeControl";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
  favorites?: Set<string>;
  isSecondary?: boolean;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  song,
  songUrl,
  favorites,
  isSecondary,
}) => {
  const player = usePlayer();

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const fx = useAudioFx();

  const [tooltipTime, setTooltipTime] = useState(0);
  const [hoveringSlider, setHoveringSlider] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isSeeking = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousVolumeRef = useRef(1);

  const volume = player.volume;
  const Icon = isPlaying ? BsPauseFill : TbPlayerPlayFilled;
  const iconSize = isPlaying ? 26 : 22;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  // восстановим состояние HQ из localStorage
  useEffect(() => {
    const highQuality =
      typeof window !== "undefined" ? localStorage.getItem("toggleHighQuality") : null;
    if (highQuality != null) setIsChecked(JSON.parse(highQuality));
  }, []);

  // HQ пресет (оставил твои значения)
  useEffect(() => {
    if (!fx.ready) return;

    if (isChecked) {
      fx.setLowShelfFreq(100);
      fx.setLowShelfDb(6);
      fx.setHighShelfFreq(9000);
      fx.setHighShelfDb(10);
      fx.setPresenceDb(1.5);

      fx.setDrive(0.02);
      fx.setHeadroomDb(8);
      fx.setCeilingDb(-1);
      fx.setLookaheadMs(4);
      fx.setMakeup(1);
      fx.setWet(1);
     
      fx.setEnabled(true);
    } else {
      fx.setEnabled(false);
    }
  }, [isChecked, fx.ready]); // eslint-disable-line

  const handleHighQuality = () => {
    const next = !isChecked;
    setIsChecked(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("toggleHighQuality", JSON.stringify(next));
    }
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume,
    html5: false, // WebAudio
    onplay: () => setIsPlaying(true),
    onpause: () => setIsPlaying(false),
    onend: () => {
      setIsPlaying(false);
      handleNext();
    },
    format: ["mp3"],
  });

  const handlePlayPause = () => {
    if (!sound) return;

    if (isPlaying) {
      pause();
      player.pause();
      return;
    }

    const current = sound.seek();
    if (typeof current === "number" && current >= duration) {
      sound.seek(0);
      setPosition(0);
      setSliderValue(0);
    }
    play();
    player.play();
  };

  const handleNext = () => {
    const i = player.ids.findIndex((id) => id === player.activeId);
    const nextId = player.ids[i + 1] || player.ids[0];
    player.setId(nextId);
  };

  const handlePrev = () => {
    const i = player.ids.findIndex((id) => id === player.activeId);
    const prevId = player.ids[i - 1] || player.ids[player.ids.length - 1];
    player.setId(prevId);
  };

  const handleSeek = (value: number) => {
    setSliderValue(value);
    setTooltipTime(value);
    setIsDragging(true);
    isSeeking.current = true;
  };

  const handleSeekCommit = (value: number) => {
    sound?.seek(value);
    setPosition(value);
    setSliderValue(value);
    setIsDragging(false);
    isSeeking.current = false;
  };

  const toggleMute = () => {
    if (volume === 0) {
      player.setVolume(previousVolumeRef.current);
    } else {
      previousVolumeRef.current = volume;
      player.setVolume(0);
    }
  };
  const handleVolumeChange = (newVolume: number) => {
    player.setVolume(newVolume);
  };

  // ───────────────────────────
  // ГРОМКОСТЬ: синхронизация
  // ───────────────────────────

  // 1) Подтягиваем сохранённую громкость при маунте + применяем к master
  useEffect(() => {
    if (!player.volumeLoaded) {
      player.loadVolume();
    }
    try {
      Howler.volume(player.volume);
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Любое изменение store.volume → обновляем Howler.masterGain и текущий Howl
  // 2) Любое изменение store.volume → плавно гоним masterGain через WebAudio automation
  useEffect(() => {
    const h: any = Howler;
    const ctx: AudioContext | undefined = h?.ctx;
    const mg: GainNode | undefined = h?.masterGain;

    if (ctx && mg) {
      const now = ctx.currentTime;
      try {
        // отменяем прошлые кривые и плавно тянем к новой цели
        mg.gain.cancelScheduledValues(now);
        // timeConstant ~ 60–90ms даёт мягкое, но отзывчивое ощущение
        mg.gain.setTargetAtTime(volume, now, 0.06);
      } catch { }
    } else {
      // fallback, если вдруг Howler не в WebAudio
      try { Howler.volume(volume); } catch { }
      try { sound?.volume(volume); } catch { }
    }
  }, [volume, sound]);


  // 3) Создался новый sound (новый трек) → сразу выставляем ему громкость
  useEffect(() => {
    if (!sound) return;
    try {
      sound.volume(player.volume);
    } catch { }
    try {
      Howler.volume(player.volume);
    } catch { }
  }, [sound, player.volume]);


  // ───────────────────────────

  // позиция
  useEffect(() => {
    if (!sound) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const id = setInterval(() => {
      const current = sound.seek();
      if (typeof current === "number" && !isSeeking.current) {
        setPosition(current);
        setSliderValue(current);
      }
    }, 500);
    intervalRef.current = id as NodeJS.Timeout;
    return () => {
      clearInterval(id);
      intervalRef.current = null;
    };
  }, [sound]);

  // длительность
  useEffect(() => {
    if (!sound) return;
    const d = sound.duration();
    if (typeof d === "number") setDuration(d);
  }, [sound]);

  // автоплей при новом треке
  useEffect(() => {
    setPosition(0);
    setSliderValue(0);
    setIsDragging(false);
    if (sound && !isSecondary) {
      sound.play();
      player.play();
    }
    return () => {
      sound?.unload();
    };
  }, [sound, isSecondary]); // eslint-disable-line

  // свайп вверх -> фуллскрин
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const openIfSwipeUp = () => {
    const diff = touchStartY.current - touchEndY.current;
    if (diff > 80) player.setFullScreen(true);
  };

  return (
    <>
      <div
        onTouchStart={(e) => (touchStartY.current = e.touches[0].clientY)}
        onTouchMove={(e) => (touchEndY.current = e.touches[0].clientY)}
        onTouchEnd={openIfSwipeUp}
        className={twMerge(
          `relative grid bg-[var(--bg)] grid-cols-2 md:grid-cols-3 h-full items-center px-2`,
          player.activeId && "h-[calc(100%-80px)]"
        )}
      >
        {/* Left: Song info */}
        <div className="flex justify-start items-center min-w-0 gap-2">
          <div className="min-w-0 max-w-[60%]">
            <MediaItem
              data={song}

            />
          </div>
          <SongLikeButton
            songId={song?.id}
            title={song?.title}
            author={song?.author}
            imagePath={song?.imagePath}
            toolTipePosition="top"
          />
        </div>

        {/* Center: controls + progress */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex items-center gap-6">
            <FaBackwardStep
              onClick={handlePrev}
              size={22}
              className="text-neutral-400 hover:text-[var(--text)] cursor-pointer"
            />
            <div
              onClick={handlePlayPause}
              className="transition-all duration-200 ease-in-out active:scale-95 hover:scale-109 flex items-center justify-center h-9 w-9 rounded-full bg-[var(--lightRose)] p-1 cursor-pointer"
            >
              {isPlaying ? (
                <BsPauseFill size={iconSize} className="text-[var(--textBW)]" />
              ) : (
                <TbPlayerPlayFilled size={iconSize} className="text-[var(--textBW)]" />
              )}
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
              className="relative w-full"
              onMouseEnter={() => setHoveringSlider(true)}
              onMouseLeave={() => setHoveringSlider(false)}
            >
              <RadixSlider.Root
                className="relative flex items-center select-none touch-none w-full h-2 group cursor-pointer"
                value={[isDragging ? sliderValue : position]}
                min={0}
                max={Math.max(1, duration)}
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
                <Tooltip label={formatTime(isDragging ? sliderValue : position)} position="top" />
              )}
            </div>

            <span className="text-xs text-neutral-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume + expand + HQ */}
        <div className="hidden md:flex items-center justify-end w-full pr-2 gap-2 shrink-0">
          <button
            onClick={handleHighQuality}
            className={twMerge(
              "hq-btn text-xs whitespace-nowrap",
              isChecked ? "hq-on" : "text-[var(--text)] hover:border-white/20"
            )}
            title="Audio Enhance"
            aria-pressed={isChecked}
          >
            <span>HQ</span>
            {isChecked && <span aria-hidden className="hq-pulse" />}
          </button>



          <button
            onClick={() => player.setFullScreen(true)}
            className="cursor-pointer px-2 py-1 text-[var(--text)] transition shrink-0"
            aria-label="Open fullscreen"
            title="Fullscreen player"
          >
            <RxSize size={22} />
          </button>

          <VolumeControl
            value={volume}
            onChange={handleVolumeChange}
            onToggleMute={toggleMute}
          />
        </div>


        {/* мобильная кнопка развернуть */}
        <button
          onClick={() => player.setFullScreen(true)}
          className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[var(--text)]/80 active:opacity-80"
          aria-label="Open fullscreen"
        >
          <RxSize size={22} />
        </button>

        <SubscribeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>

      {/* Fullscreen overlay */}
      <FullScreenPlayer
        isOpen={player.fullScreen}
        onClose={() => player.setFullScreen(false)}
        song={song}
        isPlaying={isPlaying}
        seekValue={isDragging ? sliderValue : position}
        position={position}
        duration={duration}
        volume={volume}
        hq={isChecked}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={handleSeek}
        onSeekCommit={handleSeekCommit}
        onVolume={() => { }}
        onToggleHQ={handleHighQuality}
        toggleMute={() => { }}
      />
    </>
  );
};

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss < 10 ? "0" : ""}${ss}`;
}

export default PlayerContent;
