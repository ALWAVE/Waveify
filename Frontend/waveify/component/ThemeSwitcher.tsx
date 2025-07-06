"use client";

import { useEffect, useState } from "react";

interface ThemeSwitcherProps {
  themeActiveted: string;
  src?: string; // Опциональное свойство src
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
      className="flex-col cursor-pointer hover:opacity-80 bg-[var(--bg)] text-[var(--text)] px-4 py-2 mr-2 rounded-lg flex items-center" // flex для выравнивания по центру
    >
      {src && ( // Условный рендеринг изображения
        <img
          src={src}
          alt={`${themeActiveted} theme icon`} // Добавляем alt для улучшения доступности
          className="h-24 w-40 shadow-md mr-2" // Добавляем отступ справа для картинки
        />
      )}
      {themeActiveted} theme
    </button>
  );
};

export default ThemeSwitcher;
