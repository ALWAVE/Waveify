"use client"

import { useState } from "react"

import { HiOutlineDownload } from "react-icons/hi";
import ButtonLogin from "./ButtonLogin"
import { LiaShoppingBagSolid } from "react-icons/lia";
import SongRating from "./SongRating";
import { Song } from "@/models/Song";
interface BeatItemProps {
  data?: Song

  onClick?: (id: string) => void
}

const BeatItem: React.FC<BeatItemProps> = ({ data, onClick }) => {
  const [showDownloadButton, setShowDownloadButton] = useState(false);


  return (
    <div
      // onClick={() => onClick(data.id)}
      className="
        relative 
        group 
        flex 
        flex-col 
        items-center 
        justify-center 
        rounded-md 
        overflow-hidden 
        bg-neutral-400/5 
        cursor-pointer 
        hover:bg-neutral-400/10 
        transition 
        p-3
      ">

      {/* Обложка */}
      <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
        {/* <Image src={data.image_path || "/images/music-placeholder.png"} fill alt="Beat Image" /> */}
      </div>

      {/* Информация о бите */}
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold text-[var(--text)] truncate w-full">Title</p>
        <p className="text-neutral-400 text-sm pb-2 w-full truncate">By Author</p>
      </div>

      {/* Кнопка воспроизведения */}
      <div className="absolute bottom-24 right-5">
        {/* <PlayButton /> */}
      </div>
      <div
        className="
          absolute 
          top-0 
         
        ">
        <SongRating />
      </div>
      {/* Цена + Скачать (горизонтально) */}
      <div className="flex justify-between items-center w-full">
        {/* Цена */}
        <ButtonLogin className="flex justify-center items-center mr-2 
        bg-transparent hover:bg-rose-800  hover:scale-100 hover:opacity-100 
        rounded-lg text-sm text-[var(--text)]  hover:text-white ring ring-rose-500">
          <LiaShoppingBagSolid size={17} className="mr-2" />
          $22
        </ButtonLogin>

        {/* Кнопка скачать (если есть ссылка) */}
        {showDownloadButton && (
          <ButtonLogin
            className="w-16 h-10 flex justify-center items-center 
            bg-transparent hover:scale-100 hover:bg-neutral-700 
            hover:opacity-100 rounded-lg text-[var(--text)] 
            ring ring-neutral-700 hover:text-white"
          >
            <HiOutlineDownload size={18} />
          </ButtonLogin>
        )}
      </div>
    </div>
  )
}

export default BeatItem
