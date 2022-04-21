import { app, BrowserWindow, shell, ipcMain, nativeTheme, Tray, Menu, Notification  } from 'electron';
import { release } from 'os';
import { join } from 'path';
import Store from 'electron-store';
import './samples/npm-esm-packages';
import pkg from '../../package.json'


// Conditionally include the dev tools installer to load React Dev Tools
let installExtension:any, REACT_DEVELOPER_TOOLS:any, REDUX_DEVTOOLS:any; // NEW!
if (!app.isPackaged) {
    const devTools = require("electron-devtools-installer");
    installExtension = devTools.default;
    REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
    REDUX_DEVTOOLS = devTools.REDUX_DEVTOOLS;
}

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
if (pkg.env.VITRON_CUSTOM_TITLEBAR) setupTitlebar();

async function createWindow() {
  let windowState: any = await store.get("windowState")
  if (!pkg.env.VITRON_SAVE_WINDOWSIZE) windowState = null
  win = new BrowserWindow({
    title: 'Vitron',
    show: false,
    autoHideMenuBar: pkg.env.VITRON_CUSTOM_TITLEBAR,
    titleBarStyle: pkg.env.VITRON_CUSTOM_TITLEBAR ? "hidden" : "default",
    x: windowState?.x || 0,
    y: windowState?.y || 0,
    width: windowState?.width || 600,
    height: windowState?.height || 850,
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
    if (!app.isPackaged) win.webContents.openDevTools({mode: 'detach'});
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

  win.on('close', () => {
    const windowState = win?.getBounds()
    if (pkg.env.VITRON_SAVE_WINDOWSIZE) store.set("windowState", windowState);
  });

  win.once('ready-to-show', () => {
    win?.show();
  });

  if (pkg.env.VITRON_CUSTOM_TITLEBAR) attachTitlebarToWindow(win);
}

const NOTIFICATION_TITLE = 'Vitron - by Blade'
const NOTIFICATION_BODY = 'Testing Notification from the Main process'

function showNotification() {
    new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

let tray = null

app.whenReady().then(createWindow).then(async () => {
  if (!app.isPackaged) {
    await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], { loadExtensionOptions: { allowFileAccess: true }, forceDownload: false })
        .then((name:any) => console.log(`Added Extension:  ${name}`))
        .catch((error:any) => console.log(`An error occurred: , ${error}`));
  }
  if (pkg.env.VITRON_TRAY) {
    const icon = join(__dirname, '../../resources/icon.png')
    tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
      { label: 'Show', click: () => win?.show() },
      { label: 'Minimize', click: () => win?.minimize() },
      { label: 'Minimize to tray', click: () => win?.hide() },
      { label: 'Test Notifiation', click: () => showNotification() },
      { label: 'seperator', type: 'separator' },
      { label: 'Dev', click: () => win?.webContents.openDevTools() },
      { label: 'seperator', type: 'separator' },
      { label: 'Restart Vitron', click: () => { app.relaunch(); app.exit() }},
      { label: 'seperator', type: 'separator' },
      { label: 'Exit', click: () => app.quit() }
    ])
    tray.setToolTip('Vitron by Blade')
    tray.setContextMenu(contextMenu)
    tray.setIgnoreDoubleClickEvents(true)
    tray.on('click', (e) => win?.show())
  }
});

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
  if (pkg.env.VITRON_CUSTOM_TITLEBAR) win?.reload();
});
