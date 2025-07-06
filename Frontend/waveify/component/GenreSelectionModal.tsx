"use client";

import Modal from "./Modal";
import { useState } from "react";
import { Check, Music } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface GenreSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (genres: string[]) => void;
}

const ALL_GENRES = [
  "Trap", "Hip-Hop", "Rap", "Rnb", "Opium", "Memphis", "Dark",
  "Pop", "Rock", "Ambient", "Drill", "Jazz", "Funk", "Lo-fi"
];

const GenreSelectModal: React.FC<GenreSelectModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    setSelected((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      onSave(selected);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onChange={(open) => {
        if (!open) onClose();
      }}
      title="Выберите любимые жанры"
      description="Выберите хотя бы один жанр, который вам нравится — мы подберем подходящую музыку"
    >
      <div className="flex flex-wrap gap-2 justify-center">
        {ALL_GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={twMerge(
              "px-4 py-2 rounded-full border text-sm flex items-center gap-1 transition",
              selected.includes(genre)
                ? "bg-rose-500 text-white border-rose-500"
                : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-white"
            )}
          >
            <Music className="w-4 h-4" />
            {genre}
            {selected.includes(genre) && <Check className="w-4 h-4" />}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="bg-white text-black font-semibold py-2 px-6 rounded-full hover:opacity-90 transition active:scale-95 disabled:opacity-50"
        >
          Продолжить
        </button>
      </div>
    </Modal>
  );
};

export default GenreSelectModal;
