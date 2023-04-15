<template>
  <ContentBox>
    <div class="wrapBox">
      <!-- logo -->
      <div @click="toHome" class="pointer logo">
        <Pic prop_src="logo-02.png"></Pic>
      </div>
      <!-- 所处页面 -->
      <div v-if="showType === 'cart'" class="search_title">购物车</div>
      <div v-if="showType === 'pay' || showType === 'res'" class="search_title">
        订单结算
      </div>
      <!-- 搜索框 -->
      <div class="search_box" v-if="showType !== 'pay'">
        <div>
          <input type="text" v-model="inputVal" />
          <div @click="toSearch" class="pointer search_btn">搜 索</div>
        </div>
        <div v-if="showType === 'def'" class="search_hot">
          <span>热门搜索:</span>
          <span class="hot_selected">冠能</span>
          <span>麦德氏</span>
          <span>湿巾5件7折</span>
          <span>超值套餐</span>
        </div>
      </div>
      <!-- 购物车 -->
      <div
        class="shopping_cart pointer"
        v-if="showType === 'def'"
        @click="toCart"
      >
        <Pic prop_class="img_box" prop_src="shopping-car-big.png"></Pic>
        <span>
          购物车(
          <span class="highlight">{{ userInfo.cartCount || 0 }}</span>
          )
        </span>
      </div>
      <!-- 进度条 -->
      <div v-if="showType === 'pay'" class="search_line">
        <span class="themeColor">购物车</span>
        <span class="themeColor">提交订单</span>
        <span>支付</span>
      </div>
    </div>
  </ContentBox>
</template>
<script>
import { cartCount } from "@/http";

export default {
  name: "search",
  props: {
    searchFn: {
      default: ""
    }
  },
  data() {
    return {
      inputVal: "", //keyword
      currentPage: {
        ShoppingCart: "cart",
        Account: "pay",
        Payment: "pay",
        Result: "res"
      },
      showType: "def"
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    //搜索选项
    searchoption() {
      return this.$store.state.searchoption;
    }
  },
  created() {
    this.currentPage[this.$route.name] &&
      (this.showType = this.currentPage[this.$route.name]);

    if (this.userInfo.cartCount !== 0 && this.userInfo.cartCount) {
      cartCount.call(this);
    }
    this.inputVal = this.searchoption.keyword;
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
    toSearch() {
      //为搜索选项赋值keyword
      this.$store.dispatch("searchoption", {
        ...this.$store.state.searchoption,
        keyword: this.inputVal
      });

      if (!this.searchFn) {
        this.$router.push({
          name: "CommodityList",
          params: { keyword: this.inputVal }
        });
      } else {
        this.searchFn({ keyword: this.inputVal });
      }
      //清除所选数据与所选二级分类
      // this.$store.dispatch("classificationData", null);
      this.$store.dispatch("selectSecId", null);
    },
    toHome() {
      this.$router.push("/");
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
