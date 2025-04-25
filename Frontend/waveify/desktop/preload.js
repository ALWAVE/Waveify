const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  setZoom: (zoom) => ipcRenderer.send("set-zoom", zoom),
});
