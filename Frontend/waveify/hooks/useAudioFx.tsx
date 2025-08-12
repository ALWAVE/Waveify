// hooks/useAudioFx.ts
"use client";
import { useEffect, useRef, useState } from "react";
import { Howler } from "howler";

export default function useAudioFx() {
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // точные полки/уровни
  const [lowShelfFreq, setLowShelfFreq] = useState(100);
  const [lowShelfDb,   setLowShelfDb]   = useState(0);
  const [highShelfFreq, setHighShelfFreq] = useState(10000);
  const [highShelfDb,   setHighShelfDb]   = useState(6);
  const [presenceDb, setPresenceDb] = useState(0);

  // сатурация и защита
  const [drive, setDrive] = useState(0.02);
  const [headroomDb, setHeadroomDb] = useState(10); // −10 dB перед FX
  const [ceilingDb, setCeilingDb] = useState(-1);   // лимитер потолок
  const [lookaheadMs, setLookaheadMs] = useState(4);

  // суммирование
  const [wet, setWet] = useState(1);
  const [makeup, setMakeup] = useState(-6); // НЕ громче оригинала

  // узлы
  const ctxRef = useRef<AudioContext | null>(null);
  const patchedRef = useRef(false);
  const preRef = useRef<GainNode | null>(null);
  const compRef = useRef<DynamicsCompressorNode | null>(null);
  const satRef  = useRef<WaveShaperNode | null>(null);
  const lowRef  = useRef<BiquadFilterNode | null>(null);
  const midRef  = useRef<BiquadFilterNode | null>(null);
  const highRef = useRef<BiquadFilterNode | null>(null);
  const delayRef = useRef<DelayNode | null>(null);
  const limRef   = useRef<DynamicsCompressorNode | null>(null);
  const postRef  = useRef<GainNode | null>(null);

  const dbToGain = (db: number) => Math.pow(10, db / 20);
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  const updateWS = (node: WaveShaperNode, drv: number) => {
    const k = clamp(drv, 0, 0.6) * 100;
    const N = 1024, c = new Float32Array(N);
    for (let i = 0; i < N; i++) { const x = (i/(N-1))*2-1; c[i] = Math.atan(x*k)/Math.atan(k||1); }
    node.curve = c; node.oversample = "2x";
  };

  // init: просто ждём WebAudio, НИЧЕГО не подключаем
  useEffect(() => {
    const h: any = Howler;
    if (!h?.usingWebAudio || !h?.ctx || !h?.masterGain) return;
    ctxRef.current = h.ctx;
    setReady(true);
    const resume = () => { if (h.ctx.state === "suspended") h.ctx.resume().catch(()=>{}); };
    window.addEventListener("click", resume, { passive:true });
    window.addEventListener("touchstart", resume, { passive:true });
    window.addEventListener("keydown", resume, { passive:true });
    return () => {
      window.removeEventListener("click", resume as any);
      window.removeEventListener("touchstart", resume as any);
      window.removeEventListener("keydown", resume as any);
      // если были патчи — вернём прямой тракт
      if (patchedRef.current) restoreChain();
      ctxRef.current = null;
      setReady(false);
    };
  }, []);

  // включение/выключение патча
  useEffect(() => {
    if (!ready) return;
    if (enabled && !patchedRef.current) patchChain();
    if (!enabled && patchedRef.current) restoreChain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ready]);

  // live-апдейт параметров только когда FX включён
  useEffect(() => { if (patchedRef.current) applyParams(); }, [
    lowShelfFreq, lowShelfDb, highShelfFreq, highShelfDb,
    presenceDb, drive, headroomDb, ceilingDb, lookaheadMs, makeup, wet
  ]);

  function patchChain() {
    const h: any = Howler;
    const ctx: AudioContext | undefined = h?.ctx;
    const mg: GainNode | undefined = h?.masterGain;
    if (!ctx || !mg) return;

    // создаём узлы при первом включении
    if (!preRef.current) {
      preRef.current = ctx.createGain();
      compRef.current = ctx.createDynamicsCompressor();
      compRef.current.threshold.value = -20;
      compRef.current.knee.value = 20;
      compRef.current.ratio.value = 3;
      compRef.current.attack.value = 0.005;
      compRef.current.release.value = 0.15;

      satRef.current  = ctx.createWaveShaper();
      lowRef.current  = ctx.createBiquadFilter();
      midRef.current  = ctx.createBiquadFilter();
      highRef.current = ctx.createBiquadFilter();
      delayRef.current = ctx.createDelay(0.1);
      limRef.current   = ctx.createDynamicsCompressor();
      postRef.current  = ctx.createGain();
    }

    try {
      // полностью убираем все старые выходы masterGain
      try { mg.disconnect(); } catch {}

      // master → pre(-headroom) → comp → sat → low → mid → high → delay → limiter → post → destination
      mg.connect(preRef.current!);
      preRef.current!.gain.value = dbToGain(-Math.abs(headroomDb));
      preRef.current!.connect(compRef.current!);
      compRef.current!.connect(satRef.current!);
      satRef.current!.connect(lowRef.current!);
      lowRef.current!.connect(midRef.current!);
      midRef.current!.connect(highRef.current!);
      highRef.current!.connect(delayRef.current!);
      delayRef.current!.connect(limRef.current!);
      limRef.current!.connect(postRef.current!);
      postRef.current!.connect(ctx.destination);

      applyParams();

      // мягкий fade-in выхода FX
      const now = ctx.currentTime;
      const target = dbToGain(makeup) * clamp(wet,0,1);
      postRef.current!.gain.cancelScheduledValues(now);
      postRef.current!.gain.setValueAtTime(0, now);
      postRef.current!.gain.linearRampToValueAtTime(target, now + 0.02);

      patchedRef.current = true;
    } catch (e) {
      console.warn("[useAudioFx] patch error:", e);
    }
  }

  function restoreChain() {
    const h: any = Howler;
    const ctx: AudioContext | undefined = h?.ctx;
    const mg: GainNode | undefined = h?.masterGain;
    if (!ctx || !mg) return;
    try {
      // отцепляем FX и возвращаем master → destination
      try { postRef.current?.disconnect(); } catch {}
      try { limRef.current?.disconnect(); } catch {}
      try { delayRef.current?.disconnect(); } catch {}
      try { highRef.current?.disconnect(); } catch {}
      try { midRef.current?.disconnect(); } catch {}
      try { lowRef.current?.disconnect(); } catch {}
      try { satRef.current?.disconnect(); } catch {}
      try { compRef.current?.disconnect(); } catch {}
      try { preRef.current?.disconnect(); } catch {}
      try { mg.disconnect(); } catch {}
      mg.connect(ctx.destination);
      patchedRef.current = false;
    } catch (e) {
      console.warn("[useAudioFx] restore error:", e);
    }
  }

  function applyParams() {
    const ctx = ctxRef.current; if (!ctx) return;

    if (preRef.current) preRef.current.gain.value = dbToGain(-Math.abs(headroomDb));

    if (lowRef.current)  { lowRef.current.type="lowshelf";  lowRef.current.frequency.value = clamp(lowShelfFreq,20,300);    lowRef.current.gain.value = clamp(lowShelfDb,-12,12); }
    if (midRef.current)  { midRef.current.type="peaking";   midRef.current.frequency.value = 3000; midRef.current.Q.value=0.9; midRef.current.gain.value = clamp(presenceDb,-6,6); }
    if (highRef.current) { highRef.current.type="highshelf";highRef.current.frequency.value= clamp(highShelfFreq,4000,18000); highRef.current.gain.value = clamp(highShelfDb,-12,12); }

    if (satRef.current)  updateWS(satRef.current, drive);

    if (delayRef.current) delayRef.current.delayTime.value = clamp(lookaheadMs,0,10)/1000;

    if (limRef.current) {
      limRef.current.threshold.value = clamp(ceilingDb,-12,-0.1);
      limRef.current.knee.value = 0;
      limRef.current.ratio.value = 20;
      limRef.current.attack.value = 0.002;
      limRef.current.release.value = 0.12;
    }

    if (postRef.current) {
      const now = ctx.currentTime;
      const target = dbToGain(makeup) * clamp(wet,0,1);
      postRef.current.gain.cancelScheduledValues(now);
      postRef.current.gain.setValueAtTime(postRef.current.gain.value, now);
      postRef.current.gain.linearRampToValueAtTime(target, now + 0.02);
    }
  }

  return {
    ready,
    enabled, setEnabled,
    // EQ
    lowShelfFreq, setLowShelfFreq,
    lowShelfDb, setLowShelfDb,
    highShelfFreq, setHighShelfFreq,
    highShelfDb, setHighShelfDb,
    presenceDb, setPresenceDb,
    // сатурация/защита
    drive, setDrive,
    headroomDb, setHeadroomDb,
    ceilingDb, setCeilingDb,
    lookaheadMs, setLookaheadMs,
    // суммирование
    wet, setWet,
    makeup, setMakeup,
  };
}
