"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electron", {
    send: (channel, data) => electron_1.ipcRenderer.send(channel, data),
    setZoom: (zoom) => electron_1.ipcRenderer.send("set-zoom", zoom),
    getAudioFiles: () => electron_1.ipcRenderer.invoke("get-audio-files"),
});
