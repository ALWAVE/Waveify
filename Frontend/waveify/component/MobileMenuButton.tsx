"use client";

import React from "react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import ButtonLogin from "./ButtonLogin";
import MenuModal from "./MenuModal";
import { IoMenu } from "react-icons/io5";
const MobileMenuButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="block md:hidden">
        <button
          onClick={() => setOpen((prev) => !prev)}
       
          className="no-drag flex items-center text-[var(--text)] font-medium  rounded-full text-sm"
        >
          <IoMenu   size={40} />
      
        </button>
      </div>
      <MenuModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default MobileMenuButton;
