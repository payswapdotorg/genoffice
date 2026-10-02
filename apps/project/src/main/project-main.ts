import { BrowserWindow, app } from 'electron'
import { join } from 'node:path'

export function createProjectWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1400,
    height: 920,
    minWidth: 980,
    minHeight: 720,
    title: 'GenOffice Project',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (app.isPackaged) {
    void win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    void win.loadURL('http://localhost:5181')
  }

  return win
}

export function startProjectStandalone(): void {
  app.whenReady().then(() => {
    createProjectWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createProjectWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
