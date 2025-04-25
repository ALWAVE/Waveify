"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ThemeSwitcherProps {
  themeActiveted: string;
  src: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ themeActiveted, src }) => {
  const [theme, setTheme] = useState<string>("dark");
  
  // Инициализация темы при загрузке страницы из localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.add(`theme-${storedTheme}`);
    } else {
      // Если темы нет в localStorage, ставим тему по умолчанию
      document.documentElement.classList.add("theme-dark");
    }
  }, []);

  // Функция для переключения темы
  const toggleTheme = (newTheme: string) => {
    // Удаляем все темы с документа
    document.documentElement.classList.forEach((className) => {
      if (className.startsWith('theme-')) {
        document.documentElement.classList.remove(className);
      }
    });

    // Добавляем новую тему
    document.documentElement.classList.add(`theme-${newTheme}`);

    // Обновляем состояние темы
    setTheme(newTheme);

    // Сохраняем выбранную тему в localStorage
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={() => toggleTheme(themeActiveted)} // Переключаем на переданную тему
      className="cursor-pointer hover:opacity-80 bg-[var(--bg)] text-[var(--text)] px-4 py-2 mr-2 rounded-lg"
    >
      <img
        src={`${src}`}
        fill
        className=" h-24 w-40 shadow-md"
      />
      {themeActiveted} theme
    </button>
  );
};

export default ThemeSwitcher;
