<template>
  <div>
    <NavBar></NavBar>
    <Search></Search>
    <ContentBox>
      <div class="res_box">
        <Pic
          :prop_src="
            $route.params.payStatus == 1 ? 'result_1.png' : 'result_2.png'
          "
        ></Pic>
        <div class="res_tips">
          <p>{{ $route.params.payStatus == 1 ? "支付成功" : "支付失败" }}</p>
          <p>
            系统 {{ timer }}s 后自动跳转到首页，若未跳转，请手动点击
            <span class="pointer" @click="() => $route.push('/')">首页</span>
            ...
          </p>
        </div>
      </div>
    </ContentBox>
    <Footer></Footer>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import Search from "@/components/Search";
import Footer from "@/components/Footer";
import { countDown } from "@/assets/utils";
export default {
  components: {
    NavBar,
    Footer,
    Search
  },
  data() {
    return {
      timer: 5
    };
  },
  methods: {
    refreshTimer(totalTime) {
      this.timer = totalTime;
    }
  },
  mounted() {
    countDown(this.timer, this.refreshTimer, () => this.$router.push("/"));
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
