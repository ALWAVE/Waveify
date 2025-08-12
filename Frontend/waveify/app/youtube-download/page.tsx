"use client";

import ButtonLogin from "@/component/ButtonLogin";
import DropdownButton from "@/component/DropDownButton";
import Input from "@/component/Input";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import useUploadModal from "@/hooks/useUploadModal";

type Meta = { title: string; author?: string; duration?: string; thumbnail?: string };
const API_BASE = "http://77.94.203.78:5000";

export default function YouTubeDownloadPage() {
  const { user } = useAuth();
  const uploadModal = useUploadModal();

  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<"mp3" | "wav">("mp3");
  const [localLoading, setLocalLoading] = useState(false);

  const [meta, setMeta] = useState<Meta | null>(null);
  const [readyAudioFile, setReadyAudioFile] = useState<File | null>(null);
  const [readyImageFile, setReadyImageFile] = useState<File | null>(null);

  async function saveBlobToDisk(blob: Blob, fileName: string) {
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objUrl);
  }

  async function fetchAudioBlob(params: { url: string; format: "mp3" | "wav"; isPremiumUser: boolean }) {
    const res = await fetch(`${API_BASE}/api/YouTube/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(t || `Download failed (${res.status})`);
    }
    return await res.blob();
  }

  const handleDownloadAndOpenPrompt = async () => {
    if (!url.trim()) return alert("Введите валидный YouTube URL");
    if (format === "wav" && !user?.isPremium) return alert("WAV доступен только для премиум-пользователей");

    try {
      setLocalLoading(true);

      // 1) метаданные
      let m: Meta = { title: "" };
      try {
        const r = await fetch(`${API_BASE}/api/YouTube/metadata?url=${encodeURIComponent(url)}`, {
          credentials: "include",
        });
        if (r.ok) m = await r.json();
      } catch {}
      setMeta(m);

      // 2) аудио blob -> File + скачать пользователю
      const audioBlob = await fetchAudioBlob({ url, format, isPremiumUser: !!user?.isPremium });
      const safeTitle = (m.title || "track").replace(/[\\/:*?"<>|]+/g, "_");
      const audioName = `${safeTitle}.${format}`;
      await saveBlobToDisk(audioBlob, audioName); // локальная загрузка
      const audioFile = new File([audioBlob], audioName, { type: format === "wav" ? "audio/wav" : "audio/mpeg" });
      setReadyAudioFile(audioFile);

      // 3) картинка через прокси → File (обход CORS)
      let imageFile: File | null = null;
      if (m.thumbnail) {
        try {
          const imgRes = await fetch(`${API_BASE}/api/YouTube/proxy-image?url=${encodeURIComponent(m.thumbnail)}`, {
            credentials: "include",
          });
          if (imgRes.ok) {
            const imgBlob = await imgRes.blob();
            const ct = imgRes.headers.get("content-type") || "image/jpeg";
            imageFile = new File([imgBlob], "cover.jpg", { type: ct });
          }
        } catch {}
      }
      setReadyImageFile(imageFile);
      // после этого внизу появится панель с кнопкой
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Ошибка");
    } finally {
      setLocalLoading(false);
    }
  };

  const openUploadWithPrefill = () => {
    if (!readyAudioFile) return alert("Файл ещё не готов");
    uploadModal.openWith({
      title: meta?.title || "",
      author: meta?.author || "",
      songFile: readyAudioFile,
      imageFile: readyImageFile || undefined, // обязателен для модалки
    });
  };

  const busy = localLoading;

  return (
    <div className="p-4 bg-[var(--bgPage)] text-[var(--text)] rounded-lg w-full h-full overflow-hidden overflow-y-auto">
      <div className="mb-2 flex flex-col gap-y-6 max-w-4xl mx-auto">
        <div className="flex pt-10 justify-center items-center">
          <h1 className="mb-4 text-[var(--text)] text-5xl font-semibold text-center">Waveify YouTube -</h1>
          <h1 className="ml-2 mb-4 text-rose-500 text-6xl font-black text-center">MP3</h1>
        </div>

        <h1 className="text-[var(--text)] opacity-80 text-base text-center">
          Конвертируйте видео с YouTube в MP3 и импортируйте в Waveify
        </h1>

        <div className="flex w-full justify-center items-center gap-2">
          <Input
            id="url_youtube"
            disabled={busy}
            placeholder="Enter YouTube URL"
            className="flex-1 bg-[var(--transparent)] text-xl min-w-0 rounded-full ring-2 active:ring-rose-500 ring-neutral-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <div className="relative flex-shrink-0 w-26 ">
            <DropdownButton
              options={[
                { label: "MP3", value: "mp3" },
                { label: "WAV", value: "wav" },
              ]}
              value={format}
              premiumUser={!!user?.isPremium}
              onChange={(e) => setFormat(e.target.value as "mp3" | "wav")}
              className="px-6 py-4 text-base"
            />
          </div>

          <ButtonLogin
            disabled={busy}
            onClick={handleDownloadAndOpenPrompt}
            className="w-14 h-14 flex justify-center items-center bg-transparent hover:scale-110 active:scale-90 hover:bg-rose-500 hover:opacity-100 text-neutral-400 hover:text-white ring ring-neutral-700 hover:text-2xl "
          >
            {busy ? <span>Loading...</span> : <HiOutlineDownload size={18} />}
          </ButtonLogin>
        </div>
      </div>

      {/* Панель-предложение после скачивания */}
      {readyAudioFile && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(720px,92vw)] bg-neutral-900/90 backdrop-blur rounded-2xl shadow-2xl p-4 border border-neutral-700 z-50">
          <div className="flex gap-4 items-center">
            {meta?.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={meta.thumbnail} alt="cover" className="w-24 h-24 object-cover rounded-lg flex-shrink-0" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-24 h-24 bg-neutral-800 rounded-lg flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{meta?.title || readyAudioFile.name}</div>
              <div className="text-sm opacity-75 truncate">{meta?.author || "Unknown"}</div>
              <div className="text-xs opacity-60 mt-1">
                Готово: {readyAudioFile.name} ({Math.max(1, Math.round(readyAudioFile.size / 1024 / 1024))} MB)
              </div>
            </div>

            <button onClick={openUploadWithPrefill} className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:opacity-90">
              Добавить в приложение
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
