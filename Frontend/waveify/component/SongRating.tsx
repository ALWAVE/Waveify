
import { FaRegHeart } from "react-icons/fa";
import SongLikeButton from "./SongLikeButton";
const SongRating = () => {
  return (
    <div
      className="
        transition 
        opacity-0 
       
        flex 
        items-center 
        justify-center 
        bg-transparent
        p-4 
        drop-shadow-md 
        translate
        translate-y-1/4
        group-hover:opacity-100 
        group-hover:translate-y-0
      
      ">

      {/* <button
        className="
        transition 
        opacity-0 
        rounded-full 
        flex 
        items-center 
        justify-center 
        bg-black/20
        hover:bg-black/60
        p-3
        drop-shadow-md 
        translate
        translate-y-1/4
        group-hover:opacity-100 
        group-hover:translate-y-0
        hover:scale-110
        cursor-pointer
      ">
        <FaRegHeart className="text-white" />
      </button> */}
      {/* <SongLikeButton/> */}
    </div>
  )
}

export default SongRating;
