const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
let splashWindow;


ipcMain.handle("get-audio-files", async () => {
  const userDirs = [
    path.join(os.homedir(), "Music"),
    path.join(os.homedir(), "Downloads"),
    path.join(os.homedir(), "Desktop"),
    path.join(os.homedir(), "Documents"),
  ];

  const audioFiles = [];

  const scanDirRecursive = (dir, depth = 0) => {
    if (depth > 5) return; // Ограничение глубины
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

function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 300,
        height: 350,
        resizable: false,
        frame: false,
        movable: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    splashWindow.loadFile(path.join(__dirname, '../public/splash.html'));

    // Создаем основное окно 
    createMainWindow();
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        icon: path.join(__dirname, '../public/Waveify_Logo.png'),
        width: 1280,
        height: 800,
        minHeight: 600,
        minWidth: 900,
        frame: false, // Убираем стандартный заголовок окна
        overlayScrollbars: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadURL("http://77.94.203.78:3000/");
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    // Скрыть основное окно до закрытия сплэш-экрана
    mainWindow.hide();

    // Закрыть заглушку и открыть основное окно через 5 секунд
    setTimeout(() => {
        splashWindow.close();
        mainWindow.show(); // Показываем основное окно
    }, 5000);
}

app.whenReady().then(createSplashWindow);

ipcMain.on("close-app", () => mainWindow?.close());
ipcMain.on("minimize-app", () => mainWindow?.minimize());
ipcMain.on("maximize-app", () => {
    if (mainWindow?.isMaximized()) {
        mainWindow.restore();
    } else {
        mainWindow.maximize();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.on("set-zoom", (event, zoomLevel) => {
    if (mainWindow) {
        console.log(`Изменяем уровень зума: ${zoomLevel}`);
        mainWindow.webContents.setZoomLevel(zoomLevel);
    }
});
