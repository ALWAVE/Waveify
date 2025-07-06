import { useState, useRef, useEffect } from "react";
import Tooltipe from "./Tooltipe";
import { useAuth } from "@/providers/AuthProvider";
import { TbExternalLink } from "react-icons/tb";
import { GoArrowUpRight } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { IoMdExit } from "react-icons/io";

import Link from "next/link";
import { gradientMap } from '@/libs/gradients';
import Tooltip from "./Tooltipe";
import SmartLink from "./SmartLink";
import { MdOutlineAddModerator  } from "react-icons/md";

const ProfileButton = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    let label;

    switch (user.role) {
    case 0:
        label = "User";
        break;
    case 1:
        label = "Artist";
        break;
    case 2:
        label = "Beatmaker";
        break;
    case 3:
        label = "Moderator";
        break;
    case 4:
        label = "Label";
        break;
    default:
        label = "Guest";
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    // Условие для градиента
    const hasPremiumSubscription = user?.subscription;

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button

                onClick={() => setIsOpen(!isOpen)}
                className={`no-drag relative group hover:scale-110 cursor-pointer text-[var(--text)] font-semibold px-4 py-2 rounded-full transition p-4 ${hasPremiumSubscription
                    ? gradientMap[user?.subColor as keyof typeof gradientMap] // Градиент для кнопки
                    : "bg-[var(--bgProfile)]" // Стандартный фон
                    }`}
            >
                <Tooltipe label={`${user?.userName || "Аноним"}`} />
                {user?.userName ? user.userName.charAt(0).toUpperCase() : "?"}
            </button>

            {isOpen && (
                <div className="absolute right-[-15px] mt-2 w-58 bg-[var(--bgProfile)] text-white rounded-lg shadow-lg z-50">

                    <div className="flex items-centert justify-left pt-4 px-6 text-sm ">
                        <div className="text-[var(--text)] relative group">{user?.userName} 
                            <Tooltip label={label}></Tooltip>
                        </div>

                    </div>


                    {/* Применение градиента к text-субтитлу, если у пользователя Premium подписка */}
                    <div
                        className={`px-6 text-sm ${hasPremiumSubscription ? `font-black bg-clip-text text-transparent ${gradientMap[user?.subColor as keyof typeof gradientMap]}` : "text-neutral-400"
                            }`}
                    >
                        {user?.subTitle}
                    </div>
                    <p className="px-6 pb-2 text-neutral-400 text-sm">
                        {user.subEndDate ? "Подписка до: " + new Date(user.subEndDate).toLocaleDateString() : ""}
                    </p>
                    <Link
                        href={"/premium"}
                        className="flex items-center hover:scale-98 bg-white text-black font-semibold rounded-full cursor-pointer hover:font-semibold hover:text-black w-[calc(100%-1rem)] mx-2 block text-left px-4 py-2 text-sm hover:bg-gradient-to-r from-violet-200 to-pink-300 transition"
                    >
                        <GoArrowUpRight className="mr-2" size={20} />
                        Upgrade plan
                    </Link>

                    <hr className="my-1 mx-3 border-t-[0.5px] border-neutral-600" />

                    <button className="flex items-center text-neutral-400 cursor-pointer hover:text-rose-500 hover:underline w-[calc(100%-1rem)] mx-2 block text-left px-4 py-2 text-sm rounded-lg hover:bg-neutral-700 transition">
                        <TbExternalLink className="mr-2" size={20} />
                        Аккаунт
                    </button>
                    <hr className="my-1 mx-3 border-t-[0.5px] border-neutral-600" />
                    <SmartLink href={`/profile/${user.id}`} className="flex items-center text-neutral-400 cursor-pointer hover:text-[var(--text)] w-[calc(100%-1rem)] mx-2 block text-left px-4 py-2 text-sm rounded-lg hover:bg-[var(--bg)] transition">
                        <FaRegUserCircle className="mr-2" size={20} />
                        Профиль
                    </SmartLink>

                    <SmartLink href={"/settings"} className="flex items-center text-neutral-400 cursor-pointer hover:text-[var(--text)] w-[calc(100%-1rem)] mx-2 block text-left px-4 py-2 text-sm rounded-lg  hover:bg-[var(--bg)] transition">
                        <CiSettings className="mr-2" size={20} />
                        Параметры
                    </SmartLink>
                    {label === "Moderator" && (
                        <SmartLink
                            href="/moderator-section"
                            className="flex items-center text-neutral-400 cursor-pointer hover:text-[var(--text)] w-[calc(100%-1rem)] mx-2 block text-left px-4 py-2 text-sm rounded-lg hover:bg-[var(--bg)] transition"
                        >
                            <MdOutlineAddModerator  className="mr-2" size={20} />
                            Модерация
                        </SmartLink>
                        )}

                      


                    <hr className="my-1 mx-3 border-t-[0.5px] border-neutral-600" />

                    <button
                        onClick={logout}
                        className="flex items-center text-neutral-400 hover:text-white cursor-pointer w-[calc(100%-1rem)] mb-2 mx-2 block text-left px-4 py-2 text-sm rounded-lg hover:bg-red-600 transition"
                    >
                        <IoMdExit className="mr-2" size={20} />
                        Выйти
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileButton;
