"use client";

import ButtonLogin from "@/component/ButtonLogin";
import DropdownButton from "@/component/DropDownButton";
import Input from "@/component/Input";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { HiOutlineDownload } from "react-icons/hi";
import { useYouTubeDownload } from "@/hooks/useYouTubeDownload";
import PageTitle from "@/component/PageTitle";

const YouTubeDownloadPage = () => {
    const { user } = useAuth();
    const { isLoading, error, downloadAudio } = useYouTubeDownload();

    const [url, setUrl] = useState("");
    const [format, setFormat] = useState<"mp3" | "wav">("mp3");

    const handleDownload = async () => {
        if (!url.trim()) {
            alert("Please enter a valid YouTube URL");
            return;
        }
        if (format === "wav" && !user?.isPremium) {
            alert("WAV format доступен только для премиум-пользователей");
            return;
        }

        await downloadAudio({ url, format, isPremiumUser: !!user?.isPremium });
    };

    return (
        <div className="p-4 bg-[var(--bgPage)] text-[var(--text)] rounded-lg w-full h-full overflow-hidden overflow-y-auto">
            {/* <PageTitle title="YouTube Download" /> */}
            <div className="mb-2 flex flex-col gap-y-6 max-w-4xl mx-auto">

                <div className="flex pt-10 justify-center items-center">
                    <h1 className="mb-4 text-[var(--text)] text-5xl font-semibold text-center">
                        Waveify YouTube -
                    </h1>
                    <h1 className="ml-2 mb-4 text-rose-500 text-6xl font-black text-center">
                        MP3
                    </h1>
                </div>
                <h1 className="text-[var(--text)] opacity-80 text-base  text-center">
                    Конвертируйте видео с YouTube в MP3 вместе с Waveify. Скачать YouTube Audio на 100% бесплатно
                </h1>
                <div className="flex w-full justify-center items-center gap-2">

                    <Input
                        id="url_youtube"
                        disabled={isLoading}
                        placeholder="Enter YouTube URL"
                        className=" flex-1  bg-[var(--transparent)] text-xl min-w-0 rounded-full ring-2 active:ring-rose-500 ring-neutral-500"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    <div className="relative flex-shrink-0 w-26 ">
                        <DropdownButton
                            options={[
                                { label: "MP3", value: "mp3" },
                                { label: "WAV", value: "wav"},
                            ]}
                            value={format}
                            premiumUser={!!user?.isPremium}
                            onChange={(e) => setFormat(e.target.value as "mp3" | "wav")}
                            className="px-6 py-4 text-base"
                        />
                    </div>

                    <ButtonLogin
                        disabled={isLoading}
                        onClick={handleDownload}
                        className="w-14 h-14 flex justify-center items-center  bg-transparent hover:scale-110 active:scale-90 hover:bg-rose-500 hover:opacity-100 text-neutral-400 hover:text-white ring ring-neutral-700 hover:text-2xl "
                    >
                        {isLoading ? (
                            <span>Loading...</span>
                        ) : (
                            <HiOutlineDownload size={18} />
                        )}
                    </ButtonLogin>
                </div>
            </div>

            {/* <h1 className="p-6 mb-4  text-3xl font-semibold text-center">
                New Function
            </h1>

            <div className="flex w-full items-center gap-2">
                <p className="p-6 mb-4  bg-gradient-to-r from-red-200 to-yellow-200 bg-clip-text text-transparent  text-3xl font-semibold text-center">
                    Use full function with Waveify
                </p>
                <h1 className="p-6 mb-4 text-neutral-600 text-base font-semibold text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex hic nostrum sit ab corporis, beatae, ratione magnam sunt laudantium reiciendis fugit. Sequi dolore alias perspiciatis ad qui unde necessitatibus distinctio!
                </h1>
            </div>
            <div className="flex w-full items-center gap-2">

                <h1 className="p-6 mb-4 text-neutral-600 text-base font-semibold text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex hic nostrum sit ab corporis, beatae, ratione magnam sunt laudantium reiciendis fugit. Sequi dolore alias perspiciatis ad qui unde necessitatibus distinctio!
                </h1>
                <p className="p-6 mb-4 bg-gradient-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent text-3xl font-semibold text-center">
                    Connect Waveify Premium
                </p>
 */}


            {error && (
                <p className="text-red-500 font-semibold text-center mt-4">{error}</p>
            )}

            {/* Остальной контент страницы */}
        </div>

    );
};

export default YouTubeDownloadPage;
