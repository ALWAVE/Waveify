"use client";

import { Download as DownloadIcon, Music2, Star, Monitor, Smartphone } from "lucide-react";
import Image from "next/image";
import ButtonLogin from "@/component/ButtonLogin";
import { GoArrowUpRight } from "react-icons/go";
import { RiAppleLine } from "react-icons/ri";
import { TbBrandWindows } from "react-icons/tb";
import { CiMobile1 } from "react-icons/ci";
const Download = () => {
  return (
    <div className="bg-[var(--bgPage)] text-neutral-400 rounded-lg w-full h-full flex flex-col items-center overflow-hidden overflow-y-auto py-12 px-4">
      {/* Hero */}
      <div className="max-w-4xl w-full mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-violet-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">
          Download Waveify
        </h1>
        <p className="text-xl md:text-2xl text-neutral-300 font-light mb-2">
          Your Ultimate Music Companion
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-10 w-full max-w-7xl mb-16">
        {/* Desktop Version */}
        <div className="group bg-[var(--text)]80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-violet-600/30 flex flex-col">
          <div className="relative h-48 w-full">
            <Image
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
              alt="Waveify Desktop"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-7 flex flex-col gap-5 flex-grow">
            <div className="flex items-center gap-3 text-lg font-semibold text-violet-400">
              <Monitor className="h-6 w-6" />
              Waveify Desktop
            </div>
            <p className="text-neutral-400 text-base flex-grow">
              Download Waveify for your desktop. Available for Windows and Mac.
            </p>
            <div className="flex gap-4 justify-center mt-auto">
              <ButtonLogin
                onClick={() => window.location.href = "/download/waveify-windows.exe"}
                className="bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:opacity-100 active:scale-105 font-bold py-2 px-6 rounded-lg hover:scale-97 transition-transform duration-200 shadow-md flex items-center gap-2"
              >
                <TbBrandWindows className="w-5 h-5" />
                Windows
              </ButtonLogin>
              <ButtonLogin
                onClick={() => window.location.href = "/download/waveify-mac.dmg"}
                className="bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-100 active:scale-105 font-bold py-2 px-6 rounded-lg hover:scale-97 transition-transform duration-200 shadow-md flex items-center gap-2"
              >
                <RiAppleLine className="w-5 h-5" />
                Mac
              </ButtonLogin>
            </div>
          </div>
        </div>

        {/* Mobile Version */}
        <div className="group bg-[var(--text)]80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-pink-600/30 flex flex-col">
          <div className="relative h-48 w-full">
            <Image
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"
              alt="Waveify Mobile"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-7 flex flex-col gap-5 flex-grow">
            <div className="flex items-center gap-3 text-lg font-semibold text-pink-400">
              <Smartphone className="h-6 w-6" />
              Waveify Mobile
            </div>
            <p className="text-neutral-400 text-base flex-grow">
              Install Waveify on your mobile device. Available for iOS and Android.
            </p>
            <ButtonLogin
              onClick={() => window.location.href = "/download/waveify-mobile.apk"}
              className="bg-pink-500 text-white font-bold py-2 rounded-lg flex justify-center items-center hover:bg-pink-600 hover:scale-105 transition-transform duration-200 shadow-md mt-auto"
            >
              <DownloadIcon className="mr-2" />
              Install Mobile App
            </ButtonLogin>
          </div>
        </div>

        {/* Waveify Studio (Premium) */}
        <div className="group bg-[var(--text)]80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-rose-500/30 flex flex-col">
          <div className="relative h-48 w-full">
            <Image
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
              alt="Waveify Studio"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-pink-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-md">
              PREMIUM
            </div>
          </div>
          <div className="p-7 flex flex-col gap-5 flex-grow">
            <div className="flex items-center gap-3 text-lg font-semibold text-rose-500">
              <Music2 className="h-6 w-6" />
              Waveify Studio
            </div>
            <p className="text-neutral-400 text-base flex-grow">
              Premium offline music playback with advanced features. Available for Windows and Mac.
            </p>
            <div className="flex gap-4 justify-center mt-auto">
              {/* <ButtonLogin
                onClick={() => window.location.href = "/download/studio-windows.exe"}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-black font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform duration-200 shadow-md flex items-center gap-2"
              >
                <DownloadIcon className="w-5 h-5" />
                Windows
              </ButtonLogin>
              <ButtonLogin
                onClick={() => window.location.href = "/download/studio-mac.dmg"}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-black font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform duration-200 shadow-md flex items-center gap-2"
              >
                <DownloadIcon className="w-5 h-5" />
                Mac
              </ButtonLogin> */}
              <ButtonLogin
                onClick={() => window.location.href = "/download/studio-mac.dmg"}
                className="bg-gradient-to-r from-pink-300 to-rose-300 text-black font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform duration-200 shadow-md flex items-center gap-2"
              >
                <GoArrowUpRight  className="w-5 h-5" />
                Purchase Waveify Premium
              </ButtonLogin>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-2xl font-semibold text-[var(--text)]/80 mb-2">
          Выбирайте Waveify, чтобы насладиться непревзойденным звучанием музыки.
        </p>
        <p className="text-lg text-neutral-300">
          Зачем соглашаться на меньшее, если можно получить всё самое лучшее?
        </p>
      </div>
    </div>
  );
};

export default Download;
