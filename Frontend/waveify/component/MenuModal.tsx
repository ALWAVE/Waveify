"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { LuLibrary } from "react-icons/lu";
import { IoAlbumsOutline, IoAlbums } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import useUploadModal from "@/hooks/useUploadModal";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MenuModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const uploadModal = useUploadModal();

  if (!isOpen) return null;

  const route = [
    {
      icon: <LuLibrary size={24} />,
      label: "Your collection",
      href: "/collection",
      active: pathname === "/collection",
    },
    {
      icon: <MdOutlineLibraryMusic size={24} />,
      label: "Beat",
      href: "/beat",
      active: pathname === "/beat",
    },
    {
      icon: <IoAlbumsOutline size={24} />,
      label: "Album",
      href: "/album",
      active: pathname === "/album",
    },
    {
      icon: <IoAlbumsOutline size={24} />,
      label: "YouTube Download",
      href: "/youtube-download",
      active: pathname === "/youtube-download",
    },
    {
      icon: <IoAlbumsOutline size={24} />,
      label: "Wave",
      href: "/wave",
      active: pathname === "/wave",
    },
  ];

  return (
    <div className="fixed top-16 left-0 right-0 z-50 bg-[var(--bgPage)] shadow-md rounded-b-xl p-4 md:hidden">
      <div className="flex flex-col gap-3">
        <button
          onClick={() => {
            uploadModal.onOpen();
            onClose();
          }}
          className="flex items-center mr-4 gap-3 text-[var(--text)] bg-[var(--bgButton)] px-4 py-2 rounded-md"
        >
          <FaCirclePlus size={24} /> 
          <span>Create</span>
        </button>

        <hr className="border-t border-neutral-600" />

        {route.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
              item.active
                ? "bg-rose-500 text-white mr-4"
                : "text-[var(--text)] hover:bg-rose-500"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuModal;
