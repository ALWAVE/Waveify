"use client";

import * as React from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

type Props = {
  value: number;                 // 0..1
  onChange: (v: number) => void; // громкость
  onToggleMute?: () => void;
  className?: string;
};

export default function VolumeControl({
  value,
  onChange,
  onToggleMute,
  className,
}: Props) {
  const [hover, setHover] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const pct = Math.round((value ?? 0) * 100);
  const Icon = value === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  const setVal = (v: number) => onChange(clamp(v, 0, 1));

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const step = e.deltaY < 0 ? 0.01 : -0.01;
    setVal((value ?? 0) + step);
  };

  const handleKey: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setVal((value ?? 0) + 0.02); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setVal((value ?? 0) - 0.02); }
    if (e.key.toLowerCase() === "m") onToggleMute?.();
  };

  const expanded = hover || dragging;   // только высота меняется по hover/drag
  const showBubble = expanded;

  return (
    <div
      className={twMerge(
        "group flex items-center gap-2 select-none shrink-0",
        className
      )}
      onKeyDown={handleKey}
      role="group"
      aria-label="Volume control"
    >
      {/* Mute */}
      <button
        type="button"
        title={value === 0 ? "Unmute" : "Mute"}
        onClick={onToggleMute}
        className="shrink-0 grid place-items-center rounded-md p-1 hover:opacity-90 active:scale-95 transition"
        aria-label={value === 0 ? "Unmute" : "Mute"}
      >
        <Icon size={18} className="text-[var(--lightRose)]" />
      </button>

      {/* Фиксированная ширина; изменяется только высота на hover */}
      <div
        className="relative h-7 w-[140px]"  // ← хочешь — подгони ширину
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onWheel={handleWheel}
      >
        <RadixSlider.Root
          className="relative flex items-center h-full w-full touch-none"
          value={[value ?? 0]}
          min={0}
          max={1}
          step={0.005}
          onValueChange={([v]) => { setDragging(true); setVal(v); }}
          onValueCommit={([v]) => { setDragging(false); setVal(v); }}
          aria-label="Volume"
        >
          {/* Трек: только высота анимируется */}
          <RadixSlider.Track
            className={twMerge(
              "relative grow rounded-full bg-neutral-700/60 overflow-hidden ",
              "transition-[height] duration-200 ease-out cursor-pointer",
              expanded ? "h-[8px]" : "h-[4px]"
            )}
          >
            <RadixSlider.Range
              className="absolute h-full rounded-full bg-[var(--lightRose)] hover:bg-rose-500 "
            //   style={{
            //     background:
            //       "linear-gradient(90deg, var(--lightRose), #ff7ac6 50%, #b388ff 100%)",
            //   }}
            />
            <span className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(60%_140%_at_50%_-30%,#ffffff,transparent)]" />
          </RadixSlider.Track>

          {/* КРУГЛЫЙ ползунок: только высота/ширина меняется + чуть поднят над треком */}
          <RadixSlider.Thumb
            className={twMerge(
              "relative z-10 rounded-full bg-[var(--lightRose)] cursor-pointer hover:bg-rose-500",
              "shadow-[0_4px_12px_rgba(0,0,0,.35)] transition-all duration-200 ease-out",
              expanded ? "h-5 w-5 -translate-y-[2px]" : "h-4 w-4 -translate-y-[2px]"
            )}
          >
            {showBubble && (
              <span
                className={twMerge(
                  "absolute -top-7 left-1/2 -translate-x-1/2",
                  "px-1.5 py-0.5 text-[11px] rounded-md",
                  "bg-black/70 text-white whitespace-nowrap"
                )}
              >
                {pct}%
              </span>
            )}
          </RadixSlider.Thumb>
        </RadixSlider.Root>
      </div>
    </div>
  );
}
