"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import HALO from "vanta/dist/vanta.halo.min";
import usePlayer from "@/hooks/usePlayer";
import { useAudioAnalyser, avgBand, maxBand, clamp, lerp } from "@/hooks/useAudioAnalyser";

type Props = {
  height?: number;
  idleBreath?: boolean;       // лёгкое «дыхание» на паузе
  onStartMyWave?: () => void; // действие при клике на кнопку
};

export default function MyWave({
  height = 400,
  idleBreath = false,
  onStartMyWave,
}: Props) {
  const player = usePlayer();

  const hostRef = useRef<HTMLDivElement | null>(null);
  const vantaRef = useRef<any>(null);

  const rafRef = useRef<number | null>(null);
  const pulseRef = useRef(0);
  const runningRef = useRef(false);

  // слушаем тот же звук, что и PlayerContent (Howler)
  const { ready, getData } = useAudioAnalyser();

  /* -------- VANTA init -------- */
  useEffect(() => {
    if (!hostRef.current || vantaRef.current) return;
    vantaRef.current = HALO({
      el: hostRef.current,
      THREE,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: height,
      minWidth: 320,
      backgroundAlpha: 0.0,
      backgroundColor: 0x00000000,
      baseColor: 0xffffff,
      color: 0xff4df5,
      color2: 0x00ffe0,
      amplitudeFactor: 1.2,
      size: 1.2,
      
    });
    return () => {
      stopLoop();
      vantaRef.current?.destroy?.();
      vantaRef.current = null;
    };
  }, [height]);

  /* -------- запуск RAF как только анализатор готов -------- */
  useEffect(() => {
    if (ready) startLoop();
    return stopLoop;
  }, [ready]);

  function startLoop() {
    if (runningRef.current) return;
    runningRef.current = true;

    const run = () => {
      rafRef.current = requestAnimationFrame(run);

      const fx = vantaRef.current;
      const data = getData?.();
      if (!fx || !data) return;

      // Энергия сигнала — средняя по всему спектру
      let energy = 0;
      for (let i = 0; i < data.length; i++) energy += data[i];
      energy /= Math.max(1, data.length);

      // «тишина»/пауза — ставим idle-позу (но RAF не останавливаем)
      const paused = energy < 2; // подстрой под себя (1..5)
      if (paused) {
        setIdlePose();
        return;
      }

      // Немного баса/общей громкости для HALO
      const n = data.length;
      const bass = avgBand(data, 0, Math.floor(n * 0.08)); // ~0..200 Гц
      const rms = avgBand(data, 0, Math.floor(n * 0.75)); // общая громкость
      const peak = maxBand(data, 0, Math.floor(n * 0.06)); // удар на самых низах

      // короткий «импульс» на кике
      const prevPulse = pulseRef.current;
      const kickVal = peak > 170 ? 1 : peak > 140 ? 0.6 : 0;
      pulseRef.current = Math.max(prevPulse * 0.9, kickVal);

      const amplitudeFactor = lerp(1.05, 2.0 + pulseRef.current * 0.5, clamp((bass - 60) / 120, 0, 1));
      const size = lerp(1.10, 1.60 + pulseRef.current * 0.4, clamp((rms - 55) / 120, 0, 1));

      fx.setOptions?.({
        amplitudeFactor,
        size,
        color: 0xff4df5,
        color2: 0x00ffe0,
      });
    };

    rafRef.current = requestAnimationFrame(run);
  }

  function stopLoop() {
    runningRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pulseRef.current = 0;
  }

  /* -------- поведение на «паузе» -------- */
  function setIdlePose() {
    const fx = vantaRef.current;
    if (!fx) return;

    if (!idleBreath) {
      fx.setOptions?.({
        amplitudeFactor: 1.2,
        size: 1.2,
        color: 0xff4df5,
        color2: 0x00ffe0,
      });
      return;
    }

    // лёгкое дыхание
    const t = performance.now() * 0.001;
    const b = (Math.sin(t * 0.8) + 1) / 2;
    fx.setOptions?.({
      amplitudeFactor: lerp(1.15, 1.45, b),
      size: lerp(1.15, 1.35, b),
    });
  }

  /* -------- UI -------- */
  return (
    <div
      className=""
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: 20,
        // визуал как во 2-м варианте
        background: "linear-gradient(135deg, #ff7ac6 0%, #8a4dff 100%)",
      }}
    >
      {/* Слой HALO */}
      <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />

      {/* Контент поверх */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "white",
          textAlign: "center",
          padding: 16,
        }}
      >
        <button
          onClick={() => onStartMyWave?.()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            background: "rgba(0,0,0,0.3)",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.2)",
            fontSize: 18,
            fontWeight: 700,
            backdropFilter: "blur(6px)",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {player.isPlaying ? "⏸ Моя волна" : "▶ Моя волна"}
        </button>
        <p style={{ marginTop: 12, fontSize: 14, maxWidth: 420, opacity: 0.9 }}>
          Бесконечный поток треков, который подстраивается под вас
        </p>
      </div>
    </div>
  );
}
