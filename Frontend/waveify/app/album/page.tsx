"use client"
import React, { useState } from "react";

import { Music, Play, Clock, Download, Share2, Heart, Badge } from "lucide-react";
import PlayButton from "@/component/PlayButton";
import ButtonLogin from "@/component/ButtonLogin";
import PlayButtonVisible from "@/component/PlayButtonVisible";
import { ButtonIcon } from "@/component/ButtonIcon";
interface Track {
    id: number;
    title: string;
    duration: string;
    isPopular: boolean;
}

const Album = () => {
    const [isLiked, setIsLiked] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<number | null>(null);

    // Sample album data
    const albumData = {
        title: "Midnight Sessions",
        artist: "Producer X",
        releaseDate: "2023",
        image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
        description: "A collection of atmospheric beats with dark undertones and heavy bass. Perfect for modern rap and trap productions."
    };

    // Sample tracks data
    const tracks: Track[] = [
        { id: 1, title: "Night Vibes", duration: "2:34", isPopular: true },
        { id: 2, title: "Dark Paths", duration: "3:12", isPopular: false },
        { id: 3, title: "Urban Dreams", duration: "2:58", isPopular: true },
        { id: 4, title: "Midnight Run", duration: "3:45", isPopular: false },
        { id: 5, title: "City Lights", duration: "2:46", isPopular: true },
        { id: 6, title: "Slow Motion", duration: "3:22", isPopular: false },
        { id: 7, title: "Electric Flow", duration: "3:05", isPopular: false },
        { id: 8, title: "Neon Streets", duration: "2:59", isPopular: false },
    ];

    const handlePlayTrack = (trackId: number) => {
        setCurrentTrack(trackId === currentTrack ? null : trackId);
    };

    return (
        <div className="bg-[var(--bgPage)] text-white">
            {/* Album header with gradient */}
            <div className="relative bg-gradient-to-r from-black via-neutral-900 to-rose-950 py-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        {/* Album cover */}
                        <div className="w-64 h-64 shrink-0">
                            <img
                                src={albumData.image}
                                alt={albumData.title}
                                className="w-full h-full object-cover rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Album info */}
                        <div className="flex flex-col items-center md:items-start">
                            <Badge  className="mb-2">ALBUM</Badge>
                            <h1 className="text-4xl font-bold mb-2">{albumData.title}</h1>
                            <div className="flex items-center gap-2 text-neutral-400">
                                <img
                                    src={albumData.image}
                                    alt={albumData.artist}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <span>{albumData.artist} • {albumData.releaseDate} • {tracks.length} songs</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Album content */}
            <div className="container mx-auto px-4 py-6">
                {/* Action buttons */}
                <div className="flex items-center gap-4 mb-8">
                   
                    <PlayButtonVisible />
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className="text-neutral-400 hover:text-rose-500 transition"
                    >
                        <Heart
                            size={28}
                            fill={isLiked ? "#f43f5e" : "none"}
                            color={isLiked ? "#f43f5e" : "currentColor"}
                        />
                    </button>
                    <ButtonIcon  className="rounded-full border-neutral-700">
                        <Share2 size={20} className="text-neutral-400" />
                    </ButtonIcon>
                </div>

                {/* Track listing */}
                <div className="bg-neutral-900 rounded-lg border border-neutral-800">
                    <div className="p-4 border-b border-neutral-800">
                        <h2 className="text-xl font-bold">Tracks</h2>
                    </div>

                    <div className="p-4">
                        <table className="w-full">
                            <thead>
                                <tr className="text-neutral-400 text-left border-b border-neutral-800">
                                    <th className="pb-2 pl-2">#</th>
                                    <th className="pb-2">TITLE</th>
                                    <th className="pb-2 text-right pr-4"><Clock size={16} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tracks.map((track) => (
                                    <tr
                                        key={track.id}
                                        className={`hover:bg-neutral-800 group ${currentTrack === track.id ? 'bg-neutral-800' : ''}`}
                                        onClick={() => handlePlayTrack(track.id)}
                                    >
                                        <td className="py-3 pl-2 w-10">
                                            <div className="relative w-6 h-6 flex items-center justify-center">
                                                {currentTrack === track.id ? (
                                                    <Music size={16} className="text-rose-500 animate-pulse-light" />
                                                ) : (
                                                    <>
                                                        <span className="group-hover:opacity-0">{track.id}</span>
                                                        <Play size={16} className="absolute opacity-0 group-hover:opacity-100" />
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center">
                                                <div>
                                                    <p className={`font-medium ${currentTrack === track.id ? 'text-rose-500' : ''}`}>
                                                        {track.title}
                                                    </p>
                                                    {track.isPopular && (
                                                        <Badge className="text-[10px] bg-neutral-800 mt-1">
                                                        Popular
                                                      </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-right text-neutral-400 pr-4">
                                            {track.duration}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* About section */}
                <div className="bg-neutral-900 rounded-lg border border-neutral-800 mt-6">
                    <div className="p-4 border-b border-neutral-800">
                        <h2 className="text-xl font-bold">About this album</h2>
                    </div>

                    <div className="p-4">
                        <p className="text-neutral-400">{albumData.description}</p>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-neutral-300 mb-1">Release Date</h3>
                                <p className="text-neutral-400 text-sm">{albumData.releaseDate}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-neutral-300 mb-1">Producer</h3>
                                <p className="text-neutral-400 text-sm">{albumData.artist}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Album;