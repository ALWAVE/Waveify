"use client";
import { usePathname } from "next/navigation";
import { useMemo, useEffect } from "react";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import { twMerge } from "tailwind-merge";
import { LuLibrary } from "react-icons/lu";
import { FaCirclePlus } from "react-icons/fa6";
import useUploadModal from "@/hooks/useUploadModal";
import SidebarDropdown from "./SidebarDropdown";
import { GoIssueTrackedBy } from "react-icons/go";
import { MdOutlinePlaylistAddCircle } from "react-icons/md";
import { TbBrandNeteaseMusic } from "react-icons/tb";
import { GrUploadOption } from "react-icons/gr";
import { useFavorites } from "@/hooks/useFavorites";
import { BsCollectionFill } from "react-icons/bs";
import { HiHeart } from "react-icons/hi2";
import useLibrarySettings from "@/hooks/useLibrarySettings";
import { RiFileMusicLine } from "react-icons/ri";
import { RiFileMusicFill } from "react-icons/ri";
import { BsCollection } from "react-icons/bs";
import useUploadBeatModal from "@/hooks/useUploadBeatModal";
import { PiWavesLight } from "react-icons/pi";
import { PiWavesFill } from "react-icons/pi";
import { TiSocialYoutube } from "react-icons/ti";
import { LuYoutube } from "react-icons/lu";
import { IoHeartOutline } from "react-icons/io5";
import { GoHome, GoHomeFill } from "react-icons/go";
import { useAuth } from "@/providers/AuthProvider"; // Импортируйте контекст авторизации
import { LuChartNoAxesColumn } from "react-icons/lu";
interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const pathname = usePathname();
  const uploadModal = useUploadModal();
  const uploadBeatModal = useUploadBeatModal();
  const { favorites, loadFavorites } = useFavorites();
  const { showYourFile } = useLibrarySettings();
  const { user } = useAuth(); // Получите пользователя из контекста

  useEffect(() => {
    loadFavorites();
  }, []);

  const onClickCreate = () => {
    uploadModal.onOpen();
  };
  
  const onClickBeatCreate = () => {
    uploadBeatModal.onOpen();
  };

  const route = useMemo(
    () => [
      {
        icon: <LuYoutube size={26} />,
        label: "YouTube Download",
        active: pathname === "/youtube-download",
        href: "/youtube-download",
        iconActive: <TiSocialYoutube size={26} />,
      },
      {
        icon: <LuChartNoAxesColumn size={26} />,
        label: "TopCharts",
        active: pathname === "/top-chart",
        href: "/top-chart",
        iconActive: <LuChartNoAxesColumn size={26} />,
      },
      // Добавьте другие маршруты, если нужно
    ],
    [pathname]
  );

  return (
    <div>
      <div className={twMerge(`flex h-full`)}>
        <div className="hidden md:flex flex-col gap-y-2 bg-[var(--bg)] h-full w-[100px] pr-2 pl-2 h-screen">
          <Box className="h-full bg-[var(--bg)]">
            <div className="flex flex-col gap-y-3 px-5 py-4">
              {/* <SidebarItem
                label="Home"
                active={pathname === "/"}
                icon={<GoHome size={26} />}
                iconActive={<GoHomeFill size={26} />}
                href="/"
                positionToolTipe="right"
              />
               */}
              <SidebarDropdown
                className="text-[var(--text)]"
                label="Create"
                positionToolTipe="right"
                icon={<FaCirclePlus size={26} />}
                items={[
                  {
                    label: "Create Track",
                    onClick: () => onClickCreate(),
                    description: "Create a track for listeners",
                    iconItem: <GoIssueTrackedBy size={26} />,
                    premium: true,
                  },
                  {
                    label: "Create Beat",
                    onClick: () => onClickBeatCreate(),
                    description: "Create beat for sale",
                    iconItem: <TbBrandNeteaseMusic size={26} />,
                    premium: true,
                  },
                  {
                    label: "Create Playlist",
                    href: user ? "/item1" : undefined, // Проверка авторизации
                                        description: "Create playlist for your collection",
                    iconItem: <MdOutlinePlaylistAddCircle size={26} />,
                  },
                  {
                    label: "Upload file",
                    href: user ? "/collection" : undefined, // Проверка авторизации
                    onClick: user ? () => onClickCreate() : undefined,
                    description: "Upload files to your collection",
                    iconItem: <GrUploadOption size={26} />,
                  },
                ]}
              />
              
              {user && (
                <SidebarItem
                  label="Your collection"
                  active={pathname === "/collection"}
                  icon={<LuLibrary size={26} />}
                  iconActive={<LuLibrary size={26} />}
                  href="/collection"
                  positionToolTipe="right"
                />
                
              )}
              {user && (<hr className="mx-2 border-t-[0.5px] border-neutral-700" />)}
          

              {favorites.includes("Favorite") && user && (
                
                <SidebarItem
                  label="Favorite"
                  active={pathname === "/collection/favorite"}
                  href="/collection/favorite"
                  icon={<IoHeartOutline size={26} />}
                  iconActive={<HiHeart size={26} />}
                  textColorActive="text-rose-900"
                  positionToolTipe="right"
                />
              )}

              {favorites.includes("Your Music") && user && (
                <SidebarItem
                  label="Your Music"
                  active={pathname === "/collection/your-tracks"}
                  href="/collection/your-tracks"
                  textColorActive="cyan-800"
                  icon={<BsCollection size={26} />}
                  iconActive={<BsCollectionFill size={26} />}
                  positionToolTipe="right"
                />
              )}

              {showYourFile && user && (
                <SidebarItem
                  label="Your File"
                  active={pathname === "/collection/your-files"}
                  href="/collection/your-files"
                  icon={<RiFileMusicLine size={26} />}
                  iconActive={<RiFileMusicFill size={26} />}
                  positionToolTipe="right"
                  textColorActive="emerald-700"
                />
              )}

              {route.map((item) => (
                user ? (
                  <SidebarItem key={item.label} {...item} positionToolTipe="right" />
                ) : null // Если пользователь не авторизован, не отображаем элемент
              ))}
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
