const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}) 渲染页面，使用 Node (v${versions.node()}) 运行后台，使用 Electron (v${versions.electron()}) 打包。`
const func = async () => {
  const response = await window.versions.ping()
  console.log(response)
}
func()
