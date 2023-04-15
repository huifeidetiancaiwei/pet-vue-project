<template>
  <div class="pop_add">
    <div>
      <Pic prop_src="logo2.png"></Pic>
      <div>
        <p>恭喜小主</p>
        <p>成功添加到购物车咯~</p>
      </div>
    </div>
    <div>
      <div @click="toShopping">继 续 购 物</div>
      <div @click="accountFn">立 即 结 算</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    accountFn: {
      default: () => () => {}
    }
  },
  methods: {
    toShopping() {
      this.$store.dispatch("showPop", false);
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
