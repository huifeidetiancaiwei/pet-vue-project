<template>
  <div class="item_box pointer" @click="toDetail">
    <Pic prop_class="pic" :prop_src="item.defaultPicUrl"></Pic>
    <p>{{ item.name }}</p>
    <p>￥{{ item.defaultPrice.toFixed(2) }}</p>
    <p>已销售{{ item.sale }}</p>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      default: {
        id: "",
        name: "",
        sale: "",
        defaultPicUrl: "",
        defaultPrice: ""
      }
    }
  },
  methods: {
    toDetail() {
      let routeUrl = this.$router.resolve({
        path: "/item/" + this.item.id
      });
      window.open(routeUrl.href, "_blank");
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
