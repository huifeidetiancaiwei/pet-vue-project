<template>
  <div class="wrapBox">
    <!-- swiper1 -->
    <swiper
      class="swiper gallery-top"
      :options="swiperOptionTop"
      ref="swiperTop"
    >
      <swiper-slide v-for="item in modelList" :key="item.id">
        <Pic prop_class="pic-box" :prop_src="item.picUrl"></Pic>
      </swiper-slide>
    </swiper>
    <!-- swiper2 Thumbs -->
    <div class="my_slide_box">
      <div
        class="swiper gallery-thumbs swiper-container swiper-container-horizontal"
        ref="swiperThumbs"
      >
        <div class="swiper-wrapper" :style="swiperThumbsStyle">
          <div
            v-for="(item, index) in modelList"
            :key="item.id"
            class="swiper-slide"
            :class="index == swiperIndex && 'swiper-slide-active'"
            :style="`width:${100 / thumbsSlides}%`"
            @click="clickIndex(index)"
          >
            <Pic prop_class="pic-box" :prop_src="item.picUrl"></Pic>
          </div>
        </div>
      </div>
      <div
        class="swiper-button-prev"
        slot="button-prev"
        @click="prevClick"
      ></div>
      <div
        class="swiper-button-next"
        slot="button-next"
        @click="nextClick"
      ></div>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "vue-awesome-swiper/node_modules/swiper/dist/css/swiper.css";
export default {
  components: {
    swiper,
    swiperSlide
  },
  props: ["prop_item"],
  data() {
    return {
      modelList: [], //图片数据据
      swiperIndex: 0, //swiper下标
      swiperThumbsStyle: {
        //控制栏动态样式
        transform: "translateX(0)"
      },
      thumbsSlides: 4, //swiper控制栏显示个数

      swiperOptionTop: {
        on: {
          slideChangeTransitionStart: () => {
            this.swiperIndex = this.$refs.swiperTop.swiper.activeIndex;
          }
        }
      }
    };
  },
  watch: {
    prop_item(val) {
      this.modelList = val.skuPicList;
      this.componetInit(0);
    }
  },
  mounted() {
    this.componetInit(0);
  },
  methods: {
    prevClick() {
      let num = this.swiperIndex;
      this.clickIndex(--num >= 0 ? num : 0);
    },
    nextClick() {
      let num = this.swiperIndex;
      let len = this.modelList.length;
      this.clickIndex(++num < len ? num : len - 1);
    },
    //归零
    componetInit(index) {
      this.swiperIndex = index;
      this.$refs.swiperTop.swiper.slideTo(index);
    },
    //点击切换
    clickIndex(index) {
      /**
       * 计算移动距离
       * 数组长度减去当前下标如果大于等于显示个数
       * thumbsSlides swiper控制栏显示个数
       * modelList 图片数据据
       */
      if (this.modelList.length - index >= this.thumbsSlides) {
        this.swiperThumbsStyle.transform = `translateX(-${(100 /
          this.thumbsSlides) *
          index}%)`;
      }
      this.componetInit(index);
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
