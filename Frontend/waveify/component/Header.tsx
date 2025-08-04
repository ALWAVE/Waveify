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
import { GoDownload } from "react-icons/go";
import AuthModal from "./AuthModal";
import { useAuth } from "@/providers/AuthProvider";
import ProfileButton from "./ProfileButton";

import { twMerge } from "tailwind-merge";
import PageLoader from "./PageLoader";

import MobileMenuButton from "./MobileMenuButton";
import SmartLink from "./SmartLink";
import Tooltip from "./Tooltipe";
import { TbPointFilled } from "react-icons/tb";
import SearchInput from "./SearchInput";
import { BiSearch, BiSolidSearch } from "react-icons/bi";
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
      },
      // {
      //   icon: <BiSearch size={26} />,
      //   label: "Search",
      //   active: pathname === "/explore",
      //   href: "/explore",
      //   iconActive: <BiSolidSearch size={26}

      //   />
      // }
    ],
    [pathname]
  );

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
      if (screenWidth < 980) {
        setHideLogo(true);
      } else {
        setHideLogo(false);
      }
    }
  }, [user, screenWidth]);

  return (
    <div>
      <div
        className="drag-region  fixed top-0 left-0 w-full bg-[var(--bg)] p-3 flex items-center select-none relative"

      >
        {!hideLogo && <TitleBarLogo />}
        <div className="w-full flex items-center justify-between h-full px-4">
          {/* Назад/Вперёд */}

          <div className="block md:hidden">
            <MobileMenuButton />
          </div>

          <div className="hidden md:flex items-left">
            <button

              onClick={() => router.back()}
              className="no-drag rounded-full flex items-center active:scale-90 duration-150 active:opacity-70 hover:bg-rose-500 transition"
            >
              <RxCaretLeft className="text-[var(--text)]" size={35} />
            </button>
            <button

              onClick={() => router.forward()}
              className="no-drag rounded-full flex items-center active:scale-90 duration-150 active:opacity-70  hover:bg-rose-500 transition"
            >
              <RxCaretRight className="text-[var(--text)]" size={35} />
            </button>
          </div>

          {/* Центр */}
          <div id="nav-center" className="flex gap-x-2 items-center justify-center mr-2 ml-2 relative w-full max-w-lg ">
            {route.map((item) => (
              <div key={item.label} className="drag-region">
                <div className="no-drag">
                  <SidebarItem
                    textColorActive="[var(--bg)]"
                    className={twMerge(`rounded-full hover:scale-110 transition-all active:scale-98 active:opacity-85 duration-150 `)}
                    positionToolTipe="bottom"
                    {...item}
                  />

                </div>
              </div>
            ))}

            {screenWidth < 768 && (
              <SidebarItem
                icon={<BiSearch size={26} />}
                iconActive={<BiSolidSearch size={26} />}
                label="Search"
                href="/explore"
                active={pathname.startsWith("/explore")}
                positionToolTipe="bottom"
                className={twMerge("rounded-full hover:scale-105 no-drag")}
                textColorActive="black"
              />
            )}

            <SearchInput className="hidden md:block" />

          </div>

          {/* Правая часть */}
          <div
            id="right-section"
            className={twMerge(
              "flex items-center gap-x-4",
              isElectron ? "mr-30" : ""
            )}
          >
            {!hidePremium && (
              <SmartLink
                href={"/premium"}
                className=" no-drag hidden md:flex font-semibold bg-[var(--bgPage)] hover:text-black text-[var(--text)] 
                ring-1 ring-[var(--text)]/50 hover:bg-gradient-to-r from-violet-200 to-pink-200 
                hover:opacity-100 hover:bg-white rounded-full px-4 py-1 duration-2000"
              >
                <h1 className="text-base whitespace-nowrap">
                  Try Premium
                </h1>
              </SmartLink>
            )}
            {!isElectron && (
              <SmartLink

                href={"/download"}
                className="no-drag p-2 rounded-full text-[var(--text)]/60  hover:text-[var(--text)] bg-[var(--text)]/10 hidden md:block text-grey font-medium relative group"
              >
                <GoDownload className=" rounded-full " size={25} />
                <Tooltip label="Install" position="bottom" />
                <TbPointFilled className="position absolute top-1 left-7 text-red-500 opacity-70" />
              </SmartLink>
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
                  className="no-drag bg-transparent text-neutral-300 hover:text-[var(--text)] font-medium px-4 py-2 md:px-5 md:py-2 text-sm md:text-base rounded-full whitespace-nowrap"
                >
                  Sign Up
                </ButtonLogin>
                <ButtonLogin
                  onClick={() => {
                    setAuthModalOpen(true);
                  }}

                  className="no-drag bg-white text-black font-semibold px-4 py-2 md:px-5 md:py-2 text-sm md:text-base rounded-full whitespace-nowrap"
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
      <PageLoader />
    </div>

  );
};

export default Header;
