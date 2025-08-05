import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  send: (channel: string, data?: unknown) => ipcRenderer.send(channel, data),
  setZoom: (zoom: number) => ipcRenderer.send("set-zoom", zoom),
  getAudioFiles: () => ipcRenderer.invoke("get-audio-files"),
});