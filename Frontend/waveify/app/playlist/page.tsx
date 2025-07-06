"use client"; // Убедитесь, что это указано в начале файла

import { useParams } from "next/navigation"; // Импортируем useParams
import useGetSongById from "@/hooks/useGetSongById"; // Импортируем хук для получения песни
import usePlayer from "@/hooks/usePlayer"; // Импортируем хук состояния плеера
import PlayButtonVisible from "@/component/PlayButtonVisible"; // Импортируем кнопку воспроизведения
import { Share2, Heart } from "lucide-react"; // Импортируем иконки
import Tooltip from "@/component/Tooltipe";
import toast from "react-hot-toast";
import { AiOutlineDislike } from "react-icons/ai";
import { LuPlus } from "react-icons/lu";
import { useAuth } from "@/providers/AuthProvider";
const PlaylistPage = () => {
  const params = useParams(); // Получаем параметры маршрута с помощью useParams
  const id =  Array.isArray(params.id) ? params.id[0] : params.id; // Извлекаем id из параметров

  // Получаем данные о песне
  const { song, isLoading, error } = useGetSongById(id);
  const { user } = useAuth();
  const player = usePlayer(); // Получаем состояние плеера

  const hasPremiumSubscription = user?.subscription;
  // Обработка состояния загрузки и ошибок
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!song) {
    return <div>Песня не найдена.</div>;
  }

  const handlePlay = () => {
    player.setId(song.id); // Устанавливаем активный трек
    player.play(); // Запускаем воспроизведение
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Ссылка скопирована!"); // Отображаем тост с сообщением
  };

  return (
    <div className="p-4
      bg-[var(--bgPage)]
      rounded-lg
      w-full h-full
      overflow-hidden
      overflow-y-auto">
      {/* Заголовок с изображением и информацией о песне */}
      <div className="relative bg-[var(--bg)] py-5 rounded-lg">
        <div className="container mx-auto px-4 flex flex-row justify-left items-center">
          {song.imagePath && (
            <img src={song.imagePath} alt={song.title} className="w-64 h-64  rounded-lg shadow-lg mr-4" />
          )}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-[var(--text)]">{song.title}</h1>
            <div>
              <span className="cursor-pointer hover:underline relative group text-[var(--text)]">{song.author}
                <Tooltip label={`Search: ${song.author}`} position="bottom" />
              </span>
              <span className="text-[var(--text)]"> • {song.createAt ? new Date(song.createAt).toLocaleDateString('en-En', { year: 'numeric', month: 'long', day: 'numeric' }) : ""}
              </span>
            </div>

            <span className="text-sm text-neutral-400 mt-6">Длительность: {song.duration}</span>
            <span className="text-neutral-500 hover:underline hover:text-white cursor-pointer transition ">
              Link Author
            </span>
          </div>
        </div>
      </div>


      {/* Кнопки управления */}
      <div className="container mx-auto px-4 py-6 flex items-center justify-left gap-4 bg-[var(--bg)] rounded-lg mt-2 pr-60">
        <PlayButtonVisible onClick={handlePlay} className="p-4 mt-1 transition" />
        <div className="flex justify-center ">
          <div className="flex flex-col items-center justify-center mt-5">
            <button className="bg text-neutral-400 cursor-pointer p-3  rounded-full hover:bg-rose-500 hover:text-white transition relative group">
              <Heart size={28} />
              <Tooltip label="Like" position="top" />
            </button>
            <span className="text-sm text-[var(--text)] ">{song.like}</span>
          </div>
          <div className="flex flex-col items-center justify-center mt-5">
            <button className="bg text-neutral-400 cursor-pointer p-3  rounded-full hover:bg-red-700 hover:text-white transition relative group">
              <AiOutlineDislike size={28} />
              <Tooltip label="Dislike" position="top" />
            </button>
            <span className="text-sm text-[var(--text)] ">{song.like}</span>
          </div>
        </div>

        <button className="bg text-neutral-400 cursor-pointer p-2 rounded-full hover:bg-neutral-600 hover:text-white  transition relative group">
          <LuPlus size={34} onClick={() => { }} />
          <Tooltip label="Add to Liked Songs" position="top" />
        </button>
        <button className="bg text-neutral-400 cursor-pointer p-3 rounded-full hover:bg-neutral-600 hover:text-white  transition relative group">
          <Share2 className="pr-1" size={28} onClick={() => handleShare()} />
          <Tooltip label="Copy URL Songs" position="top" />
        </button>
      </div>

      {/* Описание песни */}
      {/* <div className="container mx-auto px-4 py-6 bg-[var(--bg)] rounded-lg border border-neutral-800">
        <h2 className="text-xl font-bold text-[var(--text)]">Описание</h2>
        <p className="text-neutral-400">{song.description || "Описание отсутствует."}</p>
      </div> */}


      {/* About section */}
      <div className="container mx-auto bg-[var(--bg)]  rounded-lg border border-neutral-800 mt-6">
        <div className="p-4 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-[var(--text)]">About this song</h2>
        </div>

        <div className="p-4 ">
          {/* <p className="text-neutral-400">{song.description}</p> */}

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-300 mb-1">Release Date</h3>
              <p className="text-neutral-400 text-sm">{song.createAt}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-300 mb-1">Producer</h3>
              <p className="text-neutral-400 text-sm">{song.author}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Comment section */}
      <div className="container mx-auto bg-[var(--bg)] rounded-lg border border-neutral-800 mt-6">
        <div className="p-4">
          <h2 className="text-xl font-bold text-[var(--text)]">Comments</h2>
        </div>

        <div className="p-4">
          {/* Здесь можно добавить описание песни, если нужно */}
          {/* <p className="text-neutral-400">{song.description}</p> */}

          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Комментарии будут выводиться здесь */}
          </div>

          {/* Форма для добавления комментария */}
          {/* <div className="flex items-center mt-6 border-t border-neutral-800 pt-4">
          <div className={`text-[var(--text)] font-semibold mr-1 px-4 py-2 rounded-full transition p-4 ${
                hasPremiumSubscription
                  ? gradientMap[user?.subColor as GradientKey] // Приведение типа
                  : "bg-[var(--bgProfile)]" // Стандартный фон
              }`}>
              {user?.userName ? user.userName.charAt(0).toUpperCase() : "?"}
            </div>
            <input
              type="text"
              placeholder="Leave a comment..."
              className="flex-grow bg-transparent border border-neutral-600 rounded-lg p-3 text-[var(--text)] focus:outline-none focus:border-neutral-400"
            />
            <button className="bg-neutral-800/40 p-4 ml-1 text-rose-500 cursor-pointer rounded-full hover:bg-neutral-600 hover:text-white  transition relative group">
              <IoSend   size={20} onClick={() => handleShare()} />
              <Tooltip label="Send" position="top" />
            </button>
          </div> */}
        </div>
      </div>

    </div>
  );
};

export default PlaylistPage;
