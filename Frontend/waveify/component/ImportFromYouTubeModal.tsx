// components/ImportFromYouTubeModal.tsx
"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/libs/apiClient";

type Props = {
  open: boolean;
  onClose: () => void;
  youtubeUrl: string;
  format: "mp3" | "wav";
  meta: { title: string; author?: string; duration?: string; thumbnail?: string };
};

const GENRES = [
  "Trap", "Hip-Hop", "Rap", "Rnb", "Opium", "Memphis", "Dark", "Pop", "Rock", "Ambient",
  "Drill", "Jazz", "Funk", "Lo-fi"
];

const VIBES = [
  "Joyfully", "Energetic", "Quietly", "Sad"
];

export default function ImportFromYouTubeModal({ open, onClose, youtubeUrl, format, meta }: Props) {
  const [title, setTitle] = useState(meta.title || "");
  const [genre, setGenre] = useState("");
  const [vibe, setVibe] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(meta.title || "");
    setGenre("");
    setVibe("");
    setErr(null);
  }, [open, meta.title]);

  const canSubmit = title.trim().length > 0 && genre && vibe;

  const onConfirm = async () => {
    if (!canSubmit) {
      setErr("Выберите жанр и вайб, и проверьте название.");
      return;
    }
    try {
      setLoading(true);
      setErr(null);
      const res = await apiFetch(`/api/YouTube/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: youtubeUrl,
          format,
          titleOverride: title.trim(),
          genre,
          vibe,
          tagIds: [] // если нужны теги, сюда
        }),
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Ошибка импорта"));
      onClose();
    } catch (e: any) {
      setErr(e?.message || "Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-[var(--bgPage)] p-5 shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Импорт из YouTube</h3>

        {meta.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={meta.thumbnail} alt="cover" className="w-full max-h-60 object-cover rounded-xl mb-3" />
        )}

        <div className="grid gap-3">
          <input
            className="px-3 py-2 rounded bg-[var(--transparent)] border"
            placeholder="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              className="px-3 py-2 rounded bg-[var(--transparent)] border"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">— Выбрать жанр —</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <select
              className="px-3 py-2 rounded bg-[var(--transparent)] border"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
            >
              <option value="">— Выбрать вайб —</option>
              {VIBES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="text-sm opacity-70">
            Формат: {format.toUpperCase()} • Длительность: {meta.duration ?? "—"}
          </div>
        </div>

        {err && <div className="text-red-500 mt-3">{err}</div>}

        <div className="mt-5 flex justify-end gap-3">
          <button className="px-4 py-2 rounded-xl border" onClick={onClose} disabled={loading}>
            Отмена
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-rose-600 text-white disabled:opacity-60"
            onClick={onConfirm}
            disabled={loading || !canSubmit}
            title={!canSubmit ? "Укажите жанр и вайб" : ""}
          >
            {loading ? "Импортируем..." : "Импортировать"}
          </button>
        </div>
      </div>
    </div>
  );
}
