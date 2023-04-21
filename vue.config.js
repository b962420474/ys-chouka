module.exports = {
  runtimeCompiler: true,
  publicPath: './',
  //electron 13 把"build":{}从package.json移除，在vue.config.js里写
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      preload: 'src/preload.js',
      builderOptions: {
        productName: 'ysck', //打包名称
        appId: 'cn.ysck.app',
        copyright: 'Copyright © 2023',
        publish: [
          {
            provider: 'generic',
            url: ''
          }
        ],
        nsis: {
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: 'ysck',
          perMachine: true,
          oneClick: false
        },
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        },
        //productName 包名称 version 包版本(package.json)  ext后缀
        mac: {
          icon: 'public/icon/logo.ico',
          artifactName: '${productName}_setup_${version}.${ext}'
        },
        win: {
          icon: 'public/icon/logo.ico',
          artifactName: '${productName}_setup_${version}.${ext}'
        },
        linux: {
          icon: 'public/icon/logo.ico',
          artifactName: '${productName}_setup_${version}.${ext}'
        }
      }
    }
  }
}