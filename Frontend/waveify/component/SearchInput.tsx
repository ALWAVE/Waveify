"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import Tooltip from "./Tooltipe";
import { twMerge } from "tailwind-merge";

interface SearchInputProps {
  className?: string;
  inputClassName?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ className, inputClassName }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = searchValue.trim();
    if (trimmed.length === 0) {
      router.push("/explore");
    } else {
      router.push(`/explore?query=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className={twMerge("no-drag relative w-full md:w-96 ", className)}>
      <input
        type="text"
        placeholder="Search for tracks or beats..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className={twMerge(
          "w-full bg-white/10 hover:bg-white/20 active:bg-white/20 text-base text-[var(--text)] rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-300 mr-1 p-2",
          inputClassName
        )}
      />
      {searchValue && (
        <button
          className="absolute right-10 top-1.5 pt-1  text-gray-300 cursor-pointer hover:text-[var(--text)] group"
          onClick={() => setSearchValue("")}
        >
          <AiOutlineClose size={20} />
          <Tooltip label="Close" />
        </button>
      )}
      <button
        className="absolute right-2 top-1.5 pt-1 cursor-pointer text-gray-500 hover:text-[var(--text)] group"
        onClick={handleSearch}
      >
        <BiSearch size={22} />
        <Tooltip label="Search" />
      </button>
    </div>
  );
};

export default SearchInput;
