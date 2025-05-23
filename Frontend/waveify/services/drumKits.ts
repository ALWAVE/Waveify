export interface DrumKitRequest {
    title: string;
    description: string;
    url: string;
    price: number;
}
export const getAllDrumKits = async () => {
    const response = await fetch("http://localhost:7040/DrumKit");
    return response.json();
};

export const createDrumKit = async (drumKitRequest: DrumKitRequest) => {
    await fetch ("http://localhost:7040/DrumKit", {
        method: "POST",
        headers: {
            "content-type": "application/json",

        },
        body: JSON.stringify(drumKitRequest),
    });
};

export const updateDrumKit = async (id: string, drumKitRequest: DrumKitRequest) => {
    await fetch (`http://localhost:7040/DrumKit/${id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",

        },
        body: JSON.stringify(drumKitRequest),
    });
}
export const deleteDrumKit = async (id: string) => {
    await fetch (`http://localhost:7040/DrumKit/${id}`, {
        method: "DELETE",
    });
}