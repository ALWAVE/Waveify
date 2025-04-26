"use client"
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import { twMerge } from "tailwind-merge";
import { IoAlbumsOutline } from "react-icons/io5";
import { IoAlbums } from "react-icons/io5";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { LuLibrary } from "react-icons/lu";
import { FaCirclePlus } from "react-icons/fa6";
import useUploadModal from "@/hooks/useUploadModal";
import usePlayer from "@/hooks/usePlayer";
interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({}) => {
  const pathname = usePathname();
  const player = usePlayer()
  const uploadModal = useUploadModal();
  const onClickCreate = () => {
    return uploadModal.onOpen();
  }
   const route = useMemo(() => [
     {
            icon: <MdOutlineLibraryMusic size={26} />,
            label: "Beat",
            active: pathname === "/beat",
            href: "/beat",
            iconActive: <MdOutlineLibraryMusic size={26} />
      },
          {
            icon: <IoAlbumsOutline size={26} />,
            label: "Album",
            active: pathname === "/album",
            href: "/album",
            iconActive: <IoAlbums size={26} />
          },
          {
            icon: <IoAlbumsOutline size={26} />,
            label: "YouTube Download",
            active: pathname === "/youtube-download",
            href: "/youtube-download",
            iconActive: <IoAlbums size={26} />
          },
          {
            icon: <IoAlbumsOutline size={26} />,
            label: "Wave",
            active: pathname === "/wave",
            href: "/wave",
            iconActive: <IoAlbums size={26} />
          },
          {
            icon: <IoAlbumsOutline size={26} />,
            label: "Favorites",
            active: pathname === "/favorite",
            href: "/favorite",
            iconActive: <IoAlbums size={26} />
          },
   ], [pathname])
  return (
    <div>
      {/* <div className={twMerge(`flex h-full`, "h-[calc(100%-80px)]")}> */}
      <div className={twMerge(`flex h-full `)}> 

        <div className="hidden md:flex flex-col gap-y-2 bg-[var(--bg)] h-full w-[100px] pr-2 pl-2 h-screen ">
           {/* <Box>
          <div className="flex flex-col gap-y-3 px-5 py-4">
            {route.map((item) => (
              <SidebarItem 
                key={item.label}
                {...item}
              />
            ))}
          </div>
        </Box>   */}
          <Box className=" h-full bg-[var(--bg)] ">
          <div className="flex flex-col gap-y-3 px-5 py-4 ">
       
      
          <SidebarItem
            className = "text-[var(--text)]"
            label="Create"
            isButton
            onClick={onClickCreate}
            icon={<FaCirclePlus size={26}  />}
            iconActive={<FaCirclePlus size={26} />}
            textColorActive="black"
            positionToolTipe="right"
            />
            <SidebarItem
                
                label="Your collection"
                active={pathname === "/collection"}
                icon={<LuLibrary size={26} />}
                iconActive =  {<LuLibrary size={26} />}
                textColorActive="black"
                positionToolTipe="right"
                href="/collection"
              />
             <hr className=" mx-2 border-t-[0.5px] border-neutral-700" />
          
            {route.map((item) => (
              <SidebarItem 
              textColorActive="black"
              positionToolTipe="right"
                key={item.label}
                {...item}
              />
            ))}
          </div>
          </Box>
        </div>

      </div>
      
    </div>
    
  );
};

export default Sidebar;
