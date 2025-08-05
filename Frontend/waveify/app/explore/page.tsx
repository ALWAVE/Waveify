"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Song } from "@/models/Song";
import PageContent from "../(site)/PageContent";
import SearchInput from "@/component/SearchInput";

const genres = [
    "Trap", "Hip-Hop", "Rap", "Rnb", "Opium", "Memphis", "Dark", "Pop", "Rock", "Ambient",
    "Drill", "Jazz", "Funk", "Lo-fi"
];

const ALL_VIBES = ["Joyfully", "Energetic", "Quietly", "Sad"];

const ExplorePage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const query = searchParams.get("query") || "";
    const genreParam = searchParams.get("genre") || "";
    const vibeParam = searchParams.get("vibe") || "";

    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setLoading(true);
                const url = new URL("http://77.94.203.78:5000/Song/search");
                if (query) url.searchParams.append("Query", query);
                if (genreParam) url.searchParams.append("Genre", genreParam);
                if (vibeParam) url.searchParams.append("Vibe", vibeParam);

                const res = await fetch(url.toString());
                const data = await res.json();
                setSongs(data);
            } catch (err) {
                console.error("Ошибка загрузки песен:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [query, genreParam, vibeParam]);

    const updateQueryParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (params.get(key) === value) {
            params.delete(key); // Убираем фильтр, если повторно кликнули
        } else {
            params.set(key, value);
        }

        router.push(`/explore?${params.toString()}`);
    };

    return (
        <div className="px-6 py-8 text-white bg-[var(--bgPage)] h-full rounded-lg">

           
            <SearchInput className="md:hidden mb-4"/>
                  
            
            

            <h1 className="text-3xl font-bold mb-6 text-[var(--text)]">
                Search Results{query && <span className="text-rose-500">: "{query}"</span>}
            </h1>



            <h1 className="text-sm font-black text-[var(--text)] pb-2 ">
                Vibe
            </h1>

            {/* Вайбы */}
            <div className="flex flex-wrap gap-2 mb-4">
                {ALL_VIBES.map((vibe) => (
                    <button
                        key={vibe}
                        onClick={() => updateQueryParam("vibe", vibe)}
                        className={`px-4 py-2 rounded-full text-sm ring-1 ring-gray-500 hover:scale-105 transition ${vibeParam === vibe ? "bg-rose-500 text-white" : "bg-transparent text-gray-400"
                            }`}
                    >
                        {vibe}
                    </button>
                ))}
            </div>
            <h1 className="text-sm font-black text-[var(--text)] pb-2 ">
                Genre
            </h1>
            {/* Жанры */}
            <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((g) => (
                    <button
                        key={g}
                        onClick={() => updateQueryParam("genre", g)}
                        className={`px-4 py-2 rounded-full text-sm ring-1 ring-gray-500 hover:scale-105 transition ${genreParam === g ? "bg-rose-500 text-white" : "bg-transparent text-gray-400"
                            }`}
                    >
                        {g}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-neutral-400">Загрузка...</p>
            ) : songs.length === 0 ? (
                <p className="text-neutral-400 ">Ничего не найдено по вашему запросу.</p>
            ) : (
                
                <PageContent songs={songs} />
            )}
        </div>
    );
};

export default ExplorePage;
