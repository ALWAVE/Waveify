// hooks/useUserSongs.ts
import { useUser } from "@/hooks/useUser";

export const useUserSongs = () => {
  const { user } = useUser();
  return {
    songs: user?.songs ?? [],
    isLoading: !user,
    refresh: () => {},
  };
};
