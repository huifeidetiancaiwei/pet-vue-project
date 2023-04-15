<template>
  <ContentBox prop_class="c-box">
    <div
      @mouseout="
        () => {
          this.moustOut = true;
        }
      "
      class="wrapBox"
    >
      <div class="left">
        <div
          v-for="(item, index) of treeList"
          :key="item.id[0]"
          @mouseover="leftHover(index)"
          :class="[index === hoverIndex ? 'hoverRow' : '']"
        >
          <span
            class="pointer hover"
            @click="titleClick($store.state.classifyTreeList[index * 2])"
            >{{ item.abbreviation[0] }}</span
          >
          <span
            class="pointer hover"
            @click="titleClick($store.state.classifyTreeList[index * 2 + 1])"
            >{{ item.abbreviation[1] }}</span
          >
          <span>></span>
        </div>
      </div>
      <!-- 下面得v-show是控制右侧显示隐藏的判断条件 -->
      <div
        class="right"
        v-show="!moustOut"
        @mouseover="
          () => {
            this.moustOut = false;
          }
        "
      >
        <div v-for="(x, ind) in 2" :key="x">
          <!-- 二级分类标题 -->
          <div
            class="sec_title pointer hover"
            @click="
              titleClick($store.state.classifyTreeList[hoverIndex * 2 + ind])
            "
          >
            <Pic :prop_src="x.icon"></Pic>
            {{ treeList[hoverIndex].name[ind] || "" }}
          </div>
          <!-- 二级分类 -->
          <template
            v-for="rowIndex in Math.ceil(
              treeList[hoverIndex].secProductCategoryList[ind].length / 5
            )"
          >
            <p :key="rowIndex">
              <template
                v-for="(item, index) in treeList[hoverIndex]
                  .secProductCategoryList[ind]"
              >
                <p
                  v-if="index >= (rowIndex - 1) * 5 && index < rowIndex * 5"
                  :key="item.secId || index + 'sec'"
                  class="pointer hover"
                  @click="secClick(treeList[hoverIndex], ind, item)"
                >
                  {{ item.secName || "" }}
                </p>
              </template>
            </p>
          </template>
        </div>
      </div>
    </div>
  </ContentBox>
</template>
<script>
export default {
  props: ["treeList"],
  data() {
    return {
      //悬停下标
      hoverIndex: 0,
      //鼠标离开大盒子
      moustOut: true
    };
  },
  methods: {
    /// 判断当前页面
    currentPage() {
      return this.$route.name !== "CommodityList";
    },
    //一级分类点击
    titleClick(item) {
      let obj = {
        commodityList: item
      };

      //清除所选数据与所选二级分类
      this.$store.dispatch("classificationData", obj);
      this.$store.dispatch("selectSecId", null);
      //清空二级分类,并为一级分类赋值
      this.$store.dispatch("searchoption", {
        ...this.$store.state.searchoption,
        productLevel2CategoryId: "",
        productAttributeIds: [],
        productLevel1CategoryId: item.id
      });

      if (this.currentPage()) {
        this.$router.push({ name: "CommodityList" });
      } else {
        // let routeUrl = this.$router.resolve(obj);
        window.location.href = "/commodityList";
      }
    },
    //二级分类点击
    secClick(treeList, ind, item) {
      let obj = {
        commodityList: {
          ...treeList,
          secProductCategoryList: treeList.secProductCategoryList[ind],
          id: treeList.id[ind],
          name: treeList.name[ind],
          secName: item.secName
        }
      };
      //全局广播
      this.$store.dispatch("searchoption", {
        ...this.$store.state.searchoption,
        productLevel2CategoryId: item.secId,
        productLevel1CategoryId: treeList.id[ind],
        productAttributeIds: []
      });
      this.$store.dispatch("selectSecId", item.secId);
      this.$store.dispatch("classificationData", obj);

      if (this.currentPage()) {
        this.$router.push({ name: "CommodityList" });
      } else {
        window.location.href = "/commodityList";
      }
    },
    leftHover(index) {
      this.moustOut = false;
      if (index !== this.hoverIndex) {
        this.hoverIndex = index;
      }
    },
    //遍历改造后的分类
    mapSecProductCategoryList(sPCL) {
      let arr = [];
      let mapArr = [].concat(sPCL[0], sPCL[1]);

      for (let x of mapArr) {
        arr.push(x.secId);
      }
      return arr;
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
