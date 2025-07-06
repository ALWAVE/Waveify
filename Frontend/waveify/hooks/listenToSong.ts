const API_BASE = "http://77.94.203.78:5000";

export const listenToSong = async (userId: string, songId: string) => {
  try {
    await fetch(`${API_BASE}/Song/listen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, songId }),
    });
  } catch (error) {
    console.error("Ошибка отправки истории прослушивания:", error);
  }
};
