const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 780,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Basic token store (in-memory) — replace with keytar in production
const tokenStore = {};
ipcMain.handle('save-token', async (event, key, value) => {
  tokenStore[key] = value;
  return true;
});
ipcMain.handle('get-token', async (event, key) => {
  return tokenStore[key] || null;
});

// For OAuth: open a URL in external browser (system) — you can implement loopback handling
ipcMain.handle('open-external', async (event, url) => {
  shell.openExternal(url);
  return true;
});
