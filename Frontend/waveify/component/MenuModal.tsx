"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaCirclePlus } from "react-icons/fa6";
import { LuLibrary, LuYoutube } from "react-icons/lu";
import { MdOutlinePlaylistAddCircle, MdOutlineLibraryMusic } from "react-icons/md";
import { GoIssueTrackedBy } from "react-icons/go";
import { TbBrandNeteaseMusic } from "react-icons/tb";
import { GrUploadOption } from "react-icons/gr";
import { HiHeart } from "react-icons/hi2";
import { BsCollection, BsCollectionFill } from "react-icons/bs";
import { RiFileMusicLine, RiFileMusicFill } from "react-icons/ri";
import { PiWavesLight, PiWavesFill } from "react-icons/pi";
import { TiSocialYoutube } from "react-icons/ti";

import useUploadModal from "@/hooks/useUploadModal";
import useUploadBeatModal from "@/hooks/useUploadBeatModal";
import { useFavorites } from "@/hooks/useFavorites";
import useLibrarySettings from "@/hooks/useLibrarySettings";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MobileActionButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
}> = ({ icon, title, description, onClick, href, active }) => {
  const baseClass =
    "flex items-start gap-4 p-4 rounded-xl transition duration-200 shadow-md";

  const classes = active
    ? `bg-rose-500 text-white ${baseClass}`
    : `bg-[var(--bgButton)] text-[var(--text)] hover:bg-rose-500 ${baseClass}`;

  const content = (
    <div className={classes} onClick={onClick}>
      <div className="mt-1 text-[var(--text)]">{icon}</div>
      <div className="flex flex-col text-left">
        <span className="text-sm font-semibold">{title}</span>
        {description && (
          <span className="text-xs text-[var(--text)]">{description}</span>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};

const MobileMenuModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const uploadModal = useUploadModal();
  const uploadBeatModal = useUploadBeatModal();
  const { favorites, loadFavorites } = useFavorites();
  const { showYourFile } = useLibrarySettings();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  if (!isOpen) return null;

  const handleClickAndClose = (cb?: () => void) => {
    if (cb) cb();
    onClose();
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-50 bg-[var(--bgPage)] shadow-xl rounded-b-2xl p-4 md:hidden">
      <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1 ">
        {/* Create Section */}
        <MobileActionButton
          icon={<GoIssueTrackedBy size={22} />}
          title="Create Track"
          description="Upload a track for listeners"
          onClick={() => handleClickAndClose(uploadModal.onOpen)}
        />
        <MobileActionButton
          icon={<TbBrandNeteaseMusic size={22} />}
          title="Create Beat"
          description="Upload a beat to sell"
          onClick={() => handleClickAndClose(uploadBeatModal.onOpen)}
        />
        <MobileActionButton
          icon={<MdOutlinePlaylistAddCircle size={22} />}
          title="Create Playlist"
          description="Make a playlist for your collection"
          href="/item1"
          onClick={onClose}
        />
        <MobileActionButton
          icon={<GrUploadOption size={22} />}
          title="Upload File"
          description="Add files to your collection"
          onClick={() => handleClickAndClose(uploadModal.onOpen)}
        />

        <hr className="border-t border-neutral-600 my-2" />

        {/* Collection & Extras */}
        <MobileActionButton
          icon={<LuLibrary size={22} />}
          title="Your Collection"
          description="All your saved items"
          href="/collection"
          onClick={onClose}
          active={pathname === "/collection"}
        />

        {favorites.includes("Favorite") && (
          <MobileActionButton
            icon={<HiHeart size={22} />}
            title="Favorite"
            description="Tracks you liked"
            href="/collection/favorite"
            onClick={onClose}
            active={pathname === "/collection/favorite"}
          />
        )}

        {favorites.includes("Your Music") && (
          <MobileActionButton
            icon={<BsCollection size={22} />}
            title="Your Music"
            description="Tracks you've uploaded"
            href="/collection/your-tracks"
            onClick={onClose}
            active={pathname === "/collection/your-tracks"}
          />
        )}

        {showYourFile && (
          <MobileActionButton
            icon={<RiFileMusicLine size={22} />}
            title="Your File"
            description="Uploaded files"
            href="/collection/your-files"
            onClick={onClose}
            active={pathname === "/collection/your-files"}
          />
        )}

        <hr className="border-t border-neutral-600 my-2" />

        {/* Routes */}
        <MobileActionButton
          icon={<TiSocialYoutube size={22} />}
          title="YouTube Download"
          description="Download music from YouTube"
          href="/youtube-download"
          onClick={onClose}
          active={pathname === "/youtube-download"}
        />
        <MobileActionButton
          icon={<PiWavesFill size={22} />}
          title="Wave"
          description="Waveform & sound analysis"
          href="/wave"
          onClick={onClose}
          active={pathname === "/wave"}
        />
      </div>
    </div>
  );
};

export default MobileMenuModal;
