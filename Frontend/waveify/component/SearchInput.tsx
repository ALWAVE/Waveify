"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BiSearch, BiChevronDown } from "react-icons/bi";
import { AiOutlineClose, AiOutlineFileImage } from "react-icons/ai";
import useSongs from "@/hooks/useSongs";
import { Song } from "@/models/Song";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Track", value: "track" },
  { label: "Beat", value: "beat" },
  { label: "Joyfully", value: "joyfully" },
  { label: "Energetic", value: "energetic" },
  { label: "Quietly", value: "quietly" },
  { label: "Sad", value: "sad" },
] as const;
const placeholders = [
  "Что включим?",
  "Что хочешь включить?",
  "Что  сегодня?",
  "Найти любимый трек...",
  "Что послушаем?",
  "Впиши в меня что нибудь...",
];
type FilterType = typeof filterOptions[number]["value"];

type SearchHistoryItem =
  | { type: "song"; id: string; title: string; author?: string; imagePath?: string }
  | { type: "text"; query: string };

function getSongText(song: Song): string {
  return [song.title, song.author, song.vibe].filter(Boolean).join(" ").toLowerCase();
}

const fadeVariants = {
  hidden: { opacity: 0, pointerEvents: "none" as const },
  visible: { opacity: 1, pointerEvents: "auto" as const },
  exit: { opacity: 0, pointerEvents: "none" as const },
};
interface SearchInputProps {
  className?: string;
}
const SearchInput: React.FC<SearchInputProps> = ({ className }) => {
  const [randomPlaceholder, setRandomPlaceholder] = useState(placeholders[0]);
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [themeKey, setThemeKey] = useState(0);
  const [layoutLetter, setLayoutLetter] = useState<"K" | "Л">("K");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const { songs, refresh, isLoading } = useSongs([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const update = () => setThemeKey(k => k + 1);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', update);
    return () =>
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', update);
  }, []);

  useEffect(() => { refresh(); }, []);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("searchHistory") || "[]");
    }
    return [];
  });
  useEffect(() => {
    const idx = Math.floor(Math.random() * placeholders.length);
    setRandomPlaceholder(placeholders[idx]);
  }, []);
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
    }, 900);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  const filterSong = (song: Song): boolean => {
    if (selectedFilter === "all") return true;
    return (song.vibe || "").toLowerCase() === selectedFilter;
  };

  const suggestions =
    searchValue.length > 0
      ? songs
        .filter((song) => filterSong(song) && getSongText(song).includes(searchValue.toLowerCase()))
        .slice(0, 8)
      : [];

  // Клик вне — закрыть
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
    const handler = (e: KeyboardEvent) => {
      const isK = e.code === "KeyK";
      const isKeyL = e.key && (e.key.toLowerCase() === "k" || e.key.toLowerCase() === "л");
      if ((e.ctrlKey || e.metaKey) && (isK || isKeyL)) {
        // Меняем подсказку:
        if (e.key && (e.key.toLowerCase() === "л")) setLayoutLetter("Л");
        else setLayoutLetter("K");
        // Не открываем если внутри input:
        if (
          document.activeElement &&
          (document.activeElement as HTMLElement).tagName === "INPUT"
        ) return;
        e.preventDefault();
        setFilterOpen(false);
        setTimeout(() => {
          inputRef.current?.focus();
          setIsFocused(true);
          setShowDropdown(true);
        }, 20);
      }
    };
    window.addEventListener("keydown", handler, { capture: true });
    return () => window.removeEventListener("keydown", handler, { capture: true });
  }, []);
  const openSearchDropdown = () => {
    setShowDropdown(true);
    setFilterOpen(false);
    setIsFocused(true);
  };
  const openFilterDropdown = () => {
    setFilterOpen(true);
    setShowDropdown(false);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!searchValue.trim()) return;
      router.push(`/explore?query=${encodeURIComponent(searchValue.trim())}&filter=${selectedFilter}`);
      setShowDropdown(false);
      setIsFocused(false);
      inputRef.current?.blur();
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
    setShowDropdown(false);
    setIsFocused(false);
    inputRef.current?.blur();
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

  const [showShortcut, setShowShortcut] = useState(false);

  // Основной фон
  const baseBg = { background: "var(--bgPage, #fff)", color: "var(--text, #15151a)" };
  const borderCol = { borderColor: "rgba(0,0,0,0.06)" };

  return (
    <div  className={twMerge("no-drag", className)}
     ref={wrapperRef}>
      <motion.div
        className={`
          flex items-center rounded-full px-4 py-2 shadow border transition-colors duration-200 group
          bg-white
        `}
        style={{
          ...baseBg,
          ...borderCol,
          minHeight: 38,
          position: "relative",
        }}
        animate={isFocused || showShortcut ? { boxShadow: "0 4px 18px rgba(230,35,77,0.10)", borderColor: "rgba(255,255,255)" } : {}}
        whileHover={{
          boxShadow: "0 2px 12px rgba(255,255,255,0.08)",
          borderColor: "rgba(255,255,255,0.25)",
        }}
        transition={{ duration: 0.19 }}
        onMouseEnter={() => setShowShortcut(true)}
        onMouseLeave={() => setShowShortcut(false)}
      >
        <button
          onClick={handleSearch}
          className="cursor-pointer hover:bg-black/10 rounded-full p-1 transition-colors mr-1"
          tabIndex={-1}
          style={{ color: "var(--text, #232323)" }}
        >
          <BiSearch size={20} />
        </button>

        <input
          key={themeKey}
          ref={inputRef}
          type="text"
          className={`
            bg-transparent flex-1 outline-none text-base transition-colors duration-150 rounded-full px-2
          `}
          style={{
            color: "var(--text)",
            '--placeholder-color': 'var(--text, #888)',
            minWidth: 0,   
            paddingTop: 2,
            paddingBottom: 2,
          } as any}
          placeholder={randomPlaceholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={openSearchDropdown}
          onKeyDown={handleKeyDown}
        />

        {/* Ctrl+K всегда зарезервированное место, плавно появляется */}
        <div
          className={`
            ml-2 hidden sm:flex items-center rounded bg-black/5 px-2 py-1 border text-xs font-mono font-medium gap-0.5 transition-opacity duration-200
            select-none
          `}
          style={{
            color: "var(--text, #15151a)",
            borderColor: "rgba(0,0,0,0.08)",
     
            opacity: showShortcut || isFocused ? 1 : 0,
            pointerEvents: "none",
            height: 28, // Фиксированная высота для визуального выравнивания
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.18s"
          }}
        >
          <kbd style={{ opacity: 0.7 }}>Ctrl</kbd>
          <span style={{ opacity: 0.5 }}>+</span>
          <kbd style={{ opacity: 0.7 }}>{layoutLetter}</kbd>
        </div>

        <div className="relative ml-2 z-20" ref={filterRef}>
          <button
            type="button"
            onClick={() => (filterOpen ? setFilterOpen(false) : openFilterDropdown())}
            className={`
              flex items-center gap-1
              hover:bg-black/10
              transition px-3 py-1 rounded-full font-semibold text-sm border focus:outline-none
            `}
            tabIndex={0}
            style={{
              background: "var(--bg, #f7f7f7)",
              color: "var(--text)",
              borderColor: "rgba(0,0,0,0.08)",
              fontWeight: 500,
            }}
          >
            <span className="capitalize">
              {filterOptions.find(o => o.value === selectedFilter)?.label || "All"}
            </span>
            <BiChevronDown className={`text-lg transition-transform ${filterOpen ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                key="filter-dropdown"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeVariants}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-36 rounded-xl shadow-xl z-40 overflow-hidden border"
                style={{
                  background: "var(--bg, #f7f7f7)",
                  color: "var(--text)",
                  borderColor: "rgba(0,0,0,0.1)"
                }}
              >
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(option.value);
                      setFilterOpen(false);
                      setShowDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition rounded-lg hover:bg-[var(--bgPage)] hover:opacity-45`}
                    style={{
                      background: selectedFilter === option.value ? "rgba(230, 35, 77, 0.93)" : "transparent",
                      color: selectedFilter === option.value ? "#fff" : "var(--text)",
                      fontWeight: selectedFilter === option.value ? 700 : 400
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {searchValue && (
          <button
            className="ml-2 transition rounded-full p-1"
            onClick={() => setSearchValue("")}
            tabIndex={-1}
            aria-label="Clear search"
            style={{ color: "var(--text, #15151a)" }}
          >
            <AiOutlineClose size={18} />
          </button>
        )}
      </motion.div>

      {/* SEARCH DROPDOWN */}
      <AnimatePresence>
        {showDropdown && !filterOpen && (
          <motion.div
            key="search-dropdown"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeVariants}
            transition={{ duration: 0.19 }}
            className="absolute left-0 right-0 mt-2 z-10 "
          >
            {searchValue ? (
              <div
                className="rounded-2xl shadow-2xl overflow-y-auto max-h-80 backdrop-blur-[2px] p-1 border"
                style={{
                  ...baseBg,
                  ...borderCol,
                }}
              >
                {isLoading ? (
                  <div className="p-4 text-center text-base" style={{ color: "var(--text)", opacity: 0.7 }}>
                    Загрузка песен...
                  </div>
                ) : suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map((song: Song) => (
                      <li
                        key={song.id}
                        className="flex items-center gap-4 px-3 py-2 cursor-pointer rounded-xl transition-colors"
                        style={{
                          color: "var(--text)",
                          fontWeight: 500,
                        }}
                        onMouseDown={() => handleSuggestionClick(song)}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(40,40,60,0.12)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        {song.imagePath ? (
                          <img
                            src={song.imagePath}
                            alt={song.title}
                            className="w-9 h-9 object-cover rounded-lg flex-shrink-0"
                            loading="lazy"
                            width={36}
                            height={36}
                            style={{ background: "#f0f0f0" }}
                          />
                        ) : (
                          <div className="w-9 h-9 object-cover rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "#f0f0f0", color: "#aaa" }}>
                            <AiOutlineFileImage size={20} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text)" }}>{song.title}</div>
                          <div style={{ fontSize: 13, opacity: 0.65 }}>{song.author} • {song.vibe}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-base" style={{ color: "var(--text)", opacity: 0.6 }}>
                    Нет совпадений
                  </div>
                )}
              </div>
            ) : searchHistory.length > 0 && (
              <div
                className="rounded-2xl shadow-2xl overflow-y-auto max-h-72 backdrop-blur-[2px] p-1 border"
                style={{
                  ...baseBg,
                  ...borderCol,
                }}
              >
                <div className="px-4 py-2 text-xs" style={{ opacity: 0.7 }}>История поиска</div>
                <ul>
                  {searchHistory.map((item, i) => (
                    <li
                      key={i + (item.type === "song" ? item.id : item.query)}
                      className="group flex items-center gap-3 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                      style={{
                        color: "var(--text)",
                        fontWeight: 500,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(40,40,60,0.12)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      {item.type === "song" ? (
                        <>
                          {item.imagePath ? (
                            <img
                              src={item.imagePath}
                              alt={item.title}
                              className="w-9 h-9 object-cover rounded-lg flex-shrink-0"
                              width={36}
                              height={36}
                              style={{ background: "#f0f0f0" }}
                            />
                          ) : (
                            <div className="w-9 h-9 object-cover rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "#f0f0f0", color: "#aaa" }}>
                              <AiOutlineFileImage size={18} />
                            </div>
                          )}
                          <div className="flex-1" onMouseDown={() => handleHistoryClick(item)}>
                            <div style={{ fontWeight: 600, color: "var(--text)" }}>{item.title}</div>
                            <div style={{ fontSize: 13, opacity: 0.65 }}>{item.author}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <BiSearch style={{ opacity: 0.65 }} size={16} />
                          <span className="flex-1" onMouseDown={() => handleHistoryClick(item)}>
                            {item.query}
                          </span>
                        </>
                      )}
                      <button
                        className="ml-2 opacity-60 group-hover:opacity-100 hover:text-red-400 transition rounded-full p-1"
                        title="Удалить из истории"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          removeHistoryItem(item);
                        }}
                        style={{ color: "var(--text)" }}
                      >
                        <AiOutlineClose size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-center p-2">
                  <button
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold shadow active:scale-95 transition hover:scale-102 duration-150"
                    style={{
                      ...baseBg,
                      ...borderCol,
                      fontWeight: 500
                    }}
                    onClick={clearSearchHistory}
                  >
                    <AiOutlineClose size={14} style={{ opacity: 0.7 }} />
                    Очистить историю
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInput;
