
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    saveCharacter: (character) => ipcRenderer.invoke('save-character', character),
    loadCharacters: () => ipcRenderer.invoke('load-characters'),
    deleteCharacter: (characterId) => ipcRenderer.invoke('delete-character', characterId),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    loadSettings: () => ipcRenderer.invoke('load-settings')
  }
);
