<template>
  <div class="wrapBox" v-if="item" @click="openItem">
    <Pic :prop_src="item.defaultPicUrl"></Pic>
    <!-- 商品名称 -->
    <div>
      <p>{{ item.name }}</p>
    </div>
    <!-- 价格 -->
    <div>￥{{ (item.defaultPrice * 1).toFixed() }}</div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      default: ""
    },
    floor: { default: 1 }
  },
  methods: {
    openItem() {
      this.floor == 1 && window.open("/item/" + this.item.id);
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
