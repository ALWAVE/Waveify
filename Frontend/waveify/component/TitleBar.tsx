"use client";  // Компонент работает только на клиенте

import { useEffect, useState } from "react";
import { IoIosSquareOutline } from "react-icons/io";
import { BsDashLg } from "react-icons/bs";
import { CgClose } from "react-icons/cg";

const TitleBar = () => {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(typeof window !== "undefined" && window.electron); // Проверяем, Electron ли это
  }, []);

  if (!isElectron) return null; // 🚨 В Web-версии не показываем TitleBar

  const handleClose = () => window.electron.send("close-app");
  const handleMinimize = () => window.electron.send("minimize-app");
  const handleMaximize = () => window.electron.send("maximize-app");

  return (
    <div
      className="no-drag absolute top-0 mt-3 right-0 flex select-none bg-[var(--bg)] "
  
    >

      <button id="minimize-btn" className=" px-3 py-2 text-[var(--text)] hover:bg-neutral-700" onClick={handleMinimize}>
        <BsDashLg size={17} />
      </button>
      <button id="maximize-btn" className="  px-3 py-2 text-[var(--text)] hover:bg-orange-400" onClick={handleMaximize}>
        <IoIosSquareOutline size={17} />
      </button>
      <button id="close-btn" className=" px-3 py-2 text-xl text-[var(--text)] bg-transparent hover:bg-red-600 transition" onClick={handleClose}>
        <CgClose size={17} />
      </button>
      
    </div>
  );
};

export default TitleBar;
