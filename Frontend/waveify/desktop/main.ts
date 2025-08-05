// main.ts (Electron-процесс)
import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
} from "electron";
import path from "path";
import os from "os";
import fs from "fs";

let mainWindow: BrowserWindow | null;
let splashWindow: BrowserWindow | null;
let tray: Tray | null = null;
let isQuiting = false;


const preloadPath = path.join(__dirname, "preload.js");

ipcMain.handle("get-audio-files", async () => {
  const userDirs = [
    path.join(os.homedir(), "Music"),
    path.join(os.homedir(), "Downloads"),
    path.join(os.homedir(), "Desktop"),
    path.join(os.homedir(), "Documents"),
  ];
  const audioFiles: { title: string; path: string }[] = [];

  const scanDirRecursive = (dir: string, depth = 0) => {
    if (depth > 5) return;
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (!item.startsWith(".") && item !== "node_modules") {
            scanDirRecursive(fullPath, depth + 1);
          }
        } else if (/\.(mp3|wav)$/i.test(item)) {
          audioFiles.push({
            title: path.basename(fullPath),
            path: fullPath,
          });
        }
      }
    } catch (err) {
      console.error("Ошибка при сканировании:", dir, err);
    }
  };

  for (const dir of userDirs) {
    scanDirRecursive(dir);
  }

  return audioFiles;
});

function createTray() {
  const icon = nativeImage
    .createFromPath(path.join(__dirname, "../public/icon_black_new.ico"))
    .resize({ width: 16, height: 16 });         // маленький размер для панели

  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Открыть Waveify",
      click: () => {
        mainWindow?.show();
      },
    },
    { type: "separator" },
    {
      label: "Выход",
      click: () => {
        isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Waveify");
  tray.setContextMenu(contextMenu);

  // Двойной клик - тоже «Открыть»
  tray.on("double-click", () => mainWindow?.show());
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    icon: path.join(__dirname, "../public/logo_new.ico"),
    width: 300,
    height: 350,
    resizable: false,
    frame: false,
    movable: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  splashWindow.loadFile(path.join(__dirname, "../public/splash.html"));
  createMainWindow();
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "../public/logo_new.ico"),
    width: 1280,
    height: 800,
    minHeight: 600,
    minWidth: 900,
    frame: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://77.94.203.78:3000/");

  if (!app.isPackaged) mainWindow.webContents.openDevTools();

  /* ---------- ключевой перехват close ---------- */
  mainWindow.on("close", (e) => {
    if (!isQuiting) {
      e.preventDefault();        // отменяем стандартное закрытие
      mainWindow?.hide();        // прячем окно
    }
  });

  mainWindow.hide();
  setTimeout(() => {
    splashWindow?.close();
    mainWindow?.show();
  }, 5000);
}

app.whenReady().then(() => {
  createSplashWindow();
  createTray();
});

/* --- IPC из фронта --- */
ipcMain.on("close-app", () => mainWindow?.close());
ipcMain.on("minimize-app", () => mainWindow?.minimize());
ipcMain.on("maximize-app", () =>
  mainWindow?.isMaximized() ? mainWindow.restore() : mainWindow?.maximize()
);
ipcMain.on("set-zoom", (_e, z: number) => mainWindow?.webContents.setZoomLevel(z));

/* --- Behaviour macOS / Windows --- */
app.on("before-quit", () => (isQuiting = true));

app.on("window-all-closed", () => {
  // На Windows/Linux оставляем трэй, на macOS обычно держим menu-bar-app
  if (process.platform !== "darwin") {
    if (isQuiting) app.quit();
  }
});
