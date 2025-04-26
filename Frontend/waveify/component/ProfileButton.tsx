import { useState, useRef, useEffect } from "react";
import Tooltipe from "./Tooltipe";
import { useAuth } from "@/providers/AuthProvider";
import { TbExternalLink } from "react-icons/tb";
import { GoArrowUpRight } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { IoMdExit } from "react-icons/io";
import { TiMinus } from "react-icons/ti";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import { gradientMap } from '@/libs/gradients';
import Tooltip from "./Tooltipe";

declare global {
    interface Window {
        electron?: any;
    }
}


const isElectron = typeof window !== "undefined" && !!window.electron;

const ProfileButton = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [ipcRenderer, setIpcRenderer] = useState<any>(null);

    useEffect(() => {
        if (isElectron) {
            setIpcRenderer(window.electron);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const changeZoom = (delta: number) => {
        if (ipcRenderer) {
            let newZoom = Math.max(0, Math.min(200, zoomLevel + delta));
            ipcRenderer.setZoom(newZoom / 100);
            setZoomLevel(newZoom);
        }
    };

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
                        <div className="text-[var(--text)]">{user?.userName} </div>
                        
                        <span className="cursor-pointer relative group">🛡️ 
                            <Tooltip label = {user.role} ></Tooltip>
                        </span>
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

                    <Link href={"/profile"} className="flex items-center text-neutral-400 cursor-pointer hover:text-white w-[calc(100%-1rem)] mx-2 block text-left px-4 py-2 text-sm rounded-lg hover:bg-neutral-700 transition">
                        <FaRegUserCircle className="mr-2" size={20} />
                        Профиль
                    </Link>

                    <hr className="my-1 mx-3 border-t-[0.5px] border-neutral-600" />

                    <Link href={"/settings"} className="flex items-center text-neutral-400 cursor-pointer hover:text-white w-[calc(100%-1rem)] mx-2 block text-left px-4 py-2 text-sm rounded-lg hover:bg-neutral-700 transition">
                        <CiSettings className="mr-2" size={20} />
                        Параметры
                    </Link>

                    {isElectron && ipcRenderer && (
                        <>
                            <hr className="my-1 mx-3 border-t-[0.5px] border-neutral-600" />

                            <div className=" text-neutral-400 flex justify-between items-center px-3 py-2">
                                <button
                                    onClick={() => changeZoom(-10)}
                                    className="cursor-pointer hover:text-white text-neutral-400 px-2 py-2 text-sm rounded-full hover:bg-neutral-600 hover:scale-110 hover:bg-gray-600 transition"
                                >
                                    <TiMinus size={14} />
                                </button>
                                <span className="text-sm text-[var(--text)]">{zoomLevel}%</span>
                                <button
                                    onClick={() => changeZoom(10)}
                                    className="cursor-pointer text-neutral-400 hover:text-white px-2 py-2 text-sm rounded-full hover:bg-neutral-600 hover:scale-110 hover:bg-gray-600 transition"
                                >
                                    <FaPlus size={14} />
                                </button>
                            </div>
                        </>
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
