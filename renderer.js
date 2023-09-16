const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${electronAPI.chrome()}) 渲染页面，使用 Node (v${electronAPI.node()}) 运行后台，使用 Electron (v${electronAPI.electron()}) 打包。`
const func = async () => {
  const response = await window.electronAPI.ping()
  console.log(response)
}
func()

window.electronAPI.data((event, message) => {
  console.log(message)
})
