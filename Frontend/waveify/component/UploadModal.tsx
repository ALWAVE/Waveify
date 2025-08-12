"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { parseBlob } from "music-metadata-browser";
import toast from "react-hot-toast";

import useUploadModal from "@/hooks/useUploadModal";
import { useAuth } from "@/providers/AuthProvider";
import Modal from "./Modal";
import Input from "./Input";
import ButtonLogin from "./ButtonLogin";
import GenreSelect from "./GenreSelect";

const vibes = ["Joyfully", "Energetic", "Quietly", "Sad"] as const;

type FormVals = {
  title: string;
  author: string;
  genre: string; // hidden
  vibe: string;
};

const bytesToMB = (n: number) => `${Math.max(1, Math.round(n / 1024 / 1024))} MB`;

const UploadModal: React.FC = () => {
  // ВАЖНО: берём prefill только из стора
  const { isOpen, onClose, prefill: storePrefill } = useUploadModal();
  const effPrefill = storePrefill; // просто для читаемости

  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [overrideSong, setOverrideSong] = useState<File | null>(null);
  const [overrideImage, setOverrideImage] = useState<File | null>(null);

  const songInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const { register, setValue, getValues, reset, formState: { errors } } = useForm<FormVals>({
    defaultValues: { title: "", author: "", genre: "", vibe: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!isOpen) return;
    setOverrideSong(null);
    setOverrideImage(null);

    setValue("title", effPrefill?.title ?? "");
    setValue("author", effPrefill?.author ?? "");
    setValue("vibe", effPrefill?.vibe ?? "");
    if (effPrefill?.genre) {
      setSelectedGenre(effPrefill.genre);
      setValue("genre", effPrefill.genre, { shouldValidate: true });
    } else {
      setSelectedGenre("");
      setValue("genre", "", { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, effPrefill]);

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setSelectedGenre("");
      setOverrideSong(null);
      setOverrideImage(null);
      onClose();
    }
  };

  // Итоговые файлы: override > prefill
  const resolvedSong: File | undefined = overrideSong ?? effPrefill?.songFile ?? undefined;
  const resolvedImage: File | undefined = overrideImage ?? effPrefill?.imageFile ?? undefined;

  const coverPreviewUrl = useMemo(() => {
    const f = resolvedImage;
    return f ? URL.createObjectURL(f) : null;
  }, [resolvedImage]);

  useEffect(() => {
    return () => { if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl); };
  }, [coverPreviewUrl]);

  const submit = async () => {
    console.log("[Upload] Create clicked");
    if (isLoading) return;

    const vals = getValues();
    const title = (vals.title || "").trim();
    const author = (vals.author || "").trim();
    const vibe = (vals.vibe || "").trim();
    const songFile = resolvedSong;
    const imageFile = resolvedImage;

    console.log("[Upload] values", { title, author, vibe, selectedGenre, hasSong: !!songFile, hasImage: !!imageFile, userId: user?.id });

    if (!title) { toast.error("Введите Title"); return; }
    if (!author) { toast.error("Введите Author"); return; }
    if (!selectedGenre) { toast.error("Выберите жанр"); return; }
    if (!vibe) { toast.error("Выберите Vibe"); return; }
    if (!songFile) { toast.error("Аудиофайл обязателен"); return; }
    if (!imageFile) { toast.error("Обложка обязательна"); return; }

    const tryRefresh = async () => {
      try {
        console.log("[Upload] trying refresh-token…");
        const r = await fetch("http://77.94.203.78:5000/api/User/refresh-token", {
          method: "POST",
          credentials: "include",
        });
        console.log("[Upload] refresh status", r.status);
        return r.ok;
      } catch (e) {
        console.warn("[Upload] refresh failed", e);
        return false;
      }
    };

    const doUpload = async (): Promise<Response | null> => {
      let duration = "00:00:00";
      try {
        const meta = await parseBlob(songFile);
        const sec = meta?.format?.duration ?? 0;
        if (sec && Number.isFinite(sec)) duration = new Date(sec * 1000).toISOString().substring(11, 19);
      } catch (e) {
        console.warn("[Upload] parseBlob failed:", e);
      }

      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Author", author);
      formData.append("Duration", duration);
      formData.append("Genre", selectedGenre);
      formData.append("Vibe", vibe);
      formData.append("File", songFile);
      formData.append("Image", imageFile);

      console.log("[Upload] POST /Song/upload payload", {
        title, author, duration, selectedGenre, vibe,
        songSize: songFile.size, imageSize: imageFile.size
      });

      try {
        const res = await fetch("http://77.94.203.78:5000/Song/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        console.log("[Upload] upload status", res.status);

        if (res.status === 401 || res.status === 403) {
          const ok = await tryRefresh();
          if (ok) {
            const res2 = await fetch("http://77.94.203.78:5000/Song/upload", {
              method: "POST",
              body: formData,
              credentials: "include",
            });
            console.log("[Upload] reupload after refresh status", res2.status);
            return res2;
          }
        }
        return res;
      } catch (e: any) {
        console.warn("[Upload] network error, retry soon", e?.message || e);
        await new Promise(r => setTimeout(r, 800));
        try {
          const res = await fetch("http://77.94.203.78:5000/Song/upload", {
            method: "POST",
            body: formData,
            credentials: "include",
          });
          console.log("[Upload] upload after retry status", res.status);
          return res;
        } catch (e2) {
          console.error("[Upload] network failed again", e2);
          return null;
        }
      }
    };

    setIsLoading(true);
    try {
      if (!user?.id) {
        const ok = await tryRefresh();
        if (!ok) { toast.error("Авторизуйтесь, чтобы загрузить трек"); return; }
      }

      const res = await doUpload();
      if (!res) { toast.error("Сеть отвалилась. Попробуйте ещё раз"); return; }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("[Upload] failed:", res.status, txt);
        toast.error(`Не удалось загрузить трек (${res.status})`);
        return;
      }

      toast.success("Трек загружен! Он отправлен на модерацию 🎧");
      onClose();
      reset();
      setSelectedGenre("");
      setOverrideSong(null);
      setOverrideImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const errText = "mt-1 text-xs text-rose-400";
  const errRing = "ring-2 ring-rose-500";

  return (
    <Modal title="Add a song" description="Upload an mp3 file" isOpen={isOpen} onChange={onChange}>
      <form className="flex flex-col gap-y-4" onSubmit={(e) => e.preventDefault()} noValidate>
        <div>
          <Input
            id="title"
            disabled={isLoading}
            {...register("title", { required: "Введите название трека" })}
            placeholder="Song title"
            className={errors.title ? errRing : ""}
          />
          {errors.title && <p className={errText}>{String(errors.title.message)}</p>}
        </div>

        <div>
          <Input
            id="author"
            disabled={isLoading}
            {...register("author", { required: "Введите автора" })}
            placeholder="Song author"
            className={errors.author ? errRing : ""}
          />
          {errors.author && <p className={errText}>{String(errors.author.message)}</p>}
        </div>

        {coverPreviewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverPreviewUrl} alt="cover" className="w-full max-h-60 object-cover rounded-xl" />
        )}

        <div>
          <h3 className="pb-1 font-semibold">Select Genre:</h3>
          <GenreSelect
            value={selectedGenre}
            onChange={(v) => {
              setSelectedGenre(v);
              setValue("genre", v, { shouldValidate: true });
            }}
            className={!selectedGenre ? "ring-2 ring-rose-500 rounded-lg" : ""}
          />
          <input type="hidden" {...register("genre", { required: "Выберите жанр" })} />
          {!selectedGenre && <p className={errText}>Выберите жанр</p>}
        </div>

        <div>
          <h3 className="pb-1 font-semibold">Select Vibe:</h3>
          <div className={`flex flex-wrap gap-2 ${errors.vibe ? "ring-2 ring-rose-500 rounded-lg p-1" : ""}`}>
            {vibes.map((vibe) => (
              <label key={vibe} className="flex items-center cursor-pointer hover:bg-rose-500 rounded-lg px-3 py-2 bg-neutral-800 text-white transition-all text-sm">
                <input type="radio" value={vibe} {...register("vibe", { required: "Выберите Vibe" })} className="mr-2 accent-rose-500" />
                {vibe}
              </label>
            ))}
          </div>
          {errors.vibe && <p className={errText}>{String(errors.vibe.message)}</p>}
        </div>

        {/* SONG */}
        <div className="space-y-2">
          <div className="pb-1">Select a song file {resolvedSong ? "(предзаполнено)" : ""}</div>

          {resolvedSong ? (
            <div className="flex items-center justify-between bg-neutral-800/60 border border-neutral-700 rounded-xl p-3">
              <div className="min-w-0">
                <div className="truncate font-medium">{resolvedSong.name}</div>
                <div className="text-xs opacity-70">{bytesToMB(resolvedSong.size)}</div>
              </div>
              <button
                type="button"
                onClick={() => songInputRef.current?.click()}
                className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600"
                disabled={isLoading}
              >
                Выбрать другой
              </button>
            </div>
          ) : (
            <>
              <Input
                id="song"
                type="file"
                disabled={isLoading}
                accept=".mp3,.wav"
                ref={songInputRef as any}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const f = e.target.files?.[0] || null;
                  setOverrideSong(f);
                }}
                className={!resolvedSong ? errRing : ""}
              />
              {!resolvedSong && <p className={errText}>Выберите файл</p>}
            </>
          )}

          <input
            type="file"
            accept=".mp3,.wav"
            className="hidden"
            ref={songInputRef}
            onChange={(e) => setOverrideSong(e.target.files?.[0] || null)}
          />
        </div>

        {/* IMAGE */}
        <div className="space-y-2">
          <div className="pb-1">Select an image {resolvedImage ? "(предзаполнено)" : ""}</div>

          {resolvedImage ? (
            <div className="flex items-center justify-between bg-neutral-800/60 border border-neutral-700 rounded-xl p-3">
              <div className="min-w-0">
                <div className="truncate font-medium">{resolvedImage.name}</div>
                <div className="text-xs opacity-70">{bytesToMB(resolvedImage.size)}</div>
              </div>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600"
                disabled={isLoading}
              >
                Выбрать другую
              </button>
            </div>
          ) : (
            <>
              <Input
                id="image"
                type="file"
                disabled={isLoading}
                accept="image/*"
                ref={imageInputRef as any}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const f = e.target.files?.[0] || null;
                  setOverrideImage(f);
                }}
                className={!resolvedImage ? errRing : ""}
              />
              {!resolvedImage && <p className={errText}>Обложка обязательна</p>}
            </>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInputRef}
            onChange={(e) => setOverrideImage(e.target.files?.[0] || null)}
          />
        </div>

        <ButtonLogin
          type="button"
          onClick={submit}
          className="hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Create"}
        </ButtonLogin>
      </form>
    </Modal>
  );
};

export default UploadModal;
