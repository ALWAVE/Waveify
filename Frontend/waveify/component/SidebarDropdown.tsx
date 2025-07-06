import Link from "next/link";
import { twMerge } from "tailwind-merge";
import React, { useState } from "react";
import Tooltip from "./Tooltipe";
import { useAuth } from "@/providers/AuthProvider";
import PleaseAuthModal from "./PleaseAuthModal";

interface SidebarDropdownProps {
    className?: string;
    icon: React.ReactNode;
    iconActive?: React.ReactNode;
    label: string;
    active?: boolean;
    items: {
        iconItem: React.ReactNode; // Изменено на React.ReactNode для иконки
        label: string;
        href?: string;
        description?: string; // Поле description
        premium?: boolean;
        onClick?: () => void;
    }[]; // Элементы выпадающего меню
    positionToolTipe?: "top" | "bottom" | "left" | "right";
    textColorActive?: string;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
    className,
    icon,
    label,
    active,
    items,
    positionToolTipe,
    iconActive,
    textColorActive,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true); // Состояние для управления отображением Tooltip
    const { user } = useAuth(); // Получите пользователя из контекста
    const [isModalOpen, setModalOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const handleMouseEnter = () => {
        setShowTooltip(false); // Скрываем Tooltip при наведении на Dropdown
    };

    const handleMouseLeave = () => {

        setShowTooltip(true); // Показываем Tooltip, когда курсор уходит с Dropdown

    };
 const handleItemClick = (item: any) => {
        if (!user && item.onClick) {
            // Если пользователь не авторизован, открываем модалку
            setModalOpen(true);
        } else {
            // Выполняем действие, если пользователь авторизован
            item.onClick?.();
        }
    };
    const baseClasses = twMerge(
        `
    flex flex-row items-center
    h-auto justify-start
    gap-x-2
    text-md font-medium
    cursor-pointer hover:text-white
    transition text-neutral-400
    py-1 
    bg-[var(--bgPage)]
    rounded-xl
    border-transparent border-1 py-2 px-2
    active:scale-90
  `,
        isOpen ? 'bg-rose-500' : 'hover:bg-rose-500', // Меняем цвет фона при открытом меню
        active && `text-${textColorActive} bg-rose-500`,
        className
    );

    return (
        <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div onClick={toggleDropdown} className={baseClasses}>
                <div className="flex items-center">
                    { active ? iconActive : icon}
                </div>
            </div>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-84 bg-[var(--bgPage)] rounded-md shadow-lg z-10 p-5">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-start py-2 px-4 hover:bg-[var(--bg)] rounded-lg cursor-pointer text-[var(--text)] hover:text-rose-500">
                            {item.premium && (
                                <div className="absolute -right-0 -top-0 bg-pink-200 text-black font-bold text-xs rounded-full py-1 rotate-12 px-2 transform shadow-lg">
                                    Premium
                                </div>
                            )}
                            {item.onClick ? (
                                <button onClick={() => handleItemClick(item)} className="cursor-pointer flex items-start w-full text-left">
                                    <div className="flex items-start">
                                        <div className="mr-5 mt-2"> {/* Отступ между иконкой и текстом */}
                                            {item.iconItem} {/* Иконка слева */}
                                        </div>
                                        <div className="flex flex-col"> {/* Вертикальное расположение текста и описания */}
                                            <span>{item.label}</span> {/* Текст элемента */}
                                            {item.description && <span className="text-neutral-500 text-sm">{item.description}</span>} {/* Описание под текстом */}
                                        </div>
                                    </div>
                                </button>
                            ) : (
                                item.href ? ( // Проверяем, есть ли item.href
                                    <Link href={item.href} className="flex items-start w-full text-left">
                                        <div className="flex items-start">
                                            <div className="mr-5 mt-2"> {/* Отступ между иконкой и текстом */}
                                                {item.iconItem} {/* Иконка слева */}
                                            </div>
                                            <div className="flex flex-col"> {/* Вертикальное расположение текста и описания */}
                                                <span>{item.label}</span> {/* Текст элемента */}
                                                {item.description && <span className="text-neutral-500 text-sm">{item.description}</span>} {/* Описание под текстом */}
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex items-start w-full text-left">
                                        <div className="flex items-start">
                                            <div className="mr-5 mt-2"> {/* Отступ между иконкой и текстом */}
                                                {item.iconItem} {/* Иконка слева */}
                                            </div>
                                            <div className="flex flex-col"> {/* Вертикальное расположение текста и описания */}
                                                <span>{item.label}</span> {/* Текст элемента */}
                                                {item.description && <span className="text-neutral-500 text-sm">{item.description}</span>} {/* Описание под текстом */}
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showTooltip && <Tooltip position={positionToolTipe} label={label} />}
            <PleaseAuthModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default SidebarDropdown;
