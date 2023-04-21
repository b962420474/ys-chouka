const Store = require('electron-store')
const store = new Store()
let count = null
const recoverCookie = (webContent, sessionCookieStoreKey) => {
  return new Promise((resolve) => {
    let cookies = store.get(sessionCookieStoreKey) || [];
    let recoverTimes = cookies.length;
    if (recoverTimes <= 0) {
      //无cookie数据无需恢复现场
      resolve()
      return;
    }
    //恢复cookie现场
    cookies.forEach((cookiesItem) => {
      let {
        secure = false,
        domain = '',
        path = ''
      } = cookiesItem

      webContent.session.cookies
        .set(
          Object.assign(cookiesItem, {
            url: (secure ? 'https://' : 'http://') + domain.replace(/^\./, '') + path
          })
        )
        .then(() => {
        })
        .catch((e) => {
          console.error({
            message: '恢复cookie失败',
            cookie: cookiesItem,
            errorMessage: e.message,
          })
        })
        .finally(() => {
          recoverTimes--;
          if (recoverTimes <= 0) {
            resolve();
          }
        })
    })
  }).then(() => {
    //监听cookie变化保存cookie现场
    return new Promise((resolve) => {
      let isCookiesChanged = false;
      webContent.session.cookies.on('changed', () => {
        //检测cookies变动事件，标记cookies发生变化
        isCookiesChanged = true;
      });

      //每隔500毫秒检查是否有cookie变动，有变动则进行持久化
      count = setInterval(() => {
        if (!isCookiesChanged) {
          return;
        }
        webContent.session.cookies.get({})
          .then((cookies) => {
            store.set(sessionCookieStoreKey, cookies);
          })
          .catch((error) => {
            console.log({ error })
          })
          .finally(() => {
            isCookiesChanged = false;
          })
      }, 500);

      resolve();
    })
  })
}
const clear = () => {
  clearInterval(count)
}
module.exports = { recoverCookie, clear }