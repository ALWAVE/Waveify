export interface SongRequest {
    title: string;
    author:string;
    userId: string;
    duration: string;
    createAt: string;
    genre: string;
    vibe: string;
    like: number;
    songPath: string;
    imagePath: string;
    tag: string[];
}

export const getAllSongs = async () => {
    const response = await fetch ("https://waveify.ru/api/Song");
    return response.json();
}

export const createSong = async (songRequest: SongRequest) => {
    await fetch ("https://waveify.ru/api/Song/upload", {
        method: "POST",
        headers: {
            "content-type": "application/json",
    },
    body: JSON.stringify(songRequest),
    });
}