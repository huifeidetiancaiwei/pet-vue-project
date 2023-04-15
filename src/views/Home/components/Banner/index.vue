<template>
  <ContentBox :prop_color="bgColor[swiperIndex]">
    <div class="wrapBox">
      <swiper
        v-if="modelList.length"
        ref="mySwiper"
        class="my-swiper-box"
        :options="swiperOption"
        @transitionStart="callback"
      >
        <swiper-slide v-for="item in modelList" :key="item.id">
          <Pic prop_class="pic-box" :prop_src="item.contentImg"></Pic>
        </swiper-slide>
        <div class="swiper-pagination my-pagination" slot="pagination"></div>
      </swiper>
      <div class="right">
        <div>
          <Pic prop_src="home_pic_1.png"></Pic>
          <p>爱 萌 之 家</p>
          <p>养宠生活如此简单</p>
        </div>
        <div>
          <Pic prop_src="home_pic_2.png"></Pic>
          <p>招 募 令</p>
          <p>i wan't you</p>
        </div>
        <div>
          <Pic prop_src="home_pic_3.png"></Pic>
          <p>品 牌 特 卖</p>
          <p>荟萃大牌特卖</p>
        </div>
      </div>
    </div>
  </ContentBox>
</template>
<script>
import "vue-awesome-swiper/node_modules/swiper/dist/css/swiper.css";

import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      bgColor: ["#B9BDAA", "#fff", "#735D46"] /**banner背景色*/,
      modelList: [
        {
          contentImg: "banner1.png",
          modelName: "",
          id: "1"
        },
        {
          contentImg: "banner2.png",
          modelName: "",
          id: "2"
        },
        {
          contentImg: "banner3.png",
          modelName: "",
          id: "3"
        }
      ],
      swiperIndex: 0,
      swiperOption: {
        slidesPerView: 1,
        loop: true,
        autoplay: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          renderBullet: function(index, className) {
            return `<span class="${className} my-pagination-bullet" >${index +
              1}</span>`;
          }
        }
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  methods: {
    callback() {
      this.swiperIndex = this.swiper.realIndex;
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
