import { create } from "zustand";

interface FavoritesStore {
  favorites: string[];
  toggleFavorite: (label: string) => void;
  loadFavorites: () => void;
}

export const useFavorites = create<FavoritesStore>((set) => ({
  favorites: [],

  toggleFavorite: (label) => {
    set((state) => {
      const isPinned = state.favorites.includes(label);
      const updated = isPinned
        ? state.favorites.filter((item) => item !== label)
        : [...state.favorites, label];

      localStorage.setItem("favorites", JSON.stringify(updated));
      return { favorites: updated };
    });
  },

  loadFavorites: () => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      set({ favorites: JSON.parse(stored) });
    }
  },
}));