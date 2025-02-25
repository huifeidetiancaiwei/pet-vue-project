import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {cartCount, getUserByToken, weChatCallBack} from '@/http'
import router from "@/router";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  // 声明需要存储的内容
  state: {
    showNavBar: false, //控制nav bar 是否显示
    classifyTreeList: [], //保存原始商品类别信息
    processingTreeList: [], //处理后的类别数据
    pcdList: [], //省市区数据
    showPop: false, //展示popup
    navBarShowPop: false, //展示popup的登录提示
    userInfo: {}, //用户数据
    selectSecId: null, //所选择的二级分类
    classificationData: null, //分类选项中传递的数据
    token: '', //项目token
    wxCode: '', //微信扫码成功回调code
    /**
     * searchoption
     * brandId  整型  品牌ID  否
     * productLevel1CategoryId  整型  一级分类ID
     * productLevel2CategoryId  整型  二级分类ID  否
     * keyword  字符串  搜索条件  否
     * productAttributeIds  数组  商品属性ID数组  否
     * sort  整型  排序：1->默认；2->销量；3->评论  否
     * pageNo  整型  页码（从1开始），默认1  否
     * pageSize  整型  页长，默认20  否
     */
    searchoption: {
      brandId: '',
      productLevel1CategoryId: '',
      productLevel2CategoryId: '',
      keyword: '',
      productAttributeIds: [],
      sort: 1
    } //搜索选项
  },
  
  mutations: {
    showNavBar(state, bool) {
      return (state.showNavBar = bool)
    },
    showPop(state, bool) {
      return (state.showPop = bool)
    },
    userInfo(state, data) {
      return (state.userInfo = data)
    },
    navBarShowPop(state, bool) {
      return (state.navBarShowPop = bool)
    },
    selectSecId(state, secId) {
      return (state.selectSecId = secId)
    },
    classificationData(state, data) {
      return (state.classificationData = data)
    },
    token(state, data) {
      return (state.token = data)
    },
    //微信回调code
    wxCode(state, data) {
      return (state.wxCode = data)
    },
    
    searchoption(state, data) {
      return (state.searchoption = data)
    },
    /**
     *
     * @param {*} state
     * @param {*} list
     */
    setPCDList(state, list) {
      return (state.pcdList = list)
    },
    /**
     * 用来保存商品类别信息list
     * @param {*} state
     * @param {Array} list 储存的商品类别信息list
     */
    setClassifyTreeList(state, list) {
      let newArr = []
      for (let i = 0; i < list.length; i++) {
        if (!(i % 2)) {
          newArr.push({
            id: [list[i].id],
            name: [list[i].name],
            abbreviation: [list[i].abbreviation],
            level: [list[i].level],
            showStatus: [list[i].showStatus],
            icon: [list[i].icon],
            secProductCategoryList: [list[i].secProductCategoryList]
          })
        } else {
          newArr[Math.floor(i / 2)].id[1] = list[i].id
          newArr[Math.floor(i / 2)].name[1] = list[i].name
          newArr[Math.floor(i / 2)].abbreviation[1] = list[i].abbreviation
          newArr[Math.floor(i / 2)].level[1] = list[i].level
          newArr[Math.floor(i / 2)].showStatus[1] = list[i].showStatus
          newArr[Math.floor(i / 2)].icon[1] = list[i].icon
          newArr[Math.floor(i / 2)].icon[1] = list[i].icon
          newArr[Math.floor(i / 2)].secProductCategoryList[1] =
            list[i].secProductCategoryList
        }
      }
      state.processingTreeList = newArr
      return (state.classifyTreeList = list)
    }
  },
  actions: {
    showNavBar(context, bool) {
      context.commit('showNavBar', bool)
    },
    showPop(context, bool) {
      context.commit('showPop', bool)
    },
    userInfo(context, data) {
      context.commit('userInfo', data)
    },
    setPCDList(context, data) {
      context.commit('setPCDList', data)
    },
    navBarShowPop(context, bool) {
      context.commit('navBarShowPop', bool)
    },
    selectSecId(context, secId) {
      context.commit('selectSecId', secId)
    },
    classificationData(context, data) {
      context.commit('classificationData', data)
    },
    token(context, data) {
      localStorage.token = data
      context.commit('token', data)
    },
    wxCode(context, data) {
      context.commit('wxCode', data)
    },
    searchoption(context, data) {
      context.commit('searchoption', data)
    },
    //  微信登录后，发起后台请求获取token
    weChatLogin(context) {
      return new Promise((resolve, reject) => {
        //调用后台声明的通过上一步获取的code获取用户信息
        weChatCallBack({wxCode: context.state.wxCode}).then(response => {
          const data = response.data
          if (data) {
            //微信登录成功后，将token存入vuex,同时根据token获取用户信息
            context.dispatch('token', data.token)
            getUserByToken().then(res => {
              if (res.data) {
                context.dispatch('userInfo', {...res.data})
              }
            })
          //  同步隐藏登录对话框
            context.dispatch('navBarShowPop',false)
            context.dispatch('showPop',false)
          //  获取购物车数量
            cartCount.call(this)
          }
          //清空vuex中的wxCode
          // context.commit('wxCode', '')
          router.push({path:"/"})
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
})
