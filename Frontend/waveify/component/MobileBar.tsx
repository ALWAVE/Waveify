"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { twMerge } from "tailwind-merge";
import SidebarItem from "./SidebarItem";
import { useMemo } from "react";
import { GoHome, GoHomeFill } from "react-icons/go";
import ProfileButton from "./ProfileButton";
import MobileMenuButton from "./MobileMenuButton";
import { RiSearchFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";

const MobileBar = () => {
 
  const pathname = usePathname();
  

  const route = useMemo(
    () => [

      {
        icon: <GoHome size={26} />,
        label: "Home",
        active: pathname === "/",
        href: "/",
        iconActive: <GoHomeFill size={26} />
      },
      {
        icon: <CiSearch  size={26} />,
        label: "Search",
        active: pathname === "/search",
        href: "/search",
        iconActive: <RiSearchFill size={26} />
      },
      {
        icon: <GoHome size={26} />,
        label: "Premium",
        active: pathname === "/premium",
        href: "/premium",
        iconActive: <GoHomeFill size={26} />
      },



    ],
    [pathname]
  );

  return (
    <div className="fixed bottom-[80px] z-20 w-full bg-black/80 border-t border-neutral-700 px-6 py-2 flex justify-between md:hidden">
    {route.map((item) => (
      <div key={item.label} className="drag-region">
        <div className="no-drag">
        <SidebarItem  textColorActive="black" className = {twMerge(`rounded-full `)}
        positionToolTipe="top" {...item} />
        <span className="text-xs">{item.label}</span>
        </div>
      
      </div>
    ))}
    {/* Поле поиска */}
   
    <MobileMenuButton />
   
  
  </div>
  );
};

export default MobileBar;
