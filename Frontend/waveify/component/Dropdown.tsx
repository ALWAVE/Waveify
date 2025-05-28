// import Link from "next/link";
// import { twMerge } from "tailwind-merge";
// import React, { useState } from "react";
// import Tooltip from "./Tooltipe";


// interface DropdownLink {
//   label: string;
//   href?: string;
//   onClick?: () => void;
// }

// interface DropdownProps {
//   className?: string;
//   icon: React.ReactNode;
//   iconActive?: React.ReactNode;
//   label: string;
//   active?: boolean;
//   href?: string;
//   positionToolTipe?: "top" | "bottom" | "left" | "right";
//   textColorActive?: string;
//   onClick?: () => void;
//   isButton?: boolean;
//   dropdownLinks?: DropdownLink[]; // Проп для выпадающего списка
// }

// const Dropdown: React.FC<DropdownProps> = ({
//   className,
//   icon,
//   label,
//   active,
 
//   positionToolTipe,
//   iconActive,
//   textColorActive,
//   onClick,
//   isButton = false,
//   dropdownLinks,
// }) => {
//   const [clicked, setClicked] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const handleClick = () => {
//     setClicked(true);
//     setTimeout(() => setClicked(false), 100);

//     if (onClick) onClick();
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const baseClasses = twMerge(
//     `
//     flex flex-row
//     h-auto justify-center
//     w-auto gap-x-4
//     text-md font-medium
//     cursor-pointer hover:text-white
//     transition text-neutral-400
//     py-1 
//     bg-[var(--bgPage)]
//     hover:bg-rose-500
//     rounded-xl
//     border-transparent border-1 py-2 px-2
//     ${clicked ? 'opacity-75 scale-105' : 'opacity-100 scale-100'}
//   `,
//     active && `text-${textColorActive} bg-rose-500`,
//     className
//   );

//   return (
//     <div className="relative group">
//       {isButton ? (
//         <button onClick={handleClick} className={baseClasses}>
//           {active ? iconActive : icon}
//         </button>
//       ) : (
//         <Link href={href} onClick={handleClick} className={baseClasses}>
//           {active ? iconActive : icon}
//         </Link>
//       )}
//       <Tooltip position={positionToolTipe} label={label} />
      
//       {/* Кнопка для открытия выпадающего списка */}
    

//       {/* Выпадающий список */}
//       {isDropdownOpen && dropdownLinks && (
//         <div onClick={toggleDropdown} className="absolute z-10 bg-white border rounded shadow-md mt-2">
//           <ul className="py-1">
//             {dropdownLinks.map((link, index) => (
//               <li key={index}>
//                 {link.href ? (
//                   <Link href={link.href} className="block px-4 py-2 hover:bg-gray-200">
//                     {link.label}
//                   </Link>
//                 ) : (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // Остановить всплытие события, чтобы не закрыть дропдаун
//                       if (link.onClick) link.onClick();
//                     }}
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-200"
//                   >
//                     {link.label}
//                   </button>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dropdown;
