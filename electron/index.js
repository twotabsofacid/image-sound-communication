// Modules to control application life and create native browser window
const { app, BrowserWindow, screen } = require('electron');
const net = require('node:net');
const client = new net.Socket();
const port = 6969;

const v8 = require('v8');
v8.setFlagsFromString('--expose_gc');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('js-flags', '--expose_gc');
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('enable-precise-memory-info');
app.commandLine.appendSwitch('use-fake-ui-for-media-stream');
app.commandLine.appendSwitch('force_high_performance_gpu');
app.commandLine.appendSwitch('enable-speech-input');

let senderWindow = null;
let receiverWindow = null;

const createSender = () => {
  // Create the browser window.
  const _senderWindow = new BrowserWindow({
    frame: true,
    width: 1024,
    height: 768,
    alwaysOnTop: false,
    enableLargerThanScreen: true,
    autoHideMenuBar: false,
    movable: true,
    resizable: true,
    kiosk: false,
    fullscreen: false,
    webPreferences: {
      backgroundThrottling: false
    }
  });
  // and load the index.html of the app.
  _senderWindow.loadURL(`http://localhost:${port}/sender`);
  _senderWindow.setBackgroundThrottling(false);
  _senderWindow.webContents.setBackgroundThrottling(false);
  _senderWindow.webContents.on('render-process-gone', (_, details) => {
    console.log('Render Process Gone', Date().toString(), details);
  });
  _senderWindow.on('closed', () => {
    app.exit();
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  return _senderWindow;
};

const createReceiver = () => {
  // Create the browser window.
  const _receiverWindow = new BrowserWindow({
    frame: true,
    width: 1024,
    height: 768,
    alwaysOnTop: false,
    enableLargerThanScreen: true,
    autoHideMenuBar: false,
    movable: true,
    resizable: true,
    kiosk: false,
    fullscreen: false,
    webPreferences: {
      backgroundThrottling: false
    }
  });
  // and load the index.html of the app.
  _receiverWindow.loadURL(`http://localhost:${port}/receiver`);
  _receiverWindow.setBackgroundThrottling(false);
  _receiverWindow.webContents.setBackgroundThrottling(false);
  _receiverWindow.webContents.on('render-process-gone', (_, details) => {
    console.log('Render Process Gone', Date().toString(), details);
  });
  _receiverWindow.on('closed', () => {
    app.exit();
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  return _receiverWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  let startedElectron = false;
  const tryConnection = () =>
    client.connect({ port: port }, () => {
      client.end();
      if (!startedElectron) {
        console.log('starting electron');
        startedElectron = true;
        senderWindow = createSender();
        receiverWindow = createReceiver();
        console.log('we created the windows....');
        process.on('SIGINT', function () {
          console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
          // some other closing procedures go here
          process.exit(0);
        });
      }
    });
  tryConnection();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
