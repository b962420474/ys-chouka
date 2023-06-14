const { BrowserWindow } = require('electron')
const { getAuthKey } = require('./getAuthKey')
const { recoverCookie, clear } = require('./cookieUtil')
const createWindow = async (top) => {
  if (global.loginWindow) return
  /**
   * Initial window options
   */
  global.loginWindow = new BrowserWindow({
    height: 650,
    width: 414,
    minWidth: 414,
    minHeight: 600,
    parent: top,
    useContentSize: true,
    autoHideMenuBar: true,
    // enableRemoteModule: false,
    // resizable: false,
    // minimizable: false,
    // maximizable: false,
    // fullscreenable: false,
    // skipTaskbar: true,
    webPreferences: {
      contextIsolation: false,
      webSecurity: false,
      nodeIntegration: true
    }
  })
  let webContent = global.loginWindow.webContents
  // webContent.openDevTools()
  await recoverCookie(webContent, 'loginWindow')
  global.loginWindow.on('close', function () { clear(), global.loginWindow = null, webContent = null })
  global.loginWindow.loadURL('https://user.mihoyo.com', {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
  })
  on(webContent)
}
const isLogin = (cookies) => {
  return cookies.filter(item => item.name === 'login_ticket').length > 0
}
const on = (webContent) => {
  webContent.on('did-navigate-in-page', async () => {
    const url = webContent.getURL()
    if (url.split('#')[1] === '/account/home') {
      const cookies = await webContent.session.cookies.get({
        url: 'https://user.mihoyo.com'
      })
      if (isLogin(cookies)) {
        const list = await getAuthKey(cookies)
        list.forEach(item => {
          webContent.executeJavaScript(`
          function injectHtml(nickname, url) {
            let template = \`
            <div class="sub-title">
              <span>抽卡链接-$\{nickname\}</span>
            </div>
              <ul class="info-content">
                <li>
                  <div style="word-break: break-all; white-space: pre-wrap;" id='text'></div>
                </li>
              </ul>
            \`
            let div = document.createElement('div')
            div.innerHTML = template
            document.querySelector('.mhy-account-main-page.mhy-container-content').appendChild(div)
            document.getElementById('text').innerText = url
          }
          `, true)
          webContent.executeJavaScript(`injectHtml('${item.nickname}','${item.url}')`, true)
        })
      }
    }
  })
}
const login = (top) => {
  createWindow(top)
}

module.exports = { login }
