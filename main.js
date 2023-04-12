/**
 * Copyright (c) 2023 Just_Moonify <https://github.com/Zirmith>
 * Released under MIT license
 */

/* global require, __dirname, process */

//svg https://www.svgviewer.dev/s/57322/dragon-head-evil-legend-myth

const electron = require('electron');
const { autoUpdater } = require('electron-updater');

const {app, BrowserWindow, Menu, MenuItem, Tray, ipcMain} = electron;

const path = require('path');
const url = require('url');

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});



let loaderWindow, mainWindow, tray;

ipcMain.on('vigil', (e, args) => {
    if (args.method == 'exit') {
        app.quit();
    } else {
        console.log(args);
    }
    if(args.method == "loadmain"){
        loaderWindow.hide();
        mainWindow.show();
    }
});

// Set the URL for the update feed
autoUpdater.setFeedURL('https://github.com/Zirmith/Vigil-Discord-Helper/releases');

// Check for updates
autoUpdater.checkForUpdates();

// Listen for update events
autoUpdater.on('update-available', (info) => {
  // Send a message back to the renderer process that an update is available
  e.sender.send('update-available', info);
});

autoUpdater.on('update-not-available', () => {
  // Send a message back to the renderer process that no update is available
  e.sender.send('update-not-available');
});

autoUpdater.on('error', (err) => {
  // Handle error
});

autoUpdater.on('download-progress', (progressObj) => {
  // Handle download progress
});

autoUpdater.on('update-downloaded', () => {
  // Prompt the user to install the update
  autoUpdater.quitAndInstall();
});



function createTray() {
    if (tray) {
        tray.destroy();
    }
    tray = new Tray('icon.png');
    tray.setToolTip('Vigil');
    /*
    const contextMenu = Menu.buildFromTemplate([
        {role: 'quit'}
    ]);
    tray.setContextMenu(contextMenu);
    */
    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });
}

function createWindow() {
    // Create the browser window.
    loaderWindow = new BrowserWindow({
        width: 1024,
        height: 600,
        transparent: true,
        frame: false,
        hasShadow: false,
        minWidth: 250,
        minHeight: 120,
        icon: 'icon.png',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    });

    mainWindow = new BrowserWindow({
        width: 1024,
        height: 600,
        backgroundColor: '#000000',
        minWidth: 250,
        minHeight: 120,
        icon: 'icon.png',
        show:false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    });


    var webContents = mainWindow.webContents || mainWindow.getWebContents();

    webContents.on('context-menu', (e, params) => {
        e.preventDefault();
        const context = Menu.buildFromTemplate([
            {
                role: 'copy',
                enabled: params.editFlags.canCopy
            },
            {
                role: 'paste',
                enabled: params.editFlags.canPaste
            },
            {
                role: 'selectall',
                enabled: params.editFlags.canSelectAll
            },
            {
                label: 'inspect Element',
                click() {
                    mainWindow.inspectElement(params.x, params.y);
                    if (webContents.isDevToolsOpened()) {
                        webContents.devToolsWebContents.focus();
                    }
                }
            }
        ]);
        context.popup(electron.remote ? electron.remote.getCurrentWindow() : mainWindow);
    });

    // and load the loader.html of app
    loaderWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'loader.html'),
        protocol: 'file:',
        slashes: true
    }));

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
    createTray();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('before-quit', function() {
    tray.destroy();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
