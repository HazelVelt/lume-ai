const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const url = require('url');

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Keep a global reference of the mainWindow object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'LumeAI',
    icon: path.join(__dirname, 'public/favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  });

  // Load the app
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, './dist/index.html'),
    protocol: 'file:',
    slashes: true,
  });
  
  mainWindow.loadURL(startUrl);

  // Open external links in the default browser instead of a new electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Show window when ready to prevent flashing
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
