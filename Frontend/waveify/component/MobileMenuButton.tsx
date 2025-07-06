"use client";

import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import MenuModal from "./MenuModal";
import { useAuth } from "@/providers/AuthProvider";

const MobileMenuButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  // Если пользователя нет, не показываем кнопку меню
  if (!user) return null;

  return (
    <div className="block md:hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="no-drag flex items-center text-[var(--text)] font-medium rounded-full text-sm"
        aria-label="Toggle menu"
      >
        <IoMenu size={40} />
      </button>
      <MenuModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default MobileMenuButton;
