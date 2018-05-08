var { app, BrowserWindow } = require('electron');

let win = null;

app.on('ready', () => {

    win = new BrowserWindow({
        width: 1200, height: 720, webPreferences: {
            nodeIntegration: false
        }
    });

    win.webContents.on('crashed', () => {
        win.destroy();
        createWindow();
    });

    win.loadURL('http:localhost:8081/dist'); //win.loadURL('');

    win.on('closed', () => {
        win = null;
    })
/*
    var session = win.webContents.session
    session.setProxy("http=192.168.0.5:3000", function() {
        console.log('done proxy kind of things');
    });*/

})

app.on('activate', () => {
    if (win == null) createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
})
