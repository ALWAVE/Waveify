// hooks/useCoverPalette.ts
"use client";
import { useEffect, useMemo, useState } from "react";
import { FastAverageColor } from "fast-average-color";

function clamp01(v: number){ return Math.max(0, Math.min(1, v)); }
function hexToHsl(hex: string){
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h=0,s=0,l=(max+min)/2;
  if(max!==min){
    const d = max-min;
    s = l>0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h=(g-b)/d+(g<b?6:0); break;
      case g: h=(b-r)/d+2; break;
      case b: h=(r-g)/d+4; break;
    }
    h/=6;
  }
  return {h,s,l};
}
function hslToCss(h:number,s:number,l:number){ return `hsl(${Math.round(h*360)} ${Math.round(s*100)}% ${Math.round(l*100)}%)`; }

export default function useCoverPalette(imageUrl?: string) {
  const [base, setBase] = useState("#222222");

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      new FastAverageColor().getColorAsync(img, { mode: "speed" })
        .then(c => c.hex && setBase(c.hex))
        .catch(()=>{});
    };
  }, [imageUrl]);

  return useMemo(() => {
    const hsl = hexToHsl(base);
    // усиливаем насыщенность и немного поднимаем яркость
    const accent = hslToCss(hsl.h, clamp01(hsl.s*1.25), clamp01(hsl.l*0.9));
    const highlight = hslToCss(hsl.h, clamp01(0.7 + 0.3*hsl.s), clamp01(Math.min(0.85, hsl.l*1.2)));
    return { base, accent, highlight, hsl };
  }, [base]);
}
