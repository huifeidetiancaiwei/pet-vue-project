<template>
  <ContentBox prop_class="bgcolor">
    <div class="navBox">
      <div>
        <span class="pointer" @click="toHome">
          <Pic prop_class="pic trans_color" prop_src="home.png"></Pic>宠爱首页
        </span>
        <span class="pointer" @click="toHome">
          <Pic
            prop_class="pic trans_color"
            prop_src="paw_pet.png"
            class="pointer"
            @click="toHome"
          ></Pic
          >宠爱有家就是正品
        </span>
      </div>
      <div>
        <span v-if="userInfo.id">
          {{ userInfo.userName || userInfo.account }}
          <span class="pointer" @click="logoutHandler">[退出]</span>
        </span>

        <span v-if="!userInfo.id" class="pointer" @click="loginHandler"
          >[登录]</span
        >

        <span @click="toCart">
          <Pic prop_class="pic" prop_src="shopping-car.png"></Pic>购物车(
          <span>{{ userInfo.cartCount || 0 }}</span> )
        </span>
        <span> <Pic prop_class="pic" prop_src="mine.png"></Pic>我的爱宠 </span>
        <span> <Pic prop_class="pic" prop_src="collect.png"></Pic>收藏 </span>
        <span> <Pic prop_class="pic" prop_src="phone.png"></Pic>手机版 </span>
        <span class="select">问题反馈</span>
      </div>
    </div>
  </ContentBox>
</template>
<script>
import { logout, cartCount } from "@/http";

export default {
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    token() {
      return this.$store.state.token;
    }
  },
  watch: {
    //计算属性是惰性的,所以在这里加上监听
    token: function(val) {
      if (!val) {
        this.$store.dispatch("userInfo", {});
      }
    }
  },
  created() {
    cartCount.call(this);
  },
  methods: {
    toCart() {
      if (!this.$store.state.token) {
        //弹窗需登录的提示
        this.$store.dispatch("navBarShowPop", false);
        this.$store.dispatch("showPop", true);
      } else {
        this.$router.push("/shoppingcart");
      }
    },
    toHome() {
      this.$router.push("/");
    },
    loginHandler() {
      this.$store.dispatch("navBarShowPop", true);
      this.$store.dispatch("showPop", true);
    },
    logoutHandler() {
      logout().then(() => {
        //这里不判断接口返回信息,不能让接口控制用户退出行为
        this.$store.dispatch("token", "");
        this.$store.dispatch("userInfo", {});
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
