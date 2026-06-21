const { app, BrowserWindow, dialog, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

// Documents save directory for the app
const SAVE_DIR_NAME = 'MarkdownStudio';
let userSaveDir = '';

function getSaveDir() {
  if (!userSaveDir) {
    const docs = app.getPath('documents');
    userSaveDir = path.join(docs, SAVE_DIR_NAME);
  }
  return userSaveDir;
}

function ensureSaveDir() {
  const dir = getSaveDir();
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    console.error('Failed to create save dir:', e);
  }
  return dir;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: '#1a304f',
    icon: path.join(__dirname, 'assets', 'icon-source.jpg'),
    titleBarStyle: 'hiddenInset',
    title: 'Markdown Studio by HTNY Studios',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
    show: false,
  });

  // Load the renderer
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Build application menu (native)
  buildMenu();
}

function buildMenu() {
  const template = [
    {
      label: 'Plik',
      submenu: [
        { label: 'Nowy', accelerator: 'CmdOrCtrl+N', click: () => mainWindow?.webContents.send('menu-new') },
        { type: 'separator' },
        { label: 'Otwórz...', accelerator: 'CmdOrCtrl+O', click: () => mainWindow?.webContents.send('menu-open') },
        { label: 'Zapisz', accelerator: 'CmdOrCtrl+S', click: () => mainWindow?.webContents.send('menu-save') },
        { label: 'Zapisz jako...', accelerator: 'CmdOrCtrl+Shift+S', click: () => mainWindow?.webContents.send('menu-save-as') },
        { type: 'separator' },
        { label: 'Eksportuj PDF', click: () => mainWindow?.webContents.send('menu-export-pdf') },
        { label: 'Eksportuj DOCX', click: () => mainWindow?.webContents.send('menu-export-docx') },
        { label: 'Eksportuj Markdown (Obsidian)', click: () => mainWindow?.webContents.send('menu-export-obsidian') },
        { type: 'separator' },
        { role: 'close' },
      ],
    },
    {
      label: 'Edycja',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'Widok',
      submenu: [
        { label: 'Pokaż/Ukryj edytor', click: () => mainWindow?.webContents.send('menu-toggle-editor') },
        { label: 'Pokaż/Ukryj podgląd', click: () => mainWindow?.webContents.send('menu-toggle-preview') },
        { type: 'separator' },
        { label: 'Tryb pełnoekranowy', accelerator: 'F11', role: 'togglefullscreen' },
        { label: 'Zawsze na wierzchu', type: 'checkbox', click: (item) => {
          if (mainWindow) mainWindow.setAlwaysOnTop(item.checked);
        }},
      ],
    },
    {
      label: 'Pomoc',
      submenu: [
        { label: 'Otwórz folder zapisów', click: () => {
          const dir = ensureSaveDir();
          shell.openPath(dir);
        }},
        { type: 'separator' },
        { label: 'Markdown Studio by HTNY Studios', enabled: false },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC: provide save directory
ipcMain.handle('get-save-dir', () => ensureSaveDir());

// IPC: open native open file dialog (markdown)
ipcMain.handle('open-md-file', async () => {
  const dir = ensureSaveDir();
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Otwórz plik Markdown',
    defaultPath: dir,
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown', 'txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  });
  if (canceled || !filePaths.length) return null;
  try {
    const content = fs.readFileSync(filePaths[0], 'utf-8');
    return { path: filePaths[0], content };
  } catch (e) {
    return { error: e.message };
  }
});

// IPC: open native save dialog + write
ipcMain.handle('save-md-file', async (event, { content, suggestedName, saveAs }) => {
  const dir = ensureSaveDir();
  const defaultName = suggestedName || 'dokument.md';
  const defaultPath = path.join(dir, defaultName);

  if (!saveAs) {
    // Quick save: if the caller provided a lastPath we could write directly, but for safety always confirm location once
  }

  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: saveAs ? 'Zapisz jako...' : 'Zapisz plik',
    defaultPath: defaultPath,
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'Text', extensions: ['txt'] },
    ],
  });

  if (canceled || !filePath) return { canceled: true };

  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { path: filePath };
  } catch (e) {
    return { error: e.message };
  }
});

// IPC: export PDF / DOCX / Obsidian use renderer, but we can help with dialogs for default paths
ipcMain.handle('choose-export-path', async (event, { defaultName, ext }) => {
  const dir = ensureSaveDir();
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Eksportuj',
    defaultPath: path.join(dir, defaultName || `dokument.${ext}`),
    filters: [{ name: ext.toUpperCase(), extensions: [ext] }],
  });
  if (canceled || !filePath) return null;
  return filePath;
});

// For PDF export we let renderer handle (html2pdf saves directly), but we can ask for filename
ipcMain.handle('choose-pdf-path', async () => {
  const dir = ensureSaveDir();
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Zapisz PDF',
    defaultPath: path.join(dir, 'dokument.pdf'),
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });
  if (canceled || !filePath) return null;
  return filePath;
});

// Import PDF
ipcMain.handle('choose-import-pdf', async () => {
  const dir = ensureSaveDir();
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Importuj PDF',
    defaultPath: dir,
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
    properties: ['openFile'],
  });
  if (canceled || !filePaths.length) return null;
  return filePaths[0];
});

// Read file content (for PDF import bytes)
ipcMain.handle('read-file-bytes', async (event, filePath) => {
  try {
    return fs.readFileSync(filePath);
  } catch (e) {
    return null;
  }
});

app.whenReady().then(() => {
  ensureSaveDir();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
