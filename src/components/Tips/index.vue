<template>
  <div class="pop_tip">
    <div>
      <Pic prop_src="IP.png"></Pic>
      <div>
        <p>您还没有登录，</p>
        <p>需要登录了才能操作哦！</p>
      </div>
    </div>
    <div>
      <div @click="showLoginFn">登&nbsp;&nbsp;录</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showLoginFn: {
      default: () => () => {}
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
