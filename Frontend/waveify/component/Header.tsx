"use client";

import { useRouter } from "next/navigation";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import ButtonLogin from "./ButtonLogin";
import { SlCloudDownload } from "react-icons/sl";
import { GoHome, GoHomeFill } from "react-icons/go";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import SidebarItem from "./SidebarItem";
import TitleBarLogo from "./TitleBarLogo";
import SearchInput from "./SearchInput";
import AuthModal from "./AuthModal";
import { useAuth } from "@/providers/AuthProvider";
import ProfileButton from "./ProfileButton";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

// ✅ Исправляем проверку Electron
const isElectron = typeof window !== "undefined" && (window as any).electron;

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isSearchVisible, setSearchVisible] = useState(false);
  const [hidePremium, setHidePremium] = useState(false);
  const [hideLogo, setHideLogo] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0); // ✅ Без window на старте
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

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
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);

      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Проверка подписки и ширины экрана
  useEffect(() => {
    if (user?.subscription) {
      setHidePremium(true);
    } else {
      if (screenWidth < 1068) {
        setHidePremium(true);
      } else {
        setHidePremium(false);
      }
      if (screenWidth < 768) {
        setHideLogo(true);
      } else {
        setHideLogo(false);
      }
    }
  }, [user, screenWidth]);

  return (
    <div>
      <div
        className="drag-region hidden md:flex fixed top-0 left-0 w-full bg-[var(--bg)] p-3 flex items-center select-none relative"
    
      >
        {!hideLogo && <TitleBarLogo />}
        <div className="w-full flex items-center justify-between h-full px-4">
          {/* Назад/Вперёд */}
          <div className="hidden md:flex items-left">
            <button
            
              onClick={() => router.back()}
              className="no-drug rounded-full bg-[var(--bgPage)] flex items-center hover:opacity-75 hover:bg-rose-500 transition"
            >
              <RxCaretLeft className="text-[var(--text)]" size={35} />
            </button>
            <button
             
              onClick={() => router.forward()}
              className="no-drag rounded-full bg-[var(--bgPage)] flex items-center hover:opacity-75 hover:bg-rose-500 transition"
            >
              <RxCaretRight className="text-[var(--text)]" size={35} />
            </button>
          </div>

          {/* Центр */}
          <div id="nav-center" className="hidden md:flex flex gap-x-2 items-center justify-center flex-1">
            {route.map((item) => (
              <div key={item.label} className="drag-region">
                <div className="no-drag">
                  <SidebarItem
                    textColorActive="black"
                    className={twMerge(`rounded-full`)}
                    positionToolTipe="bottom"
                    {...item}
                  />
                </div>
              </div>
            ))}
            <SearchInput />
          </div>

          {/* Правая часть */}
          <div id="right-section" className="flex items-center gap-x-4 mr-30">
            {!hidePremium && (
              <Link
          
                href={"/premium"}
                className="no-drag hidden md:flex font-semibold bg-gradient-to-r from-violet-200 to-pink-200 text-black hover:opacity-100 hover:bg-white hover:scale-102 rounded-full px-4 py-1"
              >
                <h1 className="text-black text-sm whitespace-nowrap">
                  Узнать больше о Premium
                </h1>
              </Link>
            )}
            {!isElectron && (
              <Link
           
                href={"/download"}
                className="no-drag hidden md:block bg-transparent text-grey font-medium"
              >
                <SlCloudDownload className="text-neutral-400 rounded-full hover:text-white" size={25} />
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-x-4">
                <ProfileButton />
              </div>
            ) : (
              <div className="relative flex items-center gap-x-4">
                <ButtonLogin
                  onClick={() => {
                    setAuthMode("register");
                    setAuthModalOpen(true);
                  }}
                  className="no-drag bg-transparent text-neutral-300 font-medium px-4 py-2 md:px-5 md:py-2 text-sm md:text-base rounded-full whitespace-nowrap"
                >
                  Sign Up
                </ButtonLogin>
                <ButtonLogin
                  onClick={() => {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                  }}
              
                  className= "no-drag bg-white text-black font-semibold px-4 py-2 md:px-5 md:py-2 text-sm md:text-base rounded-full whitespace-nowrap"
                >
                  Log In
                </ButtonLogin>
              </div>
            )}
          </div>
        </div>

        {/* Модалка авторизации */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
        />

        {children}
      </div>
    </div>
  );
};

export default Header;
