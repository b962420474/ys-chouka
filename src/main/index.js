
const { ipcMain } = require('electron')
const { login } = require('./login')
const register = () => {
  ipcMain.on('openLogin', function (event) {
    login()
    event.sender.send('openLogin', null)
  })
}
module.exports = { register }