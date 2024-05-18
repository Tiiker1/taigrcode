const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');

    // Create the custom menu
    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open File',
                    click: () => {
                        dialog.showOpenDialog({
                            properties: ['openFile']
                        }).then(result => {
                            if (!result.canceled) {
                                const filePath = result.filePaths[0];
                                fs.readFile(filePath, 'utf-8', (err, data) => {
                                    if (err) {
                                        alert('An error occurred reading the file: ' + err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('file-opened', data);
                                });
                            }
                        });
                    }
                },
                {
                    label: 'Save File',
                    click: () => {
                        dialog.showSaveDialog({
                            title: 'Save File'
                        }).then(result => {
                            if (!result.canceled) {
                                const filePath = result.filePath;
                                mainWindow.webContents.send('save-file', filePath);
                            }
                        });
                    }
                },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { type: 'separator' },
                { role: 'selectAll' },
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
