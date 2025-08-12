"use client";
import { create } from "zustand";

interface YtImportStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useYouTubeImportModal = create<YtImportStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useYouTubeImportModal;
