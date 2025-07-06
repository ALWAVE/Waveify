import { useState } from "react";

interface DownloadParams {
  url: string;
  format: "mp3" | "wav";
  isPremiumUser: boolean;
}

export function useYouTubeDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

function getFileNameFromContentDisposition(header: string | null): string | null {
  if (!header) return null;

  // Сначала пытаемся получить из filename*=UTF-8''
  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/);
  if (utf8Match && utf8Match[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  // Или из filename="..."
  const quotedMatch = header.match(/filename="([^"]+)"/);
  if (quotedMatch && quotedMatch[1]) {
    return quotedMatch[1];
  }

  return null;
}

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
    console.log("Content-Disposition header:", contentDisposition); 


    const filename = getFileNameFromContentDisposition(contentDisposition) || `Waveify - Download.${params.format}`;

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;  // Используем имя из заголовка
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


  return {
    isLoading,
    error,
    downloadAudio,
  };
}
