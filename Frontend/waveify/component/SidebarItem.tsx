import Link from "next/link";
import { twMerge } from "tailwind-merge";
import React, { useState } from "react";
import Tooltip from "./Tooltipe";



interface SidebarItemProps {
  className?: string;
  icon: React.ReactNode;
  iconActive?: React.ReactNode;
  label: string;
  active?: boolean;
  href?: string;
  positionToolTipe?: "top" | "bottom" | "left" | "right"; // или если там любые строки, тогда просто string
  textColorActive?: string;
  bgColorActive?: string;
  onClick?: () => void;
  isButton?: boolean;
}
const SidebarItem: React.FC<SidebarItemProps> = ({
  className,
  icon,
  label,
  active,
  href = "#",
  positionToolTipe,
  iconActive,
  textColorActive,
 
  onClick,
  isButton = false,
}) => {
  const [clicked, setClicked] = useState(false);
 
  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 100);

    if (onClick) onClick();
  };

  const baseClasses = twMerge(
    `
    flex flex-row
    h-auto justify-center
    w-auto gap-x-4
    text-md font-medium
    cursor-pointer hover:text-white
    transition text-neutral-400
    py-1 
    bg-[var(--bgPage)]
    hover:bg-rose-500
    rounded-xl
    border-transparent border-1 py-2 px-2 hover:scale-105
    ${clicked ? 'opacity-75 scale-105' : 'opacity-100 scale-100'}
  `,
    active && `text-${textColorActive} bg-rose-500`,
    className
  );

  return (
    <div className="relative group">
      {isButton ? (
        <button onClick={handleClick} className={baseClasses}>
          {active ? iconActive : icon}
        </button>
      ) : (
        <Link href={href} onClick={handleClick} className={baseClasses}>
          {active ? iconActive : icon}
        
        </Link>
      )}
      <Tooltip position={positionToolTipe} label={label} />
    </div>
  );
};

export default SidebarItem;

