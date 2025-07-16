import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BiSearch, BiChevronDown } from "react-icons/bi";
import { AiOutlineClose, AiOutlineFileImage } from "react-icons/ai";
import useSongs from "@/hooks/useSongs";
import { Song } from "@/models/Song";
import Tooltip from "./Tooltipe";

// --- Настройки фильтров ---
const filterOptions = [
  { label: "All", value: "all" },
  { label: "Track", value: "track" },
  { label: "Beat", value: "beat" },
  { label: "Joyfully", value: "joyfully" },
  { label: "Energetic", value: "energetic" },
  { label: "Quietly", value: "quietly" },
  { label: "Sad", value: "sad" },
] as const;

type FilterType = typeof filterOptions[number]["value"];

type SearchHistoryItem =
  | { type: "song"; id: string; title: string; author?: string; imagePath?: string }
  | { type: "text"; query: string };

function getSongText(song: Song): string {
  return [
    song.title,
    song.author,
    song.description,
    song.type,
    song.vibe,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

interface SearchInputProps {
  className?: string;
  inputClassName?: string;
  style?: React.CSSProperties;
}

const SearchInput: React.FC<SearchInputProps> = ({
  className = "",
  inputClassName = "",
  style,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const { songs, refresh, isLoading } = useSongs([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refresh();
  }, []);

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("searchHistory") || "[]");
    }
    return [];
  });

  useEffect(() => {
    if (!searchValue) return;
    const timeout = setTimeout(() => {
      setSearchHistory((prev) => {
        if (prev.some(item => item.type === "text" && item.query === searchValue)) return prev;
        const arr = [
          { type: "text", query: searchValue } as SearchHistoryItem,
          ...prev.filter(item => !(item.type === "text" && item.query === searchValue))
        ];
        localStorage.setItem("searchHistory", JSON.stringify(arr.slice(0, 7)));
        return arr.slice(0, 7);
      });
    }, 1500);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  const filterSong = (song: Song): boolean => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "track" || selectedFilter === "beat") {
      return (song.type || "").toLowerCase() === selectedFilter;
    }
    return (song.vibe || "").toLowerCase() === selectedFilter;
  };

  const suggestions =
    searchValue.length > 0
      ? songs
          .filter((song) => filterSong(song) && getSongText(song).includes(searchValue.toLowerCase()))
          .slice(0, 8)
      : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        (!filterRef.current || !filterRef.current.contains(event.target as Node))
      ) {
        setShowDropdown(false);
        setIsFocused(false);
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setShowDropdown(isFocused || !!searchValue);
  }, [isFocused, searchValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!searchValue.trim()) return;
      router.push(`/explore?query=${encodeURIComponent(searchValue.trim())}&filter=${selectedFilter}`);
      inputRef.current?.blur();
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (song: Song) => {
    setSearchValue(song.title);
    saveSongToHistory(song);
    setShowDropdown(false);
    setIsFocused(false);
    inputRef.current?.blur();
    router.push(`/song/${song.id}`);
  };

  const saveSongToHistory = (song: Song) => {
    setSearchHistory((prev) => {
      if (prev.some(item => item.type === "song" && item.id === song.id)) return prev;
      const arr = [
        {
          type: "song",
          id: song.id,
          title: song.title,
          author: song.author,
          imagePath: song.imagePath,
        } as SearchHistoryItem,
        ...prev.filter(item => !(item.type === "song" && item.id === song.id)),
      ];
      localStorage.setItem("searchHistory", JSON.stringify(arr.slice(0, 7)));
      return arr.slice(0, 7);
    });
  };

  const handleHistoryClick = (item: SearchHistoryItem) => {
    setShowDropdown(false);
    setIsFocused(false);
    inputRef.current?.blur();
    if (item.type === "song") {
      setSearchValue(item.title);
      router.push(`/song/${item.id}`);
    } else {
      setSearchValue(item.query);
      router.push(`/explore?query=${encodeURIComponent(item.query)}&filter=${selectedFilter}`);
    }
  };
  const handleSearch = () => {
    if (!searchValue.trim()) return;
    router.push(`/explore?query=${encodeURIComponent(searchValue.trim())}&filter=${selectedFilter}`);
    inputRef.current?.blur();
    setShowDropdown(false);
    setIsFocused(false);
  };
  const removeHistoryItem = (item: SearchHistoryItem) => {
    setSearchHistory((prev) => {
      let arr: SearchHistoryItem[];
      if (item.type === "song") {
        arr = prev.filter((h) => !(h.type === "song" && h.id === item.id));
      } else {
        arr = prev.filter((h) => !(h.type === "text" && h.query === item.query));
      }
      localStorage.setItem("searchHistory", JSON.stringify(arr));
      return arr;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const imageStyle =
    "w-10 h-10 object-cover rounded-lg bg-neutral-800 border border-white/10 flex-shrink-0";

  return (
    <div
      className={`no-drag relative w-full max-w-xl mx-auto ${className}`}
      style={style}
      ref={wrapperRef}
    >
      {/* SEARCH BAR */}
      <div
        className={`no-drag flex items-center bg-neutral-900/90 rounded-full px-5 py-2 shadow-xl ring-2 ${
          isFocused ? "ring-rose-500" : "ring-white/10"
        } transition-all duration-200`}
      >
        <button  onClick={handleSearch} className="cursor-pointer hover:scale-111 duration-150 active:scale-90">
          
           <BiSearch size={22} className="text-neutral-400 mr-3" />
        </button>
      
        <input
          ref={inputRef}
          type="text"
          className={`bg-transparent flex-1 outline-none text-white placeholder:text-neutral-400 text-lg ${inputClassName}`}
          placeholder="Поиск трека, бита или вайба…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
        />

        {/* DROPDOWN FILTER RIGHT */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setFilterOpen((open) => !open)}
            className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 transition px-3 py-1.5 rounded-xl text-white font-semibold text-sm ml-2"
          >
            <span className="capitalize">
              {filterOptions.find(o => o.value === selectedFilter)?.label || "All"}
            </span>
            <BiChevronDown className={`text-xl transition-transform ${filterOpen ? "rotate-180" : ""}`} />
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-neutral-900 border border-white/10 rounded-lg shadow-lg z-51 overflow-hidden animate-fade-in">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(option.value);
                    setFilterOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition
                    ${selectedFilter === option.value
                      ? "bg-rose-500 text-white"
                      : "text-neutral-300 hover:bg-neutral-800"}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {searchValue && (
          <button
            className="ml-2 text-neutral-400 hover:text-white transition"
            onClick={() => setSearchValue("")}
            tabIndex={-1}
          >
            <AiOutlineClose size={18} />
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="absolute left-0 right-0 mt-2 z-50">
          {searchValue && (
            <div className="bg-neutral-900/95 rounded-xl shadow-2xl overflow-y-auto border border-white/10 animate-fade-in max-h-80">
              {isLoading ? (
                <div className="p-4 text-neutral-400 text-center text-sm">
                  Загрузка песен...
                </div>
              ) : suggestions.length > 0 ? (
                <ul>
                  {suggestions.map((song: Song) => (
                    <li
                      key={song.id}
                      className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-rose-500/80 transition-all group"
                      onMouseDown={() => handleSuggestionClick(song)}
                    >
                      {song.imagePath ? (
                        <img
                          src={song.imagePath}
                          alt={song.title}
                          className={imageStyle}
                          loading="lazy"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className={imageStyle + " flex items-center justify-center text-neutral-500"}>
                          <AiOutlineFileImage size={22} />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white group-hover:text-white">
                          {song.title}
                        </div>
                        <div className="text-xs text-neutral-400">{song.author} • {song.vibe}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5 flex gap-1">
                          {song.type && <span>{song.type}</span>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-neutral-500 text-sm">
                  Нет совпадений
                </div>
              )}
            </div>
          )}
          {!searchValue && searchHistory.length > 0 && (
            <div className="bg-neutral-900/95 rounded-xl shadow-2xl overflow-y-auto border border-white/10 animate-fade-in max-h-72">
              <div className="px-4 py-2 text-xs text-neutral-400">
                История поиска
              </div>
              <ul>
                {searchHistory.map((item, i) => (
                  <li
                    key={i + (item.type === "song" ? item.id : item.query)}
                    className="group flex items-center gap-3 px-4 py-2 hover:bg-rose-500/70 transition-all cursor-pointer"
                  >
                    {item.type === "song" ? (
                      <>
                        {item.imagePath ? (
                          <img
                            src={item.imagePath}
                            alt={item.title}
                            className={imageStyle}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className={imageStyle + " flex items-center justify-center text-neutral-500"}>
                            <AiOutlineFileImage size={22} />
                          </div>
                        )}
                        <div className="flex-1" onMouseDown={() => handleHistoryClick(item)}>
                          <div className="font-semibold text-white">{item.title}</div>
                          <div className="text-xs text-neutral-400">{item.author}</div>
                        </div>
                      </>
                    ) : (
                      <><BiSearch className="text-neutral-400" size={18} />
                        <span className="flex-1" onMouseDown={() => handleHistoryClick(item)}>
                          {item.query}
                        </span>
                      </>
                    )}
                    <button
                      className="ml-2 opacity-60 group-hover:opacity-100 hover:text-red-400 transition"
                      title="Удалить из истории"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        removeHistoryItem(item);
                      }}
                    >
                      <AiOutlineClose size={16} />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="w-full text-xs text-neutral-400 hover:text-white p-2 border-t border-white/5"
                onClick={clearSearchHistory}
              >
                Очистить историю
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
