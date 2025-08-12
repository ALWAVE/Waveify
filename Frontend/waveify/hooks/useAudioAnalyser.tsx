// hooks/useAudioAnalyser.ts
"use client";
import { useEffect, useRef, useState } from "react";
import { Howler } from "howler";

/**
 * Слушает звук из Howler (WebAudio):
 * 1) пробует masterGain (нормальный путь),
 * 2) если энергии нет — подцепляется к текущим Howl'ам (_sounds[i]._node).
 * Ничего не disconnect'ит в твоей аудио-цепочке.
 */
export function useAudioAnalyser() {
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);
  const tapNodesRef = useRef<Set<AudioNode>>(new Set()); // куда мы «вклинились»
  const retryTimerRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let resumeCleanup: (() => void) | null = null;

    const init = () => {
      const h = Howler as any;
      const ctx: AudioContext | undefined = h?.ctx;
      const usingWebAudio: boolean | undefined = h?.usingWebAudio;

      if (!usingWebAudio || !ctx) {
        // ждём первого звука
        retryTimerRef.current = window.setTimeout(init, 250) as unknown as number;
        return;
      }

      if (!analyserRef.current) {
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.82;
        analyserRef.current = analyser;
        dataRef.current = new Uint8Array(analyser.frequencyBinCount);
      }

      // авто-resume по жесту пользователя (iOS и др.)
      const resume = () => {
        if (ctx.state === "suspended") ctx.resume().catch(() => { });
      };
      ["click", "touchstart", "keydown"].forEach((ev) =>
        window.addEventListener(ev, resume as any, { passive: true })
      );
      resumeCleanup = () => {
        ["click", "touchstart", "keydown"].forEach((ev) =>
          window.removeEventListener(ev, resume as any)
        );
      };

      setReady(true);
    };

    init();

    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      // аккуратно снимаем все наши «ответвления»
      const h = Howler as any;
      const ctx: AudioContext | undefined = h?.ctx;
      if (ctx) {
        tapNodesRef.current.forEach((node) => {
          try {
            node.disconnect(analyserRef.current as AudioNode);
          } catch { }
        });
        tapNodesRef.current.clear();
      }
      analyserRef.current = null;
      dataRef.current = null;
      setReady(false);
      if (resumeCleanup) resumeCleanup();
    };
  }, []);

  /**
   * Подключиться к masterGain (если ещё не подключены).
   */
  function ensureMasterTap() {
    const h = Howler as any;
    const masterGain: GainNode | undefined = h?.masterGain;
    const analyser = analyserRef.current;
    if (!masterGain || !analyser) return;

    // уже подключали?
    if (tapNodesRef.current.has(masterGain)) return;

    try {
      masterGain.connect(analyser);
      tapNodesRef.current.add(masterGain);
    } catch {
      /* noop */
    }
  }

  /**
   * Если masterGain даёт «тишину», пробуем подцепиться к активным Howl.
   * Никаких disconnect — только дополнительное ответвление node -> analyser.
   */
  function ensureActiveHowlsTap() {
    const h = Howler as any;
    const howls: any[] = h?._howls || [];
    const analyser = analyserRef.current;
    if (!analyser || !howls.length) return;

    for (const howl of howls) {
      if (!howl.playing()) continue;
      // переберём его звуки
      const sounds = howl?._sounds || [];
      for (const s of sounds) {
        // в WebAudio это обычно GainNode (или Panner -> Gain)
        const node: AudioNode | null = s?._node || null;
        if (!node) continue;
        if (tapNodesRef.current.has(node)) continue;
        try {
          node.connect(analyser);
          tapNodesRef.current.add(node);
        } catch {
          /* noop */
        }
      }
    }
  }

  const getData = () => {
    const analyser = analyserRef.current;
    if (!analyser) return null; // проверка до использования

    // создаём Uint8Array с правильным буфером
    const d = new Uint8Array(analyser.frequencyBinCount);

    // гарантируем masterTap
    ensureMasterTap();

    // снять спектр
    analyser.getByteFrequencyData(d);

    // если «энергии» почти нет — fallback
    let energy = 0;
    for (let i = 0; i < d.length; i++) energy += d[i];
    energy /= Math.max(1, d.length);

    if (energy < 1.5) {
      ensureActiveHowlsTap();
      analyser.getByteFrequencyData(d);
    }

    return d;

  };

  return { ready, analyser: analyserRef.current, getData };
}

/* Утилиты */
export function avgBand(arr: Uint8Array, from: number, to: number) {
  let s = 0, c = 0;
  for (let i = from; i <= to && i < arr.length; i++) { s += arr[i]; c++; }
  return c ? s / c : 0;
}
export function maxBand(arr: Uint8Array, from: number, to: number) {
  let m = 0;
  for (let i = from; i <= to && i < arr.length; i++) m = Math.max(m, arr[i]);
  return m;
}
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
