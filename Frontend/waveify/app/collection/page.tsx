"use client";
import Link from "next/link";
import { GrFavorite } from "react-icons/gr";
import { BsCollectionFill } from "react-icons/bs";
import { HiHeart } from "react-icons/hi2";
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

  return (
    <div className=" p-4 bg-[var(--bgPage)] rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <PageTitle title="Your collection"/>
      <div className="  grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        2xl:grid-cols-8 
        gap-4 
        mt-4 flex items-center m-2">
        {/* Favorite block */}
        <Link className="m-2" href={"/collection/favorite"}>
          <div
            className={`w-64 h-64 rounded-lg bg-gradient-to-r from-rose-500 to-pink-300 flex justify-center items-center ${
              favorites.includes("Favorite") ? "bg-rose-500" : ""
            }`}
          >
            <HiHeart className="text-white" size={50} />
          </div>
          <h1 className="text-[var(--text)]"  >Favorite</h1>
        </Link>
        <button
          onClick={() => handleToggle("Favorite", "Success Pin Your Favorite")}
          className={`cursor-pointer rounded-full w-10 h-10 flex items-center justify-center ${
            favorites.includes("Favorite") ? "bg-rose-500" : "bg-gray-300"
          }`}
        >
          {favorites.includes("Favorite") ? "Unpin" : "Pin"}
        </button>

        {/* Your Music block */}
        <Link className="m-2" href={"/collection/your-tracks"}>
          <div
            className={`w-64 h-64 rounded-lg bg-gradient-to-l from-indigo-500 to-cyan-500 flex justify-center items-center ${
              favorites.includes("Your Music") ? "bg-indigo-500" : ""
            }`}
          >
            <BsCollectionFill className="text-white" size={50} />
          </div>
          <h1 className="text-[var(--text)]" >Your Music</h1>
        </Link>
        <button
          onClick={() => handleToggle("Your Music", "Success Pin Your Music")}
          className={`cursor-pointer rounded-full w-10 h-10 flex items-center justify-center ${
            favorites.includes("Your Music") ? "bg-indigo-500" : "bg-gray-300"
          }`}
        >
          {favorites.includes("Your Music") ? "Unpin" : "Pin"}
        </button>
      </div>
    
    </div>
  );
};

export default Page;
