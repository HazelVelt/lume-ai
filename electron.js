
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const isDev = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object
let mainWindow;

// Define data path for storing application data
const userDataPath = app.getPath('userData');
const charactersPath = path.join(userDataPath, 'characters');
const settingsPath = path.join(userDataPath, 'settings.json');

// Ensure directories exist
function ensureDirectoriesExist() {
  if (!fs.existsSync(charactersPath)) {
    fs.mkdirSync(charactersPath, { recursive: true });
  }
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'public/favicon.ico'),
    backgroundColor: '#13111C',
    title: 'LumeAI',
    show: false,
    frame: true
  });

  // Add a splash screen
  const splash = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    icon: path.join(__dirname, 'public/favicon.ico')
  });

  splash.loadURL(
    url.format({
      pathname: path.join(__dirname, 'public/splash.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:8080' // Vite dev server
    : url.format({
        pathname: path.join(__dirname, './dist/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(startUrl);

  // Once the main window is ready, show it and close the splash screen
  mainWindow.once('ready-to-show', () => {
    splash.destroy();
    mainWindow.show();
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Initialize file system
ensureDirectoriesExist();

// Create window when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// IPC handlers for file operations
ipcMain.handle('save-character', async (event, character) => {
  try {
    const filePath = path.join(charactersPath, `${character.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(character, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-characters', async () => {
  try {
    const files = fs.readdirSync(charactersPath);
    const characters = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(charactersPath, file);
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      });
    return { success: true, characters };
  } catch (error) {
    return { success: false, error: error.message, characters: [] };
  }
});

ipcMain.handle('delete-character', async (event, characterId) => {
  try {
    const filePath = path.join(charactersPath, `${characterId}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-settings', async (event, settings) => {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-settings', async () => {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8');
      return { success: true, settings: JSON.parse(data) };
    }
    return { success: true, settings: null };
  } catch (error) {
    return { success: false, error: error.message, settings: null };
  }
});
