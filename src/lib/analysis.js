import axios from 'axios'
import { isInUp } from './upInfo'
import { save, ArrayList, getLocalData, sleep } from './util'
const UP = '301'
const CHANGZHU = '200'
const WUQI = '302'
const XINSHOU = '100'
const map = {
  301: 'up池',
  302: '武器池',
  200: '常驻池',
  100: '新手池'
}
const parserUrl = (url) => {
  let uri = new URL(url)
  const authkey = uri.searchParams.get('authkey')
  const timestamp = uri.searchParams.get('timestamp')
  const auth_appid = uri.searchParams.get('auth_appid')
  const gacha_id = uri.searchParams.get('gacha_id')
  const authkey_ver = uri.searchParams.get('authkey_ver')
  const sign_type = uri.searchParams.get('sign_type')
  const device_type = uri.searchParams.get('device_type')
  const game_version = uri.searchParams.get('game_version')
  const plat_type = uri.searchParams.get('plat_type')
  const region = uri.searchParams.get('region')
  const game_biz = uri.searchParams.get('game_biz')
  uri = new URL('https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog?win_mode=fullscreen&authkey_ver=1&sign_type=2&auth_appid=webview_gacha&init_type=301&gacha_id=b4ac24d133739b7b1d55173f30ccf980e0b73fc1&lang=zh-cn&device_type=mobile&game_version=CNRELiOS3.0.0_R10283122_S10446836_D10316937&plat_type=ios&game_biz=hk4e_cn&size=20&authkey=hOLCiH5KqAPaDEFcHSaE%2B4Sc9ev4flVwiDCZ10cFMo%2FZDnZ25wFKu3q4B553q5j64Bcur7bfMRh4XuUGfEE4w6ONddKVni7mE%2BxXU9AckXqY73mMhw8WuoDmeH3Y3VYPqlwuy3STTM9Yv83rk3%2B9kXpYtme0Hft9SIB8ps0zc9t8nxsCLUYnUQLYts95eB8Ar39z6F%2FVjY1jM8zzWDdHxW2IpTpWe9%2FnCy8%2F8wHXr63aHVrrcmxLI8t7UNvGNvzXPuyK61F8HHAaoPtbWQBZ8M2oT6mOzkK7dV%2F7NaFizxFge52cD96eCr63eXQYFer4ZxeUTbStQqPultmSVEV9BA%3D%3D&region=cn_gf01&timestamp=1664481732&gacha_type=200&page=1&end_id=0')
  uri.searchParams.set('authkey', authkey)
  uri.searchParams.set('timestamp', timestamp)
  uri.searchParams.set('auth_appid', auth_appid)
  uri.searchParams.set('gacha_id', gacha_id)
  uri.searchParams.set('authkey_ver', authkey_ver)
  uri.searchParams.set('sign_type', sign_type)
  uri.searchParams.set('device_type', device_type)
  uri.searchParams.set('game_version', game_version)
  uri.searchParams.set('plat_type', plat_type)
  uri.searchParams.set('region', region)
  uri.searchParams.set('game_biz', game_biz)
  uri.searchParams.set('page', 1)
  return uri
}

const composeUrl = (uri, type) => {
  uri.searchParams.set('gacha_type', type)
  return uri
}
const AnalysisQiYuan = async (url, callback) => {
  console.log(url)
  const uri = parserUrl(url)
  const cz = await getChangzhu(uri, callback)
  const wq = await getWuqi(uri, callback)
  const up = await getUp(uri, callback)
  const xs = await getXinshou(uri, callback)
  return {
    cz,
    wq,
    up,
    xs
  }
}
const dataUnique = (data) => {
  const inMap = {}
  const results = []
  data.forEach(item => {
    if (!inMap[item.id]) {
      inMap[item.id] = true
      results.push(item)
    }
  })
  return results
}
const getUid = (data) => {
  return data.length > 0 && data[0].uid || ''
}
const findMinCount = (data) => {
  const results = [].concat(data)
  results.sort((a, b) => a.start_5count - b.start_5count)
  return results
}
// 常驻
const assestChangZhuData = (l) => {
  const data = parserData(l)
  // console.log(data._5starInfo)
  data.list = l
  return data
}
const getChangzhu = async (uri, callback) => {
  const u = composeUrl(uri, CHANGZHU)
  let l = await getGachaLog(u, callback)
  const uid = getUid(l)
  l = dataUnique((await getLocalData(uid, 'cz')).concat(l))
  save(uid, 'cz', l)
  const data = assestChangZhuData(l)
  return data
}
// 武器
const assestWuqiData = (l) => {
  const data = parserData(l)
  data.list = l
  return data
}
const getWuqi = async (uri, callback) => {
  const u = composeUrl(uri, WUQI)
  let l = await getGachaLog(u, callback)
  const uid = getUid(l)
  l = dataUnique((await getLocalData(uid, 'wq')).concat(l))
  save(uid, 'wq', l)
  // const data = parserData(l)
  // //console.log(data._5starInfo)
  // data.list = l
  const data = assestWuqiData(l)
  return data
}
// up
const assestUpData = (l) => {
  const data = parserData(l)
  data.upList = data._5starInfo.filter(d => isInUp(d, true))
  data._5starInfo.forEach((item, index, array) => {
    if (!isInUp(item, true)) {
      item.tag = '歪'
    } else if (index === 0 || array[index - 1].tag !== '歪') {
      item.tag = '小保底'
    } else {
      item.tag = '大保底'
    }
  })
  // console.log(data._5starInfo)
  data.list = l
  return data
}
const getUp = async (uri, callback) => {
  const u = composeUrl(uri, UP)
  let l = await getGachaLog(u, callback)
  const uid = getUid(l)
  l = dataUnique((await getLocalData(uid, 'up')).concat(l))
  save(uid, 'up', l)
  const data = assestUpData(l)
  return data
}

// 新手
const assestXinshouData = (l) => {
  const data = parserData(l)
  data.list = l
  return data
}
const getXinshou = async (uri, callback) => {
  const u = composeUrl(uri, XINSHOU)
  let l = await getGachaLog(u, callback)
  const uid = getUid(l)
  l = dataUnique((await getLocalData(uid, 'xs')).concat(l))
  save(uid, 'xs', l)
  const data = assestWuqiData(l)
  return data
}
const getGachaLog = async (uri, callback) => {
  let end_id = 0
  const results = []
  try {
    for (let i = 1; i < 99999; i++) {
      // console.log(`正在查询${map[uri.searchParams.get('gacha_type')]}第${i}页`)
      callback && callback(null, `正在查询${map[uri.searchParams.get('gacha_type')]}第${i}页`)
      uri.searchParams.set('end_id', end_id)
      const list = await getdata(uri)
      if (list.length > 0) {
        results.push(...list)
        end_id = list[list.length - 1].id
        await sleep(300)
      }
      else {
        break;
      }
    }
  } catch (error) {
    callback(error)
    return Promise.reject(error)
  }
  return results.reverse()
}
const parserData = (data) => {
  const total_all = data.length
  // 统计武器的数量
  let total_wuqi = 0
  // 统计角色的数量
  let total_juese = 0
  // 统计3星数量
  let total_3star = 0
  // 统计4星的数量
  let total_4star = 0
  const _5starInfo = []
  const _4starInfo = new ArrayList()
  let start_5count = 0
  let start_4count = 0
  if (data.length <= 0) {
    return {
      total_all,
      total_juese,
      total_wuqi,
      total_3star,
      total_4star,
      _5starInfo,
      _4starInfo,
      uid: ''
    }
  }
  const uid = data[0].uid
  data.forEach(d => {
    start_5count++
    start_4count++
    if (d.rank_type === '3') {
      total_3star += 1
    } else if (d.rank_type === '4') {
      total_4star += 1
      _4starInfo.push({
        ...d,
        start_4count
      })
      start_4count = 0
    } else {
      _5starInfo.push({
        ...d,
        start_5count
      })
      start_5count = 0
      start_4count = 0
    }
    if (d.item_type === '武器') {
      total_wuqi += 1
    } else {
      total_juese += 1
    }
  })
  data = data.reverse()
  return {
    start_5count,
    total_all,
    total_juese,
    total_wuqi,
    total_3star,
    total_4star,
    _5starInfo,
    _4starInfo,
    uid
  }
}
const getdata = async (uri) => {
  const { data } = await axios.get(uri.href)
  if (data.retcode === -101) {
    return Promise.reject('祈愿地址已失效，查询失败')
  }
  return (data.data && data.data.list) || []
}
const queryDataById = async (id) => {
  const cz = assestChangZhuData(await getLocalData(id, 'cz'))
  const wq = assestWuqiData(await getLocalData(id, 'wq'))
  const up = assestUpData(await getLocalData(id, 'up'))
  const xs = assestXinshouData(await getLocalData(id, 'xs'))
  return {
    cz,
    wq,
    up,
    xs
  }
}

export { AnalysisQiYuan, queryDataById, parserUrl }
