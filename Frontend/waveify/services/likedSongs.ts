// services/likedSongs.ts

export interface LikedSongRequest {
  userId: string;
  songId: string;
}

export const likeSong = async (likedSong: LikedSongRequest) => {
  await fetch("http://77.94.203.78:5000/api/LikedSongs/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(likedSong),
  });
};

export const unlikeSong = async (likedSong: LikedSongRequest) => {
  await fetch("http://77.94.203.78:5000/api/LikedSongs/unlike", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(likedSong),
  });
};

export const getLikedSongs = async (userId: string, page: number = 1, pageSize: number = 10) => {
  try {
    const response = await fetch(`http://77.94.203.78:5000/api/LikedSongs/${userId}?page=${page}&pageSize=${pageSize}`);
    const data = await response.json();
    return data.songs; // Возвращаем массив лайкнутых песен
  } catch (error) {
    console.error("Ошибка при получении списка лайкнутых песен:", error);
    return [];
  }
};

