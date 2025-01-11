import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {getUserData} from '@/assets/utils'
import ContentBox from '@/components/ContentBox'
import Pic from '@/components/Pic'
import Popup from '@/components/Popup'
import Login from '@/components/Login'
import Toast from '@/components/Toast'
import {getUserByToken} from '@/http'
import qs from 'qs'
// 禁用生产环境的提示
Vue.config.productionTip = false
// 前置路由守卫，在每一次页面跳转之前执行
router.beforeEach((to, from, next) => {
  let url = window.location.href
  //获取到微信登录成功后的回调参数
  if (url.startsWith('http://www.csktedu.com/?code')) {
    let wxCode = qs.parse(url.split('?')[1]).code
    if (wxCode) {
      store.state.wxCode = wxCode
      //  wxCode不为空，则表示是由微信登录跳转过来的，可以直接通过vuex发起后台请求
      store.dispatch('weChatLogin').then(()=>{
        next()
      })
    }
  }
  
  let nextObj = {}
  store.dispatch('showPop', false)
  //如果不前往商品列表页,重置searchoption
  if (to.name !== 'CommodityList') {
    store.dispatch('searchoption', {
      brandId: '',
      productLevel1CategoryId: '',
      productLevel2CategoryId: '',
      keyword: '',
      productAttributeIds: [],
      sort: 1
    })
  }
  //如果token为空
  if (!getUserData().token) {
    if (
      to.name === 'ShoppingCart' ||
      to.name === 'Account' ||
      to.name === 'Payment'
    ) {
      store.dispatch('navBarShowPop', false)
      store.dispatch('showPop', true)
      nextObj = from
    }
    //url带token的赋值
    if (to.name === 'home') {
      if (to.query.token) {
        store.dispatch('token', to.query.token)
        
        nextObj = to
        
        delete nextObj.query.token
        //当请求路径为首页时,并且请求参数中token不为空时,则获取用户信息
        getUserByToken().then(res => {
          if (res.code === '200') {
            store.dispatch('userInfo', {...res.data})
          }
        })
      }
    }
  }
  next(nextObj)
})
//挂载全局组件
Vue.component('ContentBox', ContentBox)
Vue.component('Pic', Pic)
Vue.component('Popup', Popup)
Vue.component('Login', Login)

Vue.prototype.$toast = Toast

new Vue({
  router,
  store, //状态管理器，在前端存储相关内容，可以理解为缓存，可以减少不必要的请求
  render: h => h(App)
}).$mount('#app')
