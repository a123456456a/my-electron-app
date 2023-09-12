const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // 除函数外，我们也可以暴露变量
  // foo: 'bar'
  ping: () => ipcRenderer.invoke('ping')
})
