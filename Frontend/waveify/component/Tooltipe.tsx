"use client";

import React from "react";

interface TooltipProps {
  label: string;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({ label, position = "bottom" }) => {
  const baseStyles = "absolute  bg-neutral-700 text-white text-sm px-3 py-1 rounded opacity-0 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 pointer-events-none whitespace-nowrap z-[19999]";

  const positionStyles = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };

  return (
    <div 
      className={`${baseStyles} ${positionStyles[position]}`}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
      }}
    >
      {label}
      {/* Добавляем стрелку */}
      <div className={`absolute w-2 h-2 bg-neutral-700 rotate-45 ${getArrowPosition(position)}`}></div>
    </div>
  );
};

// Функция для позиционирования стрелки
function getArrowPosition(position: string): string {
  switch(position) {
    case "top":
      return "bottom-[-2px] left-1/2 -translate-x-1/2";
    case "bottom":
      return "top-[-2px] left-1/2 -translate-x-1/2";
    case "left":
      return "right-[-2px] top-1/2 -translate-y-1/2";
    case "right":
      return "left-[-2px] top-1/2 -translate-y-1/2";
    default:
      return "";
  }
}

export default Tooltip;