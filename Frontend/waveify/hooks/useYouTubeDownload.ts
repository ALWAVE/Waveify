import { useState } from "react";

export interface DownloadParams {
  url: string;
  format: "mp3" | "wav";
  isPremiumUser: boolean;
}

export interface YouTubeMeta {
  title: string;
  author?: string;
  duration?: string;        // "hh:mm:ss"
  thumbnails?: string[];    // крупная обычно первая
}

export function useYouTubeDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function getFileNameFromContentDisposition(header: string | null): string | null {
    if (!header) return null;

    // filename*=UTF-8''
    const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/);
    if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1]);

    // filename="..."
    const quotedMatch = header.match(/filename="([^"]+)"/);
    if (quotedMatch?.[1]) return quotedMatch[1];

    return null;
  }

  /** 1) Старый метод: просто скачать файл пользователю */
  async function downloadAudio(params: DownloadParams) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://77.94.203.78:5000/YouTube/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Download failed");
      }

      const contentDisposition = response.headers.get("content-disposition");
      const filename =
        getFileNameFromContentDisposition(contentDisposition) ||
        `Waveify - Download.${params.format}`;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  /** 2) Получить только метаданные YouTube (title/author/cover/duration) */
  async function fetchMetadata(youtubeUrl: string): Promise<YouTubeMeta> {
    const res = await fetch(
      `http://77.94.203.78:5000/YouTube/metadata?url=${encodeURIComponent(youtubeUrl)}`
    );
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  /**
   * 3) Скачать как Blob + параллельно метаданные — для модалки «Импортировать?».
   * Ничего не сохраняет автоматически — ты решаешь сам что делать (показать модалку и т.д.)
   */
  async function downloadAsBlob(params: DownloadParams): Promise<{
    blob: Blob;
    meta: YouTubeMeta;
    filename: string;
  }> {
    setIsLoading(true);
    setError(null);

    try {
      const [metaRes, fileRes] = await Promise.all([
        fetch(
          `http://77.94.203.78:5000/YouTube/metadata?url=${encodeURIComponent(params.url)}`
        ),
        fetch("http://77.94.203.78:5000/YouTube/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        }),
      ]);

      if (!metaRes.ok) throw new Error(await metaRes.text());
      if (!fileRes.ok) throw new Error(await fileRes.text());

      const meta: YouTubeMeta = await metaRes.json();
      const blob = await fileRes.blob();

      const cd = fileRes.headers.get("content-disposition");
      const filename =
        getFileNameFromContentDisposition(cd) ||
        `${meta.title || "track"}.${params.format}`;

      return { blob, meta, filename };
    } catch (err: any) {
      setError(err.message || "Unknown error");
      throw err; // пусть страница знает, что пошло не так
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    error,
    downloadAudio,   // старый UX: сразу сохранить файл
    fetchMetadata,   // если вдруг отдельно понадобятся метаданные
    downloadAsBlob,  // новый UX: blob + meta → показываем модалку импорта
  };
}
