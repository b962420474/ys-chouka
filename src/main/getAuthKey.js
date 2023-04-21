const axios = require('axios').default
const jsmd5 = require('js-md5');
const stringfilyCookies = (cookies) => {
  return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';')
}
function getDs() {
  let salt = 'ulInCDohgEs557j0VsPDYnQaaz6KJcv5'
  let time = parseInt(Date.now() / 1000)
  let str = getStr()
  let md5 = jsmd5(`salt=${salt}&t=${time}&r=${str}`)
  return `${time},${str},${md5}`
}



function getStr() {
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let maxPos = chars.length
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[parseInt(Math.floor(Math.random() * maxPos))]
  }
  return code
}
const getToken = async (cookie) => {
  const time = Date.now()
  const { data } = await axios.get(`https://webapi.account.mihoyo.com/Api/login_by_cookie?t=${time}`, {
    headers: {
      'Cookie': cookie
    }
  })
  const account_info = data.data.account_info
  const token = account_info.weblogin_token
  const uid = account_info.account_id
  return {
    token,
    uid
  }
}
const getTid = async (token, uid, cookie) => {
  const { data } = await axios.get(`https://api-takumi.mihoyo.com/auth/api/getMultiTokenByLoginTicket?login_ticket=${token}&token_types=3&uid=${uid}`, {
    headers: {
      'Cookie': cookie
    }
  })
  let newcookie = `stuid=${uid};`
  data.data.list.forEach(dataObj => {
    newcookie += `${dataObj.name}=${dataObj.token};`
  })
  newcookie += cookie
  return newcookie
}
const getUid = async (cookie) => {
  const { data } = await axios.get(`https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn`, {
    headers: {
      'Cookie': cookie
    }
  })
  return data.data.list.map(item => {
    return {
      ...item,
      auth_appid: 'webview_gacha'
    }
  }) || []
}
const getAuthKey = async (cookies) => {
  const results = []
  const cookie = stringfilyCookies(cookies)
  const { token, uid } = await getToken(cookie)
  const newcookie = await getTid(token, uid, cookie)
  const list = await getUid(newcookie)
  for (let item of list) {
    const { data } = await axios({
      url: 'https://api-takumi.mihoyo.com/binding/api/genAuthKey',
      method: 'POST',
      data: JSON.stringify(item),
      headers: {
        'Cookie': newcookie,
        "Content-Type": "application/json;charset=utf-8",
        "Host": "api-takumi.mihoyo.com",
        "Accept": "application/json, text/plain, */*",
        "x-rpc-app_version": "2.28.1",
        "x-rpc-client_type": "5",
        "x-rpc-device_id": "CBEC8312-AA77-489E-AE8A-8D498DE24E90",
        'DS': getDs()
      }
    })
    results.push({
      url: `https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog?win_mode=fullscreen&authkey_ver=1&sign_type=2&auth_appid=webview_gacha&init_type=301&gacha_id=b4ac24d133739b7b1d55173f30ccf980e0b73fc1&lang=zh-cn&device_type=mobile&game_version=CNRELiOS3.0.0_R10283122_S10446836_D10316937&plat_type=ios&game_biz=${item.game_biz}&size=20&authkey=${encodeURIComponent(data.data.authkey)}`,
      ...item
    })
  }
  return results
}
module.exports = { getAuthKey }