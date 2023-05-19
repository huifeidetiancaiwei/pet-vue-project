// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
module.exports = {
  lintOnSave: false,
  /*'less-loader': {
      lessOptions: {
          globalVars: {
              blackFont: "#333333",
              themeColor: "#43B292",
              selectColor: "#FA4278",
              greyFont: "#999999"
          }
      }
  },*/
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          globalVars: {
            blackFont: '#333333',
            themeColor: '#43B292',
            selectColor: '#FA4278',
            greyFont: '#999999'
          }
        }
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9001',
        ws: true,
        changeOrigin: true,
        pathRewrite: {'^/api': '/'}
      }
    }
    /*proxy: {
        '/api/ums': {
            target: 'http://localhost:8081',
            ws: true,
            changeOrigin: true,
            pathRewrite: {'^/api/ums': '/ums'}
        },
        '/api/pms': {
            target: 'http://localhost:8011',
            ws: true,
            changeOrigin: true,
            pathRewrite: {'^/api/pms': '/pms'}
        },
        '/api/oms': {
            target: 'http://localhost:8083',
            ws: true,
            changeOrigin: true,
            pathRewrite: {'^/api/oms': '/oms'}
        }
    }*/
  }
}
