const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

const createWindow = () => {
    // Menu.setApplicationMenu(null)
    
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    })

    mainWindow.maximize();

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.insertCSS('html, body { overflow: hidden; height: 100%; margin: 0; user-select: none; }')
    })

    // Try to connect to Vite's dev server first
    const devServerURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'

    // If you are running 'npm run dev', load the URL. Otherwise, load the file.
    if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
        mainWindow.loadURL(devServerURL)
        // mainWindow.webContents.openDevTools() // Helpful for debugging Vue errors
    } else {
        // Make sure this path points correctly to your built dist folder relative to main.js
        mainWindow.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'))
    }
}

app.whenReady().then(() => {
    createWindow()
})