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
    moderationStatus: number;
    tag: string[];
}

export const getAllSongs = async () => {
    const response = await fetch ("http://77.94.203.78:5000/Song");
    return response.json();
}

export const createSong = async (songRequest: SongRequest) => {
    await fetch ("http://77.94.203.78:5000/Song/upload", {
        method: "POST",
        headers: {
            "content-type": "application/json",
    },
    body: JSON.stringify(songRequest),
    });
}