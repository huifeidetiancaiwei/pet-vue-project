<template>
  <div class="empty_box">
    <Pic prop_src="shopping.png"></Pic>
    <div>
      <p>您的购物车空空的，</p>
      <p>快去选购吧！</p>
      <div
        @click="
          () => {
            $router.push('/');
          }
        "
      >
        去首页
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@import url("./index");
</style>
