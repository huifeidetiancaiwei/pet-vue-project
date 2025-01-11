// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
module.exports = {
    // 禁用eslint代码规范检查
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
    // 开发环境代理设置
    devServer: {
        port: 80,
        //允许通过指定的域名进行访问，主要是用于微信登录后的回调
        allowedHosts: [
            "www.csktedu.com"
        ],
        // 代理到后台服务器的请求
        proxy: {
            // 表示以 "/api" 做为开头的请求
            '/api': {
                // 代理的目标服务器，本机的 8080 端口
                target: 'http://localhost:8080',
                // websocket的缩写，表示启用websocket 
                ws: true,
                // 是否允许改变请求的域
                changeOrigin: true,
                // 请求路径重写，将请求路径中的 "/api" 删除
                pathRewrite: {'^/api': '/'}
            }
            // '/api/ums':{
            //   // 代理的目标服务器，本机的 8080 端口
            //   target: 'http://localhost:9002',
            //   // websocket的缩写，表示启用websocket 
            //   ws: true,
            //   // 是否允许改变请求的域
            //   changeOrigin: true,
            //   // 请求路径重写，将请求路径中的 "/api" 删除
            //   pathRewrite: {'^/api/ums': '/ums'}
            // },
            // '/api/pms':{
            //   // 代理的目标服务器，本机的 8080 端口
            //   target: 'http://localhost:9101',
            //   // websocket的缩写，表示启用websocket 
            //   ws: true,
            //   // 是否允许改变请求的域
            //   changeOrigin: true,
            //   // 请求路径重写，将请求路径中的 "/api" 删除
            //   pathRewrite: {'^/api/pms': '/pms'}
            // },
            // '/api/oms':{
            //   // 代理的目标服务器，本机的 8080 端口
            //   target: 'http://localhost:9201',
            //   // websocket的缩写，表示启用websocket 
            //   ws: true,
            //   // 是否允许改变请求的域
            //   changeOrigin: true,
            //   // 请求路径重写，将请求路径中的 "/api" 删除
            //   pathRewrite: {'^/api/oms': '/oms'}
            // }
        }
    }
}
