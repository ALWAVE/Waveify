import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  isPlaying: boolean;
  volume: number;
  volumeLoaded: boolean;

  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setVolume: (volume: number) => void;
  loadVolume: () => void;
  stop: () => void; 
}

const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  isPlaying: false,
  volume: 1, // По умолчанию, пока не загружено
  volumeLoaded: false,

  setId: (id: string) => set({ activeId: id, isPlaying: true }),
  setIds: (ids: string[]) => set({ ids }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  reset: () => set({ ids: [], activeId: undefined, isPlaying: false }),
  setVolume: (volume: number) => {
    set({ volume });
    localStorage.setItem("volume", volume.toString());
  },
  loadVolume: () => {
    const storedVolume = localStorage.getItem("volume");
    const volume = storedVolume ? parseFloat(storedVolume) : 1;
    set({ volume, volumeLoaded: true });
  },
  stop: () => set({ isPlaying: false, activeId: undefined }),
}));

export default usePlayer;
