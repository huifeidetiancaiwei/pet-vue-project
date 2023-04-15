<template>
  <ContentBox>
    <div class="floor_box">
      <div class="floor_top">
        <!-- 楼层标题 -->
        <div class="floor_title">
          <Pic prop_src="home_pet_icon.png"></Pic>
          {{
            floor_num != 1 ? floorObj["floor" + floor_num].title : "宠物主粮"
          }}
        </div>
        <!-- 楼层tab -->
        <div class="floor_title_right">
          <!-- hover -->
          <template v-if="floor_num === 1">
            <div
              v-for="(item, index) in tabArr"
              :key="item.ind"
              @mouseover="hoverTab(index)"
              :class="hoverIndex === index ? 'hover' : ''"
            >
              {{ item.name }}
            </div>
          </template>
          <div v-else class="hover">热门</div>
        </div>
      </div>
      <div class="floor_center">
        <div class="floor_left" :style="leftStyle">
          <!-- 最热商品图片 -->
          <Pic :prop_src="`home_floor_${floor_num}.png`"></Pic>

          <!-- 最热商品标题 -->
          <div class="floor_hot">
            <div class="hot_title">
              --------&nbsp;&nbsp;
              <Pic prop_src="home_icon_1.png"></Pic
              >&nbsp;最热HOT&nbsp;&nbsp;--------
            </div>
            <span
              v-for="item of hotBrand[floor_num - 1]"
              :key="item + '最热HOT'"
              >{{ item }}</span
            >
          </div>
        </div>
        <div class="floor_right">
          <template v-for="(item, index) of dataList">
            <Commodity
              :key="item.id || index"
              :item="item"
              :floor="floor_num"
            ></Commodity>
          </template>
        </div>
      </div>
      <!-- 商品楼层底部的商标 -->
      <div class="floor_bottom">
        <Pic
          v-for="item in 8"
          :key="item"
          :prop_src="`${floor_num}floor_${item + 1}.jpg`"
        ></Pic>
      </div>
    </div>
  </ContentBox>
</template>
<script>
import Commodity from "../Commodity";
import { productSearch } from "@/http";
export default {
  props: {
    floor_num: {
      //当前楼层
      type: Number
    }
  },
  components: { Commodity },
  data() {
    return {
      floorObj: require("@/assets/mock"),
      /**最热品牌 */
      hotBrand: require("@/assets/mock/hotBrand").hotBrand,
      hoverIndex: 0,
      tabArr: [
        { name: "热门", sort: 2, ind: 1 },
        { name: "进口主粮", productLevel2CategoryId: 13, ind: 2 },
        { name: "国产主粮", productLevel2CategoryId: 14, ind: 3 }
      ],
      dataList: [], //商品数据
      leftStyle: {
        background: "#48ddf5"
      }
    };
  },
  created() {
    if (this.floor_num === 1) {
      this.getProductSearch();
    } else {
      //切换最热商品的背景色
      this.leftStyle.background = this.floor_num === 2 ? "#0a2b54" : "#689d69";
      this.dataList = this.floorObj["floor" + this.floor_num].list;
    }
  },
  methods: {
    //tab的hover
    hoverTab(index) {
      this.hoverIndex = index;
      this.getProductSearch();
    },
    //获取商品
    getProductSearch() {
      let { sort, productLevel2CategoryId } = this.tabArr[this.hoverIndex];
      let obj = sort ? { sort } : { productLevel2CategoryId };
      productSearch({
        ...obj,
        pageSize: 8
      }).then(res => {
        this.dataList = res.data.list;
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
