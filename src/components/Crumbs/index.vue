<template>
  <ContentBox>
    <div class="wrapBox">
      <div v-if="params.name">
        <div>
          <div>{{ params.name }}</div>
        </div>
        <div v-if="params.secName">
          <div>{{ params.secName }}</div>
        </div>
        <div v-if="showLast">商品详情</div>
      </div>
    </div>
  </ContentBox>
</template>
<script>
export default {
  props: ["prop_data"],
  data() {
    return {
      params: {
        //要传出的
        name: "",
        secName: ""
      },
      showLast: false
    };
  },
  created() {
    let name = "";
    let secName = "";
    //判断prop_data是不是数组
    if (this.prop_data && this.prop_data instanceof Array) {
      name = this.prop_data[0].name;
      secName = this.prop_data[1] && this.prop_data[1].name;
    } else {
      let newObj = { ...this.$route.params.commodityList, ...this.prop_data };
      name = newObj.name;
      secName = newObj.secName;
    }
    this.params = { name, secName };
    this.$route.name === "Item" && (this.showLast = true);
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
