const {app, BrowserWindow, ipcMain, Notification} = require('electron');
const path = require('path');
const fs = require('fs');
// 串口
const {SerialPort} = require('serialport');

// 读取config.json的配置
const config = require('./config.json');
// 将网址作为安全机制的一部分
app.commandLine.appendSwitch('unsafely-treat-insecure-origin-as-secure', 'http://localhost:3000')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // 为了安全，我们禁用了 nodeIntegration
      nodeIntegration: false,
      // 但是我们仍然可以使用 preload.js
      preload: path.join(__dirname, 'preload.js'),
      // 为了安全，我们禁用了 enableRemoteModule
      enableRemoteModule: false,
      partition: 'persist:webview'
    }
  });

  // 打开开发者工具
  win.webContents.openDevTools();

  // 加载index.html
  win.loadFile('index.html');

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('serialPort', 'hello from main process')
  })

  const NOTIFICATION_TITLE = '串口错误'
  const NOTIFICATION_BODY = '串口不存在，请检查配置文件'
  const serialPortFunc= () => {
    // 打开串口
    const port = new SerialPort(config.port, {
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      autoOpen: false
    })
    port.open((err) => {
      if (err) {
        console.log('Error opening port: ', err.message)
        return
      }
    })
    // 读取串口数据
    port.on('data', (data) => {
      win.webContents.send('serialPort', data.toString())
    })
  }
  try {
   serialPortFunc()
  } catch (error) {
    new Notification({title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY}).show()
  }
}


// 当配置文件被修改之后，重新加载窗口
fs.watchFile('./config.json', () => {
  if (win) {
    win.reload()
  }
})

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
