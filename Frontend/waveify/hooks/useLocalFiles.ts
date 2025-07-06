// hooks/useLocalFiles.ts
import { useEffect, useState } from "react";

interface LocalSong {
  title: string;
  path: string;
}

const useLocalFiles = () => {
  const [files, setFiles] = useState<LocalSong[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchLocalFiles = async () => {
    setLoading(true);
    try {
      const result = await window.electron?.getAudioFiles();
      if (Array.isArray(result)) {
        setFiles(result);
      }
    } catch (error) {
      console.error("Ошибка при загрузке локальных файлов", error);
    } finally {
      setLoading(false);
    }
  };

  fetchLocalFiles();
}, []);



  return { files, loading };
};

export default useLocalFiles;
