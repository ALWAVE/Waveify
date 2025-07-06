const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  setZoom: (zoom) => ipcRenderer.send("set-zoom", zoom),
});


// preload.ts


// import { contextBridge, ipcRenderer } from "electron";

// contextBridge.exposeInMainWorld("electron", {
//   send: (channel: string, data: any) => ipcRenderer.send(channel, data),
//   setZoom: (zoom: number) => ipcRenderer.send("set-zoom", zoom),
//   getAudioFiles: () => ipcRenderer.invoke("get-audio-files"),
// });
