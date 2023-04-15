<template>
  <ContentBox>
    <div class="wrapBox">
      <div class="brand" @mouseenter="hoverCb">
        品牌分类
        <Pic prop_src="triangle.png"></Pic>
      </div>
      <template v-for="item in title">
        <div :key="item">
          <Pic prop_src="bone.png" prop_class="boneImg"></Pic>
          <span class="pointer">{{ item }}</span>
        </div>
      </template>
    </div>
  </ContentBox>
</template>
<script>
export default {
  props: {
    hoverCb: {
      default: () => () => {}
    }
  },
  data() {
    return {
      title: [
        "品牌特卖",
        "潮品视频",
        "小剧场",
        "爱宠课堂",
        "萌爪课堂",
        "清仓特价"
      ]
    };
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
