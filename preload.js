const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('studio', {
  // File system helpers
  getSaveDir: () => ipcRenderer.invoke('get-save-dir'),
  openMdFile: () => ipcRenderer.invoke('open-md-file'),
  saveMdFile: (opts) => ipcRenderer.invoke('save-md-file', opts),
  chooseExportPath: (opts) => ipcRenderer.invoke('choose-export-path', opts),
  choosePdfPath: () => ipcRenderer.invoke('choose-pdf-path'),
  chooseImportPdf: () => ipcRenderer.invoke('choose-import-pdf'),
  readFileBytes: (p) => ipcRenderer.invoke('read-file-bytes', p),

  // Menu events from main
  onMenu: (channel, cb) => {
    const handler = (event, ...args) => cb(...args);
    ipcRenderer.on(channel, handler);
    return () => ipcRenderer.removeListener(channel, handler);
  },

  // Misc
  openPath: (p) => ipcRenderer.invoke('open-path', p),
});
