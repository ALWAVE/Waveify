"use client";
import { create } from "zustand";

export type UploadPrefill = {
  title?: string;
  author?: string;
  songFile?: File;
  imageFile?: File;
  genre?: string;
  vibe?: "Joyfully" | "Energetic" | "Quietly" | "Sad";
};

interface UploadModalStore {
  isOpen: boolean;
  prefill?: UploadPrefill;
  onOpen: () => void;
  onClose: () => void;
  openWith: (prefill: UploadPrefill) => void;
}

const useUploadModal = create<UploadModalStore>((set) => ({
  isOpen: false,
  prefill: undefined,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, prefill: undefined }),
  openWith: (prefill) => set({ isOpen: true, prefill }),
}));

export default useUploadModal;
