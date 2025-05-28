"use client";
import useLocalFiles from "@/hooks/useLocalFiles";
import { useMemo, useState } from "react";
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";

const YourFiles = () => {
  const { files, loading } = useLocalFiles();
  const [sortAsc, setSortAsc] = useState(true);

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) =>
      sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
  }, [files, sortAsc]);

  return (
    <div className="p-4 text-[var(--text)]">
      <h1 className="text-xl font-bold mb-4">Локальные файлы</h1>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-neutral-400">{files.length} файлов найдено</p>
        <button onClick={() => setSortAsc(!sortAsc)} className="text-neutral-300 hover:text-white">
          {sortAsc ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
        </button>
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : sortedFiles.length === 0 ? (
        <p>Файлы не найдены</p>
      ) : (
        <ul className="space-y-2">
          {sortedFiles.map((file, idx) => (
            <li
              key={file.path}
              className="p-2 rounded-lg bg-[var(--bg)] hover:bg-[var(--hover)] transition"
            >
              <div className="flex justify-between items-center">
                <span>{idx + 1}. {file.title}</span>
                {/* кнопка воспроизведения или другое действие */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YourFiles;
