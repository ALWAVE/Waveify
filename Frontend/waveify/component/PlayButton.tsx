import { FaPlay, FaPause } from "react-icons/fa";

interface PlayButtonProps {
  isPlaying?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  isPlaying = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        transition 
        opacity-0 
        rounded-full 
        flex 
        items-center 
        justify-center 
        bg-rose-500 
        p-4 
        drop-shadow-md 
        translate
        translate-y-1/4
        group-hover:opacity-100 
        group-hover:translate-y-0
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

export default PlayButton;
