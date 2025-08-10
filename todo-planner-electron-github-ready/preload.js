const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveToken: (k, v) => ipcRenderer.invoke('save-token', k, v),
  getToken: (k) => ipcRenderer.invoke('get-token', k),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
});
