const { ipcRenderer } = require('electron')
window.get_qy_address = () => {
  console.log('....')
  return new Promise((resolve) => {
    ipcRenderer.send('openLogin')
    ipcRenderer.on('openLogin', async (event) => {
      resolve()
    })
  })
}