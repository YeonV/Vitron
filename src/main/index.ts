/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { app, BrowserWindow, shell, ipcMain, nativeTheme, Tray, Menu, Notification } from 'electron'
import { release } from 'os'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import pkg from '../../package.json'
import installExtension, {
  REDUX_DEVTOOLS
  // REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer'
import { setupTitlebar, attachTitlebarToWindow } from 'custom-electron-titlebar/main'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

let store: any = null

async function loadElectronStore() {
  const { default: Store } = await import('electron-store')
  store = new Store()
}

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

if (pkg.env.VITRON_CUSTOM_TITLEBAR) setupTitlebar()

async function createWindow(): Promise<void> {
  await loadElectronStore() // Ensure store is loaded before creating the window

  let windowState = store?.get('windowState', undefined) as Electron.Rectangle | undefined
  if (!pkg.env.VITRON_SAVE_WINDOWSIZE) windowState = undefined

  mainWindow = new BrowserWindow({
    title: 'Vitron',
    show: false,
    autoHideMenuBar: true, // pkg.env.VITRON_CUSTOM_TITLEBAR,
    titleBarStyle: pkg.env.VITRON_CUSTOM_TITLEBAR ? 'hidden' : 'default',
    x: windowState?.x || 0,
    y: windowState?.y || 0,
    width: windowState?.width || 600,
    height: windowState?.height || 850,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('close', () => {
    const windowState = mainWindow?.getBounds()
    if (pkg.env.VITRON_SAVE_WINDOWSIZE) store.set('windowState', windowState)
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  if (pkg.env.VITRON_CUSTOM_TITLEBAR) attachTitlebarToWindow(mainWindow)

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const NOTIFICATION_TITLE = 'Vitron - by Blade'
const NOTIFICATION_BODY = 'Testing Notification from the Main process'

function showNotification() {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  if (!app.isPackaged) {
    await installExtension([REDUX_DEVTOOLS])
  }

  if (pkg.env.VITRON_TRAY && tray === null) {
    const icon = join(__dirname, '../../resources/icon.png')
    tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
      { label: 'Show', click: () => mainWindow?.show() },
      { label: 'Minimize', click: () => mainWindow?.minimize() },
      { label: 'Minimize to tray', click: () => mainWindow?.hide() },
      { label: 'Test Notification', click: () => showNotification() },
      { label: 'separator', type: 'separator' },
      { label: 'Dev', click: () => mainWindow?.webContents.openDevTools() },
      { label: 'separator', type: 'separator' },
      {
        label: 'Restart Vitron',
        click: () => {
          app.relaunch()
          app.exit()
        }
      },
      { label: 'separator', type: 'separator' },
      { label: 'Exit', click: () => app.quit() }
    ])
    tray.setToolTip('Vitron by Blade')
    tray.setContextMenu(contextMenu)
    tray.setIgnoreDoubleClickEvents(true)
    tray.on('click', () => mainWindow?.show())
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  await createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('set', async (event, arg) => {
  console.log(arg[0], arg[1])
  await store.set(arg[0], arg[1])
  event.sender.send('ping-pong', `[ipcMain] "${arg}" received asynchronously.`)
})

ipcMain.on('get', async (event, arg) => {
  const res = await store.get(arg)
  event.sender.send('get', res)
})

ipcMain.on('ping-pong', async (event, arg) => {
  event.sender.send('ping-pong', `[ipcMain] "${arg}" received asynchronously.`)
})

ipcMain.on('ping-pong-sync', (event, arg) => {
  event.returnValue = `[ipcMain] "${arg}" received synchronously.`
})

ipcMain.on('get-darkmode', (event) => {
  event.returnValue = nativeTheme.shouldUseDarkColors ? 'yes' : 'no'
})

ipcMain.on('toggle-darkmode', (event) => {
  const res =
    nativeTheme.themeSource === 'system'
      ? nativeTheme.shouldUseDarkColors
        ? 'light'
        : 'dark'
      : nativeTheme.themeSource === 'dark'
        ? 'light'
        : 'dark'
  event.returnValue = res === 'dark'
  nativeTheme.themeSource = res
  mainWindow?.reload()
})
