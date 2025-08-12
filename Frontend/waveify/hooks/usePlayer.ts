import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  isPlaying: boolean;

  // громкость
  volume: number;
  volumeLoaded: boolean;

  // полноэкранный режим
  fullScreen: boolean;

  // управление треками/состоянием
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  reset: () => void;

  // громкость (c сохранением)
  setVolume: (volume: number) => void;
  loadVolume: () => void;

  // фуллскрин
  setFullScreen: (v: boolean) => void;
}

const usePlayer = create<PlayerStore>((set, get) => ({
  ids: [],
  activeId: undefined,
  isPlaying: false,

  // по умолчанию 1, пока не загрузили из localStorage
  volume: 1,
  volumeLoaded: false,

  // fullscreen overlay UI
  fullScreen: false,

  setId: (id: string) => set({ activeId: id, isPlaying: true }),
  setIds: (ids: string[]) => set({ ids }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  stop: () => set({ isPlaying: false, activeId: undefined }),
  reset: () =>
    set({ ids: [], activeId: undefined, isPlaying: false, fullScreen: false }),

  setVolume: (volume: number) => {
    set({ volume });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("volume", String(volume));
      } catch {
        /* noop */
      }
    }
  },

  loadVolume: () => {
    let volume = 1;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("volume");
        volume = stored ? Math.min(1, Math.max(0, parseFloat(stored))) : 1;
      } catch {
        volume = 1;
      }
    }
    set({ volume, volumeLoaded: true });
  },

  setFullScreen: (v: boolean) => set({ fullScreen: v }),
}));

export default usePlayer;
