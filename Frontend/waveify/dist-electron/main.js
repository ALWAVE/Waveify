"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// main.ts (Electron-процесс)
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
let mainWindow;
let splashWindow;
let tray = null;
let isQuiting = false;
const preloadPath = path_1.default.join(__dirname, "preload.js");
electron_1.ipcMain.handle("get-audio-files", async () => {
    const userDirs = [
        path_1.default.join(os_1.default.homedir(), "Music"),
        path_1.default.join(os_1.default.homedir(), "Downloads"),
        path_1.default.join(os_1.default.homedir(), "Desktop"),
        path_1.default.join(os_1.default.homedir(), "Documents"),
    ];
    const audioFiles = [];
    const scanDirRecursive = (dir, depth = 0) => {
        if (depth > 5)
            return;
        try {
            const items = fs_1.default.readdirSync(dir);
            for (const item of items) {
                const fullPath = path_1.default.join(dir, item);
                const stat = fs_1.default.statSync(fullPath);
                if (stat.isDirectory()) {
                    if (!item.startsWith(".") && item !== "node_modules") {
                        scanDirRecursive(fullPath, depth + 1);
                    }
                }
                else if (/\.(mp3|wav)$/i.test(item)) {
                    audioFiles.push({
                        title: path_1.default.basename(fullPath),
                        path: fullPath,
                    });
                }
            }
        }
        catch (err) {
            console.error("Ошибка при сканировании:", dir, err);
        }
    };
    for (const dir of userDirs) {
        scanDirRecursive(dir);
    }
    return audioFiles;
});
function createTray() {
    const icon = electron_1.nativeImage
        .createFromPath(path_1.default.join(__dirname, "../public/icon_black_new.ico"))
        .resize({ width: 16, height: 16 }); // маленький размер для панели
    tray = new electron_1.Tray(icon);
    const contextMenu = electron_1.Menu.buildFromTemplate([
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
                electron_1.app.quit();
            },
        },
    ]);
    tray.setToolTip("Waveify");
    tray.setContextMenu(contextMenu);
    // Двойной клик - тоже «Открыть»
    tray.on("double-click", () => mainWindow?.show());
}
function createSplashWindow() {
    splashWindow = new electron_1.BrowserWindow({
        icon: path_1.default.join(__dirname, "../public/logo_new.ico"),
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
    splashWindow.loadFile(path_1.default.join(__dirname, "../public/splash.html"));
    createMainWindow();
}
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        icon: path_1.default.join(__dirname, "../public/logo_new.ico"),
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
    if (!electron_1.app.isPackaged)
        mainWindow.webContents.openDevTools();
    /* ---------- ключевой перехват close ---------- */
    mainWindow.on("close", (e) => {
        if (!isQuiting) {
            e.preventDefault(); // отменяем стандартное закрытие
            mainWindow?.hide(); // прячем окно
        }
    });
    mainWindow.hide();
    setTimeout(() => {
        splashWindow?.close();
        mainWindow?.show();
    }, 5000);
}
electron_1.app.whenReady().then(() => {
    createSplashWindow();
    createTray();
});
/* --- IPC из фронта --- */
electron_1.ipcMain.on("close-app", () => mainWindow?.close());
electron_1.ipcMain.on("minimize-app", () => mainWindow?.minimize());
electron_1.ipcMain.on("maximize-app", () => mainWindow?.isMaximized() ? mainWindow.restore() : mainWindow?.maximize());
electron_1.ipcMain.on("set-zoom", (_e, z) => mainWindow?.webContents.setZoomLevel(z));
/* --- Behaviour macOS / Windows --- */
electron_1.app.on("before-quit", () => (isQuiting = true));
electron_1.app.on("window-all-closed", () => {
    // На Windows/Linux оставляем трэй, на macOS обычно держим menu-bar-app
    if (process.platform !== "darwin") {
        if (isQuiting)
            electron_1.app.quit();
    }
});
