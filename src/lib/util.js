import DB from './db'
const fs = window.fs
const path = window.path
const makeDir = function (p) {
  p = p.trim()
  let resolve1, reject1
  const promise = new Promise((resolve, reject) => {
    resolve1 = resolve
    reject1 = reject
  })
  fs.access(p, async (err) => {
    if (err) {
      await makeDir(path.dirname(p))
      fs.mkdir(p, (e) => {
        if (e) {
          reject1(e)
          return
        }
        resolve1()
      })
    } else {
      resolve1()
    }
  })
  return promise
}
class ArrayList {
  constructor() {
    this.map = {}
    this.length = 0
  }

  push(...data) {
    data.forEach(d => {
      if (this.map[d.name] && this.map[d.name].length > 0) {
        this.map[d.name].push(d)
      } else {
        this.map[d.name] = [d]
        this.length += 1
      }
    })
  }

  concat(other) {
    const keys = Object.keys(other.map)
    keys.forEach(k => {
      this.push(...other.map[k])
    })
    return this
  }

  from() {
    const keys = Object.keys(this.map)
    return keys.map(k => {
      return {
        ...this.map[k][0],
        count: this.map[k].length
      }
    })
  }
  fromLineArray(){
    const results = []
    const keys = Object.keys(this.map)
    keys.forEach(key=>{
      this.map[key].forEach(item=>{
        results.push(item)
      })
    })
    return results
  }
}
const db = new DB()
const dbParams = {
  versions: 1,
  store: [
    'wq',
    'up',
    'cz',
    'xs'
  ]
}
const save = (uid, type, data) => {
  if (window.navigator.userAgent.indexOf('--electron') !== -1) {
    let datas = localStorage.getItem(uid) || '{}'
    datas = JSON.parse(datas)
    datas[type] = data
    localStorage.setItem(uid, JSON.stringify(datas))
  }
  else {
    try {
      db.update({
        ...dbParams,
        dbName: uid,
        objName: type,
        datas: data
      })
    } catch (error) {
      console.log(error)
    }
  }
}
const getLocalData = async (id, type) => {
  let data = []
  try {
    if (window.navigator.userAgent.indexOf('--electron') !== -1) {
      data = JSON.parse(localStorage.getItem(id))[type] || []
    }
    else {
      data = await db.readAll({
        ...dbParams,
        dbName: id,
        objName: type
      })
    }
  } catch (error) {
    console.log(error)
    console.log(`暂无uid:${id}的${type}数据`)
  }
  return data
}
const sleep = (delay = 500) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}
export {
  makeDir,
  save,
  ArrayList,
  getLocalData,
  sleep
}
