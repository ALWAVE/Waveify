"use client";

import { Download as DownloadIcon, Music2, Star } from "lucide-react";
import Image from "next/image";
import ButtonLogin from "@/component/ButtonLogin";
import Header from "@/component/Header";

const Download = () => {
  return (
   
        <div className="bg-[var(--bgPage)] text-neutral-400 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
    {/* <Header className="bg-neutral-900">
                <></>
             </Header> */}
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Download Waveify
          </h1>
          <p className="text-xl text-white/90">
            Your Ultimate Music Companion
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Waveify Studio Card */}
          <div className="group hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="relative h-48 p-0">
              <Image
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
                alt="Waveify Studio"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="rounded-lg p-1 text-black absolute top-4 right-4 bg-gradient-to-r from-violet-200 to-pink-200">
                PREMIUM
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Music2 className="h-6 w-6 text-violet-500" />
                    Waveify Studio
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Experience premium offline music playback with advanced features and studio-quality sound.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">High-quality offline playback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Advanced audio controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">No ads, unlimited skips</span>
                  </div>
                </div>
                <ButtonLogin onClick={() => { window.location.href = "/premium"}} className="bg-white hover:bg-gradient-to-r from-violet-500 to-pink-500 hover:scale-105 w-full  hover:opacity-90 ">
                  Get Waveify Premium
                </ButtonLogin>
              </div>
            </div>
          </div>

          {/* Waveify Free Card */}
          <div className="group hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="relative h-48 p-0">
              <Image
                src="/Waveify.png"
                alt="Waveify"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Music2 className="h-6 w-6 text-pink-500" />
                Waveify
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Start your music journey with Waveify. Stream millions of tracks for free.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Free music streaming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Create playlists</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Discover new music</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Crazy Desktop App</span>
                  </div>
                </div>
                <ButtonLogin className="hover:scale-105 w-full bg-pink-500 hover:bg-pink-600 flex  justify-center">
                  <DownloadIcon className="mr-2" />
                    Download Free
                </ButtonLogin>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
        <p className="text-xl text-white font-medium max-w-3xl mx-auto">
            Выбирайте Waveify, чтобы насладиться непревзойденным звучанием музыки. Зачем соглашаться на меньшее, если можно получить все самое лучшее?
          </p>
          <p className="text-xl text-white font-medium max-w-3xl mx-auto">
            Choose Waveify for an unmatched music experience. Why settle for less when you can have the best?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Download;