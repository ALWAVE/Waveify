
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    className?: string; // Сделаем className необязательным
    href: string; // Добавляем href в интерфейс
    children: React.ReactNode;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
    className,
    href,
    children,
    ...props
}) => {
    return (
        <Link
            href={href}
            className={twMerge(`
                w-full
                rounded-full
                bg-rose-500
                border
                border-transparent
                px-3
                py-2
                disabled:cursor-not-allowed
                disabled:opacity-50
                text-black
                font-bold
                hover:opacity-75
                transition
                hover:scale-105 cursor-pointer
            `, className)}
            {...props}
        >
            {children}
        </Link>
    );
};

ButtonLink.displayName = "ButtonLink"; // Имя компонента
export default ButtonLink;
