'use strict';

var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var mainWindow = null;
var ipc = require('electron').ipcMain;

ipc.on('close-main-window', function() {
    app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        resizable: true,
        height: 600,
        width: 800,
        icon: 'app/img/icon.png'
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
