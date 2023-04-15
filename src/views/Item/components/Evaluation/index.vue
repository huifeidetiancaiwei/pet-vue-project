<template>
  <div class="wrapBox" v-if="prop_data">
    <Pic prop_class="avatar" :prop_src="prop_data.headUrl"></Pic>
    <div class="content">
      <p>{{ prop_data.userName }}</p>
      <p>{{ prop_data.content }}</p>
      <div
        class="pic_box"
        v-for="(item, index) in prop_data.imgList"
        :key="'pic' + index"
        :class="picSrc === index + '' ? 'zoom_out' : 'zoom_in'"
        @click="picCLick(index)"
      >
        <Pic :prop_src="item"></Pic>
      </div>
      <div
        v-if="picSrc"
        class="show_pic"
        :class="picSrc && 'zoom_out'"
        @click="() => (picSrc = '')"
      >
        <Pic :prop_src="prop_data.imgList[picSrc]"></Pic>
      </div>
      <p>{{ prop_data.addTime }}</p>
    </div>
    <div class="star_wrap">
      <Star :prop_num="prop_data.star"></Star>
    </div>
  </div>
</template>
<script>
import Star from "../Star";

export default {
  props: {
    prop_data: {}
  },
  data() {
    return {
      picSrc: "" //所选图片下标
    };
  },
  components: { Star },
  methods: {
    picCLick(index) {
      this.picSrc === index + ""
        ? (this.picSrc = "")
        : (this.picSrc = index + "");
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
