const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
let splashWindow;

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
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadURL("http://localhost:3000");
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


// const { app, BrowserWindow, ipcMain } = require("electron");
// const path = require("path");

// let mainWindow;
// let splashWindow;

// function createSplashWindow() {
//     splashWindow = new BrowserWindow({
//         width: 300,
//         height: 350,
//         resizable: false,
//         frame: false,
//         movable: false,
//         webPreferences: {
//             preload: path.join(__dirname, "preload.js"),
//             contextIsolation: true,
//             nodeIntegration: false,
//         },
//     });

//     splashWindow.loadFile(path.join(__dirname, '../public/splash.html'));

//     // Закрыть заглушку и открыть основное окно через 5 секунд
//     setTimeout(() => {
//         splashWindow.close();
//         createMainWindow();
//     }, 5000);
// }

// function createMainWindow() {
//     mainWindow = new BrowserWindow({
//         icon: path.join(__dirname, '../public/Waveify_Logo.png'),
//         width: 1280,
//         height: 800,
//         minHeight: 600,
//         minWidth: 900,
//         frame: false, // Убираем стандартный заголовок окна
//         webPreferences: {
//             preload: path.join(__dirname, "preload.js"),
//             contextIsolation: true,
//             nodeIntegration: false,
//         },
//     });

//     mainWindow.loadURL("http://localhost:3000");
//     mainWindow.webContents.openDevTools();
//     mainWindow.on("closed", () => {
//         mainWindow = null;
//     });
// }

// app.whenReady().then(createSplashWindow);

// ipcMain.on("close-app", () => mainWindow?.close());
// ipcMain.on("minimize-app", () => mainWindow?.minimize());
// ipcMain.on("maximize-app", () => {
//     if (mainWindow?.isMaximized()) {
//         mainWindow.restore();
//     } else {
//         mainWindow.maximize();
//     }
// });

// app.on("window-all-closed", () => {
//     if (process.platform !== "darwin") app.quit();
// });

// ipcMain.on("set-zoom", (event, zoomLevel) => {
//     if (mainWindow) {
//         console.log(`Изменяем уровень зума: ${zoomLevel}`);
//         mainWindow.webContents.setZoomLevel(zoomLevel);
//     }
// });
