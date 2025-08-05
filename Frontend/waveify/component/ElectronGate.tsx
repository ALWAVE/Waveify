"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TitleBar from "@/component/TitleBar";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
});


export default function ElectronGate({
  onLoginClick,
}: {
  onLoginClick: () => void;
}) {
      <div className="absolute inset-0">
        <img
          src="/screensaver.png"
          alt="Waveify"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 pointer-events-none" />
      </div>
  const covers = [
    "/screensaver.png",
  ];
  const [cover, setCover] = useState(covers[0]);
  useEffect(() => {
    setCover(covers[Math.floor(Math.random() * covers.length)]);
  }, []);

  /* -------------------------------------------------- */
  /* ─── UI ──────────────────────────────────────────── */
  /* -------------------------------------------------- */
  return (
    <div className={`relative w-screen h-screen overflow-hidden ${montserrat.className}`}>
      {/* 📀 BACKDROP ───────────────────────────────────── */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 40, ease: "easeOut" }}
      >
        {/* Основное изображение */}
        <Image
          src={cover}
          alt="Waveify splash"
          fill
          priority
          className="object-cover select-none"
          sizes="100vw"
        />
        {/* Затемняющий градиент */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/80" />
        {/* Шум */}
        <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay [mask-image:url('/noise.png')]" />

        {/* 🆕 Плавающие цветовые облака */}
        <BlurBlobs />
      </motion.div>

      {/* 🪟 Заголовок для перетаскивания */}
      <div className="drag-region absolute top-0 left-0 w-full h-[56px] flex items-center justify-center gap-2 z-50 select-none">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-500 to-pink-600 text-3xl font-extrabold drop-shadow-[0_2px_12px_rgba(255,0,90,0.7)]">
          Waveify
        </span>
        <Image src="/Waveify_Logo.png" alt="Waveify Logo" width={28} height={28} className="select-none" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-500 to-pink-600 text-3xl font-extrabold drop-shadow-[0_2px_12px_rgba(255,0,90,0.7)]">
          Music
        </span>
      </div>

      {/* Системная панель */}
      <div className="absolute top-0 left-0 w-full z-50">
        <TitleBar />
      </div>

      {/* 🎟️ Карточка входа */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-30"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      >
        <div className="backdrop-blur-md bg-white/5 rounded-3xl px-12 py-14 shadow-[0_0_60px_rgba(0,0,0,0.45)] flex flex-col items-center gap-6 max-w-[500px]">
          <p className="text-white text-5xl font-extrabold text-center leading-tight drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
            Войдите в аккаунт<br />чтобы открыть приложение
          </p>
          <p className="text-gray-300 text-lg font-medium text-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            Waveify Music доступна по подписке Premium
          </p>
          <button
            onClick={onLoginClick}
            className="relative inline-flex items-center justify-center px-12 py-3 text-base font-semibold text-white rounded-full group focus:outline-none"
          >
            {/* Glowing border */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 opacity-70 blur-[6px] group-hover:blur-[9px] transition" />
            <span className="relative z-10">Войти</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   🔴🟣  Функциональный компонент с флуид‑облаками (CSS blur + Framer)
   ──────────────────────────────────────────────────────────────── */
function BlurBlobs() {
  return (
    <>
      <motion.span
        className="absolute -left-48 -top-32 w-[500px] h-[500px] bg-pink-600 rounded-full blur-3xl opacity-30 mix-blend-screen pointer-events-none"
        animate={{ x: -80, y: 40, scale: 1.1 }}
        transition={{ duration: 30, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.span
        className="absolute right-0 top-1/3 w-[600px] h-[600px] bg-fuchsia-500 rounded-full blur-3xl opacity-25 mix-blend-screen pointer-events-none"
        animate={{ x: 60, y: -60, scale: 0.9 }}
        transition={{ duration: 28, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.span
        className="absolute -bottom-48 left-1/4 w-[550px] h-[550px] bg-rose-700 rounded-full blur-3xl opacity-20 mix-blend-screen pointer-events-none"
        animate={{ x: 40, y: 80, scale: 1.05 }}
        transition={{ duration: 32, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
    </>
  );
}
