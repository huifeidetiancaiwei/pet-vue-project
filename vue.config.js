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
    port: 80,
    allowedHosts:[
      "www.csktedu.com"
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:9001',
        ws: true,
        changeOrigin: true,
        pathRewrite: {'^/api': '/'}
      }
    }
  }
}
