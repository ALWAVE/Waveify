"use client"
import React from "react";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { BiSolidSearch } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import Tooltip from "./Tooltipe";
import Link from "next/link";
import SidebarItem from "./SidebarItem";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

const SearchInput = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleSearch = () => setSearchVisible(!isSearchVisible);
  const clearSearch = () => setSearchValue("");

  return (
    <div>
      {/* PC VERISON */}
      <div
        className="no-drag hidden md:block relative flex items-center group "
      
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`transition-all duration-300 ease-in-out  bg-[var(--bgPage)] text-[var(--text)] rounded-full pl-12 pr-10 py-2  ${isSearchVisible ? "w-90 opacity-100" : "w-0 opacity-0"
            }`}
          style={{ transition: "width 0.3s ease, opacity 0.3s ease" }}
          onFocus={() => setSearchVisible(true)}
          onBlur={() => setSearchVisible(false)}
        />

        {/* Кнопка поиска */}
        <button
          onClick={toggleSearch}
          className={`no-drag cursor-pointer text-neutral-400   absolute left-2 transition-all duration-300 ease-in-out 
            ${isSearchVisible ? 
            "text-[var(--text)] hover:rose-500" : "bg-[var(--bgPage)] text-neutral-400 " 
            } rounded-full p-2`}
      
        >
          <BiSearch size={26} />
          <Tooltip label="Search" />
        </button>

        {/* Кнопка очистки */}
        {searchValue && (

          <button
            onClick={clearSearch}
            className="no-drag cursor-pointer  absolute right-2 mt-1 text-white bg-neutral-700 rounded-full p-1"
          
          >
            <AiOutlineClose size={20} />
          </button>
        )}

      </div>
   

    </div>


  );
};

export default SearchInput;
