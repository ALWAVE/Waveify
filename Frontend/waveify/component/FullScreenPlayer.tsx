import React, { useRef, useState, useEffect } from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import { BsPauseFill } from "react-icons/bs";
import { TbPlayerPlayFilled } from "react-icons/tb";
import { FaBackwardStep, FaForwardStep } from "react-icons/fa6";
import { HiOutlineChevronDown } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import SongLikeButton from "./SongLikeButton";
import { motion, AnimatePresence } from "framer-motion";
import { Song } from "@/models/Song";

type Props = {
  isOpen: boolean;
  onClose: () => void;

  song: Song;
  isPlaying: boolean;
  seekValue: number;   // что рисуем на слайдере (sliderValue/position)
  position: number;    // реальная позиция (для текста времени/логики)
  duration: number;
  volume: number;      // не используется, просто для совместимости
  hq?: boolean;

  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (v: number) => void;        // onChange — только UI
  onSeekCommit: (v: number) => void;  // onCommit — фактический seek
  onVolume: (v: number) => void;      // noop
  onToggleHQ?: () => void;
  toggleMute: () => void;             // noop
};

const FullScreenPlayer: React.FC<Props> = ({
  isOpen,
  onClose,
  song,
  isPlaying,
  seekValue,
  position,
  duration,
  volume,
  hq,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onSeekCommit,
  onVolume,
  onToggleHQ,
  toggleMute,
}) => {
  const Icon = isPlaying ? BsPauseFill : TbPlayerPlayFilled;

  // Мини-режим при очень маленькой высоте
  const [isMini, setIsMini] = useState(false);
  useEffect(() => {
    const check = () => setIsMini(window.innerHeight < 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // свайп-вниз — только по «грабберу»
  const startY = useRef(0);
  const endY = useRef(0);
  const grabberRef = useRef<HTMLDivElement | null>(null);
  const tracking = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    if (!grabberRef.current) return;
    const target = e.target as HTMLElement;
    if (grabberRef.current.contains(target)) {
      tracking.current = true;
      startY.current = e.touches[0].clientY;
      endY.current = e.touches[0].clientY;
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!tracking.current) return;
    endY.current = e.touches[0].clientY;
  };
  const onTouchEnd = () => {
    if (!tracking.current) return;
    const diff = startY.current - endY.current;
    tracking.current = false;
    if (diff < -80) onClose();
  };

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v || 0));
  const safeSeek = clamp(seekValue, 0, Math.max(1, duration));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* затемнение общего фона */}
          <motion.div
            className="fixed inset-0 z-[998] bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Desktop */}
          <motion.div
            className="fixed inset-0 z-[999] hidden md:flex items-center justify-center p-8"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              {/* === Бэкграунд: та же обложка, размытая и затемнённая === */}
              <BackgroundFromCover imageUrl={song?.imagePath} />

              {/* Контент карточки */}
              <div className="relative grid grid-cols-2 gap-8 p-6 text-white">
                <button
                  className="absolute right-4 top-4 rounded-full p-2 text-white/80 hover:bg-white/10"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <HiOutlineChevronDown size={24} />
                </button>

                {/* Art */}
                <div className="rounded-2xl overflow-hidden bg-neutral-900 aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={song?.imagePath || "/placeholder.png"}
                    alt={song?.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Controls */}
                <div className="flex flex-col">
                  <Header song={song} hq={hq} onToggleHQ={onToggleHQ} />
                  <PlayerSlider
                    value={safeSeek}
                    min={0}
                    max={Math.max(1, duration)}
                    onChange={onSeek}
                    onCommit={onSeekCommit}
                    leftTime={formatTime(safeSeek)}
                    rightTime={formatTime(duration)}
                  />
                  <MainControls
                    Icon={Icon}
                    onPrev={onPrev}
                    onPlayPause={onPlayPause}
                    onNext={onNext}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[999] h-[100dvh] md:hidden rounded-t-3xl overflow-hidden shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* фон из обложки */}
            <BackgroundFromCover imageUrl={song?.imagePath} mobile />

            <div className="relative flex h-full flex-col text-white">
              <div ref={grabberRef} className="pt-3 pb-1">
                <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-white/40" />
                <div className="flex items-center justify-between px-4">
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-white/90 hover:bg-white/10"
                    aria-label="Close"
                  >
                    <HiOutlineChevronDown size={20} />
                  </button>
                  <div className="text-xs text-white/80">Сейчас играет</div>
                  <div className="w-8" />
                </div>
              </div>

              {isMini ? (
                <MiniLayout
                  song={song}
                  Icon={Icon}
                  isPlaying={isPlaying}
                  onPlayPause={onPlayPause}
                  onPrev={onPrev}
                  onNext={onNext}
                  value={safeSeek}
                  duration={duration}
                  onSeek={onSeek}
                  onCommit={onSeekCommit}
                />
              ) : (
                <FullMobileLayout
                  song={song}
                  Icon={Icon}
                  isPlaying={isPlaying}
                  onPlayPause={onPlayPause}
                  onPrev={onPrev}
                  onNext={onNext}
                  value={safeSeek}
                  duration={duration}
                  onSeek={onSeek}
                  onCommit={onSeekCommit}
                  hq={hq}
                  onToggleHQ={onToggleHQ}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ---------- Reusable background from cover ---------- */
function BackgroundFromCover({ imageUrl, mobile = false }: { imageUrl?: string; mobile?: boolean }) {
  return (
    <div className="absolute inset-0 -z-10">
      {/* картинка-заливка */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl || "/placeholder.png"}
        alt=""
        aria-hidden
        className={twMerge(
          "h-full w-full object-cover",
          // лёгкий «перебор» чтоб кромки не были пустые
          "scale-110",
          // размываем и насыщаем чтобы фон «под цвет обложки»
          "blur-3xl saturate-150",
          // делаем темнее, чтоб текст был читабельным
          "brightness-[0.45]"
        )}
      />
      {/* градиент сверху для глубины */}
      <div
        className={twMerge(
          "absolute inset-0",
          mobile
            ? "bg-gradient-to-b from-black/30 via-black/40 to-black/75"
            : "bg-gradient-to-r from-black/25 via-black/40 to-black/80"
        )}
      />
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function Header({ song, hq, onToggleHQ }: any) {
  return (
    <div className="flex items-start justify-between gap-3 text-white">
      <div className="min-w-0">
        <Link href={`/song/${song?.id}`}>
          <div className="truncate text-xl font-semibold">{song?.title}</div>
        </Link>
        <div className="truncate text-sm opacity-80">{song?.author}</div>
      </div>
      <SongLikeButton
        songId={song?.id}
        title={song?.title}
        author={song?.author}
        imagePath={song?.imagePath}
        toolTipePosition="left"
      />
      <button
        onClick={onToggleHQ}
        className={twMerge(
          "ml-2 rounded-md border border-white/30 px-2 py-1 text-[11px] text-white/90",
          hq &&
            "bg-gradient-to-r from-rose-300 to-purple-300 bg-clip-text text-transparent border-transparent font-semibold"
        )}
      >
        HQ
      </button>
    </div>
  );
}

function PlayerSlider({
  value,
  min,
  max,
  onChange,
  onCommit,
  leftTime,
  rightTime,
}: any) {
  return (
    <div className="mt-4">
      <RadixSlider.Root
        value={[value]}
        min={min}
        max={max}
        step={0.1}
        onValueChange={([v]) => onChange(v)}     // только UI
        onValueCommit={([v]) => onCommit(v)}    // фактический seek
        className="relative flex h-8 w-full select-none items-center"
      >
        <RadixSlider.Track className="relative h-[5px] w-full grow rounded-full bg-white/30">
          <RadixSlider.Range className="absolute h-full rounded-full bg-white" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="block h-5 w-5 rounded-full bg-white shadow" />
      </RadixSlider.Root>
      <div className="mt-1 flex justify-between text-xs text-white/85">
        <span>{leftTime}</span>
        <span>{rightTime}</span>
      </div>
    </div>
  );
}

function MainControls({ Icon, onPrev, onPlayPause, onNext }: any) {
  return (
    <div className="mt-5 flex items-center justify-center gap-6 text-white">
      <IconButton onClick={onPrev}>
        <FaBackwardStep size={20} />
      </IconButton>
      <button
        onClick={onPlayPause}
        className="h-12 w-12 rounded-full bg-white text-black shadow-lg active:scale-95 transition"
        aria-label="Play/Pause"
      >
        <Icon size={24} className="mx-auto" />
      </button>
      <IconButton onClick={onNext}>
        <FaForwardStep size={20} />
      </IconButton>
    </div>
  );
}

function FullMobileLayout(props: any) {
  return (
    <div className="flex flex-col px-4 pb-6 overflow-y-auto text-white">
      <div className="rounded-xl overflow-hidden bg-neutral-900 aspect-square mb-4">
        <img
          src={props.song?.imagePath || "/placeholder.png"}
          alt={props.song?.title}
          className="h-full w-full object-cover"
        />
      </div>

      <Header {...props} />

      <PlayerSlider
        value={props.value}
        min={0}
        max={Math.max(1, props.duration)}
        onChange={props.onSeek}
        onCommit={props.onCommit}
        leftTime={formatTime(props.value)}
        rightTime={formatTime(props.duration)}
      />

      <MainControls {...props} />
    </div>
  );
}

function MiniLayout({
  song,
  Icon,
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  value,
  duration,
  onSeek,
  onCommit,
}: any) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 text-white">
      <div className="h-14 w-14 overflow-hidden rounded-md bg-neutral-800 flex-shrink-0">
        <img
          src={song?.imagePath || "/placeholder.png"}
          alt={song?.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{song?.title}</div>
        <div className="text-xs opacity-85 truncate">{song?.author}</div>
        <RadixSlider.Root
          value={[value]}
          min={0}
          max={Math.max(1, duration)}
          step={0.1}
          onValueChange={([v]) => onSeek(v)}
          onValueCommit={([v]) => onCommit(v)}
          className="relative flex h-5 w-full select-none items-center mt-1"
        >
          <RadixSlider.Track className="relative h-[3px] w-full grow rounded-full bg-white/30">
            <RadixSlider.Range className="absolute h-full rounded-full bg-white" />
          </RadixSlider.Track>
        </RadixSlider.Root>
      </div>
      <IconButton onClick={onPrev}>
        <FaBackwardStep size={18} />
      </IconButton>
      <button
        onClick={onPlayPause}
        className="h-9 w-9 rounded-full bg-white text-black flex items-center justify-center"
        aria-label="Play/Pause"
      >
        <Icon size={18} />
      </button>
      <IconButton onClick={onNext}>
        <FaForwardStep size={18} />
      </IconButton>
    </div>
  );
}

function IconButton({
  onClick,
  children,
}: React.PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      className="rounded-full p-2 text-white/90 hover:bg-white/10 active:opacity-80"
    >
      {children}
    </button>
  );
}

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss < 10 ? "0" : ""}${ss}`;
}

export default FullScreenPlayer;
