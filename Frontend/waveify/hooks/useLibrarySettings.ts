import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LibrarySettingsStore {
  showYourFile: boolean;
  setShowYourFile: (value: boolean) => void;
}

const useLibrarySettings = create<LibrarySettingsStore>()(
  persist(
    (set) => ({
      showYourFile: false,
      setShowYourFile: (value: boolean) => set({ showYourFile: value }),
    }),
    {
      name: "library-settings", // ключ в localStorage
    }
  )
);

export default useLibrarySettings;
