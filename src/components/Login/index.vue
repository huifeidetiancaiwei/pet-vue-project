<template>
    <div class="popup_login">
        <div  id="wx_login_container" class="wxLogin" style="padding-left: 90px"></div>
        <div v-if="showPhoneLogin" id="phone_login">
            <p class="login_title">手机验证码登录</p>
            <div class="login_name">
                <div>
                    <pic prop_src="mine.png"></pic>
                    <input
                            type="text"
                            placeholder="请输入手机号"
                            v-model="phone"
                            maxlength="11"
                            @blur="checkPhone"
                    />
                </div>
                <p>{{ phoneErr }}</p>
            </div>
            <div class="login_vcode">
                <div>
                    <input
                            type="text"
                            placeholder="请输入短信验证码"
                            v-model="vcode"
                            @blur="checkVcode"
                    />
                    <span
                            :disabled="getSmsButton"
                            class="pointer"
                            :class="timer ? 'disabled' : ''"
                            @click="getVerifyCode"
                            v-html="timer || '获取验证码'"
                    ></span>
                </div>
                <p>{{ vcodeErr }}</p>
            </div>

            <div
                    class="login_btn pointer"
                    :class="loginReady ? 'login_btn_ready' : ''"
                    @click="loginHandler"
            >
                登录
            </div>
        </div>

        <p class="login_tip" v-show="showLoading">正在登录</p>
        <div class="login_bottom">
            <div class="pointer" @click="wechat">
                <span>第三方登录</span>
                <Pic prop_src="weixin.png"></Pic>
            </div>
            <span class="pointer" @click="destroyPop">遇到问题?</span>
        </div>
    </div>
</template>
<script>
import {validateRequire, validatePhone, countDown} from '@/assets/utils'
import {sendSms, login, getUserByToken, cartCount} from '@/http'

export default {
  data() {
    return {
      phoneErr: '', //手机号错误提示
      vcodeErr: '', //验证码错误提示
      phone: '', //手机号
      vcode: '', //验证码
      timer: false, //倒计时
      getSmsButton: true, //获取短信验证码状态
      showLoading: false,
      showPhoneLogin: true
    }
  },
  computed: {
    loginReady() {
      //判断是否可以请求登录
      return !this.phoneErr && !this.vcodeErr && this.phone && this.vcode
    }
  },
  methods: {
    //调用父级销毁事件
    destroyPop() {
      this.$store.dispatch('showPop', false)
    },
    //手机号校验
    checkPhone() {
      validateRequire.call(
        this,
        this.phone,
        errMsg => (this.phoneErr = errMsg)
      )
      validatePhone.call(this, this.phone, errMsg => (this.phoneErr = errMsg))
    },
    //验证码校验
    checkVcode() {
      validateRequire.call(
        this,
        this.vcode,
        errMsg => (this.vcodeErr = errMsg)
      )
    },
    //开始倒计时
    countDownStart() {
      this.getSmsButton = true
      this.timer = 60 + 's后重新获取'
      countDown(
        60,
        res => (this.timer = res + 's后重新获取'),
        () => {
          this.timer = false
          this.getSmsButton = false
        }
      )
    },
    //获取验证码
    getVerifyCode() {
      this.checkPhone()
      if (!this.phoneErr) {
        this.countDownStart()
        sendSms({phone: this.phone, codeType: 1})
      }
    },
    //执行登陆
    loginHandler() {
      if (!this.loginReady) return
      this.showLoading = true
      login({phone: this.phone, sms: this.vcode}).then(res => {
        if (res.data && res.data.token) {
          this.$store.dispatch('token', res.data.token)
          getUserByToken().then(res => {
            this.showLoading = false
            this.$store.dispatch('userInfo', {...res.data})
            cartCount.call(this)
          })
        } else {
          this.showLoading = false
        }
        this.$store.dispatch('navBarShowPop', true)
        this.$store.dispatch('showPop', false)
      })
    },
    wechat() {
      //loginWechat();
      this.showPhoneLogin=false
      this.getWeChatQrCode()
      //this.showWeChatLogin=true
    },

    getWeChatQrCode() {
      new WxLogin({
        self_redirect: false,
        id: 'wx_login_container',
        appid: 'wx9dbc36f6430dc621',
        scope: 'snsapi_login',
        redirect_uri: encodeURIComponent('http://www.csktedu.com/'),
        state: Math.random(),
        style: 'black',
        href: ''
      })
    }

  }
}
</script>
<style lang="less" scoped>
@import url("./index");

</style>
