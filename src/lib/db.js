export default class {
  constructor() {
    this.db = null;
  }
  // 打开数据库
  open(params) {
    return new Promise((res, rej) => {
      let request = window.indexedDB.open(params.dbName, params.versions);
      request.onerror = function (event) {
        console.log(event);
        // 错误处理
        rej();
        console.log(" 打开数据库报错");
      };
      request.onsuccess = event => {
        this.db = request.result;
        console.log("打开数据库成功");
        res();
        // 成功处理
      };
      // 数据库更新时的回调
      request.onupgradeneeded = event => {
        console.log('onupdeted......')
        this.db = event.target.result;
        this.createdDB(params);
      };
    });
  }
  // 创建库表
  createdDB(params) {
    params.store.forEach(s => {
      if (!this.db.objectStoreNames.contains(s)) {
        this.db.createObjectStore(s, {
          keyPath: "id"
        });
      }
    })
  }
  // 读取库表数据
  async readAll(params) {
    await this.open(params)
    return new Promise((res, rej) => {
      const transaction = this.db.transaction([params.objName]);
      const objectStore = transaction.objectStore(params.objName);
      var request = objectStore.openCursor()
      const result = []
      request.onerror = function (event) {
        console.log("查询失败")
        rej(event)
      };
      request.onsuccess = function (event) {
        var cursor = event.target.result
        if (cursor) {
          result.push(cursor.value)
          cursor.continue()
        } else {
          res(result)
          console.log("查询完毕")
        }
      }
    })
  }
  async update(params) {
    await this.open(params)
    const store = this.db
      .transaction([params.objName], "readwrite")
      .objectStore(params.objName)

    const p = (s, d) => {
      return new Promise((r, j) => {
        const request = s.put(d)
        request.onsuccess = function (event) {
          r()
        }
        request.onerror = function (event) {
          console.log("数据更新失败")
          j()
        }
      })
    }
    if (params.datas instanceof Array) {
      return Promise.all(params.datas.map(d => {
        return p(store, d)
      }))
    }
    else {
      p(store, params.datas)
    }
  }
}
