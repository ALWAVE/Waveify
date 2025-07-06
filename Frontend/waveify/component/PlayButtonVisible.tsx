import { FaPlay, FaPause } from "react-icons/fa";

interface PlayButtonVisibleProps {
  isPlaying?: boolean;
  onClick?: () => void;
  className?: string;
}

const PlayButtonVisible: React.FC<PlayButtonVisibleProps> = ({
  isPlaying = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        transition 
        rounded-full 
        flex 
        items-center 
        justify-center 
        bg-rose-500 
        p-4 
        drop-shadow-md 
        hover:scale-110
        cursor-pointer
        ${className ?? ""}
      `}
    >
       {isPlaying ? (
        <FaPause className="text-black" />
      ) : (
        <FaPlay className="text-black" />
      )}
    </button>
  );
};

export default PlayButtonVisible;
