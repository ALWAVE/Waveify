"use client";
import Link from "next/link";
import { BsCollectionFill } from "react-icons/bs";
import { HiHeart } from "react-icons/hi2";
import { MdLibraryMusic } from "react-icons/md"; // иконка для плейлистов
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useFavorites } from "@/hooks/useFavorites";
import PageTitle from "@/component/PageTitle";

const Page = () => {
  const { favorites, toggleFavorite, loadFavorites } = useFavorites();

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleToggle = (label: string, message: string) => {
    toggleFavorite(label);
    toast.success(message);
  };

  const cards = [
    {
      label: "Favorite",
      href: "/collection/favorite",
      icon: <HiHeart size={60} />,
      gradient: "from-rose-500 to-pink-400",
    },
    {
      label: "Your Music",
      href: "/collection/your-tracks",
      icon: <BsCollectionFill size={60} />,
      gradient: "from-indigo-500 to-cyan-400",
    },
    {
      label: "Playlists",
      href: "/collection/my-playlists",
      icon: <MdLibraryMusic size={60} />,
      gradient: "from-green-500 to-lime-400",
    },
  ];

  return (
    <div className="p-6 bg-[var(--bgPage)] rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <PageTitle title="Коллекция" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6 mt-6">
        {cards.map((card) => {
          const isPinned = favorites.includes(card.label);
          return (
            <div key={card.label} className="group relative">
              <Link href={card.href} className="block">
                <div
                  className={`relative w-full aspect-square rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-105`}
                >
                  {card.icon}
                  {isPinned && (
                    <div className="absolute top-3 right-3 bg-black/50 text-xs px-2 py-1 rounded-full">
                      Закреплено
                    </div>
                  )}
                </div>
                <h2 className="mt-3 text-lg font-semibold text-[var(--text)] truncate">
                  {card.label === "Favorite"
                    ? "Мне нравится"
                    : card.label === "Your Music"
                    ? "Моя музыка"
                    : "Мои плейлисты"}
                </h2>
                <p className="text-sm text-gray-400">
                  {card.label === "Favorite"
                    ? "Треки, которые вам нравятся"
                    : card.label === "Your Music"
                    ? "Ваша библиотека треков"
                    : "Сохранённые плейлисты"}
                </p>
              </Link>
              <button
                onClick={() =>
                  handleToggle(
                    card.label,
                    isPinned
                      ? "Удалено из закрепленных"
                      : "Закреплено в коллекции"
                  )
                }
                className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-sm transition ${
                  isPinned
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-black/50 text-white hover:bg-black/70"
                }`}
              >
                {isPinned ? "−" : "+"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
