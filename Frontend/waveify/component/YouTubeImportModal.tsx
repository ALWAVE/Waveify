"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "./Modal";
import Input from "./Input";
import ButtonLogin from "./ButtonLogin";
import GenreSelect from "./GenreSelect";
import useYouTubeImportModal from "@/hooks/useYouTubeImportModal";
import { useAuth } from "@/providers/AuthProvider";

const vibes = ["Joyfully", "Energetic", "Quietly", "Sad"] as const;

export default function YouTubeImportModal() {
  const { isOpen, onClose } = useYouTubeImportModal();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<"mp3" | "wav">("mp3");

  // метаданные
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [duration, setDuration] = useState<string | undefined>(undefined);

  // thumbnail: храним и "сырой" (от ютуба), и проксированный (для превью)
  const [rawThumb, setRawThumb] = useState<string | undefined>(undefined);
  const [previewThumb, setPreviewThumb] = useState<string | undefined>(undefined);

  // жанр/вайб
  const [genre, setGenre] = useState("");
  const [vibe, setVibe] = useState<string>("");

  const canUseWav = !!user?.isPremium;

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setUrl("");
      setFormat("mp3");
      setTitle("");
      setAuthor("");
      setDuration(undefined);
      setRawThumb(undefined);
      setPreviewThumb(undefined);
      setGenre("");
      setVibe("");
    }
  }, [isOpen]);

  const fetchMeta = async () => {
    if (!url.trim()) {
      toast.error("Вставьте ссылку на YouTube");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://77.94.203.78:5000/api/YouTube/metadata?url=${encodeURIComponent(url)}`,
        { credentials: "include" }
      );
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Не удалось получить метаданные");
      }
      const data = await res.json();

      const t = (data?.title ?? "").toString();
      const a = (data?.author ?? "").toString();
      const d = (data?.duration ?? undefined) as string | undefined;
      const th = (data?.thumbnail ?? undefined) as string | undefined;

      setTitle(t);
      setAuthor(a);
      setDuration(d);

      // сохраним сырой URL, а для превью используем прокси
      if (th && th.trim() !== "") {
        setRawThumb(th);
        setPreviewThumb(
          `http://77.94.203.78:5000/api/YouTube/proxy-image?url=${encodeURIComponent(th)}`
        );
      } else {
        setRawThumb(undefined);
        setPreviewThumb(undefined);
      }

      toast.success("Метаданные получены");
    } catch (e: any) {
      toast.error(e?.message || "Ошибка при получении метаданных");
    } finally {
      setIsLoading(false);
    }
  };

  const createFromYouTube = async () => {
    if (!user?.id) return toast.error("Войдите в аккаунт");
    if (!url.trim()) return toast.error("Вставьте ссылку");
    if (format === "wav" && !canUseWav) return toast.error("WAV только для премиум");

    if (!title.trim()) return toast.error("Введите Title");
    if (!author.trim()) return toast.error("Введите Author");
    if (!genre) return toast.error("Выберите жанр");
    if (!vibe) return toast.error("Выберите Vibe");

    setIsLoading(true);
    try {
      const body = {
        url,
        format,
        titleOverride: title,     // <- редактированное название
        genre,
        vibe,
        tagIds: [] as string[],   // при необходимости
        thumbnailUrl: rawThumb ?? null, // <- КЛЮЧЕВОЕ: отдаем сырой URL превью
      };

      const res = await fetch("http://77.94.203.78:5000/api/YouTube/import", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Импорт не удался");
      }

      // можно использовать ответ для UI
      // const data = await res.json().catch(() => ({}));

      toast.success("Импорт запущен! Трек на модерации 🎧");
      onClose();

      // если ты на странице модерации — обновим
      setTimeout(() => {
        if (window.location.pathname === "/moderator-section") {
          window.location.reload();
        }
      }, 300);
    } catch (e: any) {
      toast.error(e?.message || "Ошибка импорта");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create from YouTube"
      description="Сервер сам скачает и создаст трек"
      isOpen={isOpen}
      onChange={(open) => { if (!open) onClose(); }}
    >
      <div className="flex flex-col gap-4">
          <Input
            id="yt_url"
            placeholder="Вставьте ссылку на YouTube"
            value={url}
            disabled={isLoading}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
        <div className="flex gap-2">
        
          <select
            className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700"
            value={format}
            disabled={isLoading || (!canUseWav && format === "wav")}
            onChange={(e) => setFormat(e.target.value as "mp3" | "wav")}
          >
            <option value="mp3">MP3</option>
            <option value="wav" disabled={!canUseWav}>
              WAV {canUseWav ? "" : "(Premium)"}
            </option>
          </select>
          <ButtonLogin disabled={isLoading || !url.trim()} onClick={fetchMeta}>
            {isLoading ? "Loading..." : "Fetch"}
          </ButtonLogin>
        </div>

        {(title || author || previewThumb) && (
          <div className="flex gap-3 items-start">
            {previewThumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewThumb}
                alt="cover"
                className="w-24 h-24 object-cover rounded-lg border border-neutral-700"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/cover-placeholder.jpg";
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-neutral-800/70 grid place-items-center text-xs opacity-70">
                Нет обложки
              </div>
            )}

            <div className="flex-1 space-y-2">
              <Input
                id="yt_title"
                placeholder="Title"
                value={title}
                disabled={isLoading}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                id="yt_author"
                placeholder="Author"
                value={author}
                disabled={isLoading}
                onChange={(e) => setAuthor(e.target.value)}
              />
              {duration && (
                <p className="text-xs text-neutral-400">Длительность: {duration}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <h3 className="pb-1 font-semibold">Select Genre:</h3>
          <GenreSelect
            value={genre}
            onChange={setGenre}
            className={!genre ? "ring-2 ring-rose-500 rounded-lg" : ""}
          />
          {!genre && <p className="mt-1 text-xs text-rose-400">Выберите жанр</p>}
        </div>

        <div>
          <h3 className="pb-1 font-semibold">Select Vibe:</h3>
          <div className={`flex flex-wrap gap-2 ${!vibe ? "ring-2 ring-rose-500 rounded-lg p-1" : ""}`}>
            {vibes.map((v) => (
              <label
                key={v}
                className="flex items-center cursor-pointer hover:bg-rose-500 rounded-lg px-3 py-2 bg-neutral-800 text-white transition-all text-sm"
              >
                <input
                  type="radio"
                  value={v}
                  checked={vibe === v}
                  onChange={() => setVibe(v)}
                  className="mr-2 accent-rose-500"
                />
                {v}
              </label>
            ))}
          </div>
          {!vibe && <p className="mt-1 text-xs text-rose-400">Выберите Vibe</p>}
        </div>

        <ButtonLogin
          type="button"
          onClick={createFromYouTube}
          className="hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create from YouTube"}
        </ButtonLogin>
      </div>
    </Modal>
  );
}
