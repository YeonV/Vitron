import { app, BrowserWindow, shell, ipcMain, nativeTheme  } from 'electron';
import { release } from 'os';
import { join } from 'path';
import Store from 'electron-store';
import './samples/npm-esm-packages';
import pkg from '../../package.json'

const { setupTitlebar, attachTitlebarToWindow } = require("custom-electron-titlebar/main");

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;

const store = new Store();
if (pkg.env.VITE_CUSTOM_TITLEBAR) setupTitlebar();

async function createWindow() {
  win = new BrowserWindow({
    title: 'Vitron',
    autoHideMenuBar: pkg.env.VITE_CUSTOM_TITLEBAR,
    titleBarStyle: pkg.env.VITE_CUSTOM_TITLEBAR ? "hidden" : "default",
    x: 0,
    y: 0,
    width: 960,
    height: 960,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
    },
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;

    win.loadURL(url);
    win.webContents.openDevTools();
  }

  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  if (pkg.env.VITE_CUSTOM_TITLEBAR) attachTitlebarToWindow(win);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

ipcMain.on('set', async (event, arg) => {
  console.log(arg[0], arg[1]);
  await store.set(arg[0], arg[1]);
  event.sender.send('ping-pong', `[ipcMain] "${arg}" received asynchronously.`);
});
ipcMain.on('get', async (event, arg) => {
  const res: any = await store.get(arg);
  event.sender.send('get', res);
});

ipcMain.on('ping-pong', async (event, arg) => {
  event.sender.send('ping-pong', `[ipcMain] "${arg}" received asynchronously.`);
});

ipcMain.on('ping-pong-sync', (event, arg) => {
  event.returnValue = `[ipcMain] "${arg}" received synchronously.`;
});

ipcMain.on('get-darkmode', (event) => {  
  event.returnValue = nativeTheme.shouldUseDarkColors ? "yes" : "no";
});
ipcMain.on('toggle-darkmode', (event) => {
  const res = nativeTheme.themeSource === 'system' ? (nativeTheme.shouldUseDarkColors ?  'light' : 'dark'): nativeTheme.themeSource === 'dark' ? 'light' : 'dark'; 
  event.returnValue = res === 'dark'
  nativeTheme.themeSource =  res
  if (pkg.env.VITE_CUSTOM_TITLEBAR) win?.reload();
});
