"use client";
import { useRouter } from "next/navigation";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import ButtonLogin from "./ButtonLogin";
import { SlCloudDownload } from "react-icons/sl";
import { GoHome } from "react-icons/go";
import { usePathname } from "next/navigation";
import { useMemo, useState,  useEffect } from "react";
import SidebarItem from "./SidebarItem";
import TitleBarLogo from "./TitleBarLogo";
import { GoHomeFill } from "react-icons/go";
import SearchInput from "./SearchInput";
import AuthModal from "./AuthModal";
import { useAuth } from "@/providers/AuthProvider";
import ProfileButton from "./ProfileButton";
import Link from "next/link";
import DesktopAuthModal from "./DesktopAuthModal";
import { FaChevronDown } from "react-icons/fa6";

import { twMerge } from "tailwind-merge";
import MobileMenuButton from "./MobileMenuButton";
interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}
const isElectron = typeof window !== "undefined" && window.electron;

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [hidePremium, setHidePremium] = useState(false);
  const [hideLogo, setHideLogo] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const route = useMemo(
    () => [

      {
        icon: <GoHome size={26} />,
        label: "Home",
        active: pathname === "/",
        href: "/",
        iconActive: <GoHomeFill size={26} />
      }


    ],
    [pathname]
  );

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };

 
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Проверка подписки и экрана
  useEffect(() => {
    
    if (user?.subscription) {
      setHidePremium(true); // Если подписка есть, скрываем кнопку
    } else {
      // Для обычных пользователей проверяем разрешение экрана
      if (screenWidth < 1068) {
        setHidePremium(true); // Скрыть, если экран слишком маленький
      } else {
        setHidePremium(false); // Показываем кнопку на больших экранах
      }
      if (screenWidth < 768) {
        setHideLogo(true); // Скрыть, если экран слишком маленький
      } else {
        setHideLogo(false); // Показываем кнопку на больших экранах
      }
    }
  }, [user, screenWidth]);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  //  у нижнего дива h-15 удалил
  return (
    <div>
      {/* PC VERSION */}
      <div
        className="hidden md:flex  fixed top-0 left-0 w-full bg-[var(--bg)] 
        p-3 h-15 flex items-center select-none 
      
        relative "
        
        style={{ WebkitAppRegion: "drag" }} // ✅ Заголовок можно тянуть
      >
        {!hideLogo && (
          <TitleBarLogo />
        )}
        <div className="w-full flex items-center justify-between h-full px-4">
          {/* Навигация назад/вперед */}
          <div className="hidden md:flex  items-left">
            <button
              style={{ WebkitAppRegion: "no-drag" }} // ❌ Кнопки не мешают кликам
              onClick={() => router.back()}
              className="rounded-full bg-[var(--bgPage)]  flex items-center hover:opacity-75 hover:bg-rose-500 transition"
            >
              <RxCaretLeft className="text-[var(--text)]" size={35} />
            </button>
            <button
              style={{ WebkitAppRegion: "no-drag" }}
              onClick={() => router.forward()}
              className="rounded-full bg-[var(--bgPage)] flex items-center hover:opacity-75 hover:bg-rose-500  transition"
            >
              <RxCaretRight className="text-[var(--text)]" size={35} />
            </button>
          </div>

          {/* Кнопки Home / Search */}
          <div id="nav-center" className="hidden md:flex  flex gap-x-2 items-center justify-center flex-1">
            {route.map((item) => (
              <div key={item.label} style={{ WebkitAppRegion: "drag" }}>
                <div style={{ WebkitAppRegion: "no-drag" }}>
                  <SidebarItem  textColorActive="black" className = {twMerge(`rounded-full `)}
                  positionToolTipe="bottom" {...item} />
                </div>
              </div>
            ))}
            {/* Поле поиска */}
            <SearchInput  />
          </div>


          {/* Правый блок (авторизация, загрузка и т.д.) */}
          <div id="right-section" className="flex items-center gap-x-4 mr-30 ">
            
            {!hidePremium && (
              <Link
                style={{ WebkitAppRegion: "no-drag" }}
                href={"/premium"}
                className="hidden md:flex font-semibold bg-gradient-to-r from-violet-200 to-pink-200 text-black hover:opacity-100 hover:bg-white hover:scale-102 rounded-full px-4 py-1"
              >
                <h1 className="text-black text-sm whitespace-nowrap">Узнать больше о Premium</h1>
              </Link>
            )}
            {!isElectron && (
              <Link
                style={{ WebkitAppRegion: "no-drag" }}
                href={"/download"}
                className=" hidden md:block bg-transparent text-grey font-medium"
              >
                <SlCloudDownload className="text-neutral-400 rounded-full hover:text-white" size={25} />
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-x-4 {user.username}">

                <ProfileButton />
              </div>
            ) : (
              <div className="relative flex items-center gap-x-4 ">
                <ButtonLogin
                  onClick={() => {
                    setAuthMode("register"); // ✅ Открываем Sign Up
                    setAuthModalOpen(true);
                  }}
                  style={{ WebkitAppRegion: "no-drag" }}

                  className="bg-transparent text-neutral-300 font-medium px-4 py-2 md:px-5 md:py-2 text-sm md:text-base rounded-full whitespace-nowrap"
                >
                  Sign Up
                </ButtonLogin>

                <ButtonLogin
                  onClick={() => {
                    setAuthMode("login"); // ✅ Открываем Log In
                    setAuthModalOpen(true);
                  }}
                  style={{ WebkitAppRegion: "no-drag" }}

                  className="bg-white text-black font-semibold px-4 py-2 md:px-5 md:py-2 text-sm md:text-base rounded-full whitespace-nowrap"
                >
                  Log In
                </ButtonLogin>
                
              </div>
              
            )}
                
          </div>

        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />

        {children}

      </div>
    </div>




  );
};

export default Header;
