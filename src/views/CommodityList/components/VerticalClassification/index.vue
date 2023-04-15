<template>
  <div class="wrapBox">
    <template v-for="(x, index) in classifyTreeList">
      <div
        :key="x.id"
        v-if="
          !searchoption.productLevel1CategoryId ||
            searchoption.productLevel1CategoryId === x.id
        "
      >
        <div class="title" @click="foldHanler(index)">
          <span>{{ x.name }}</span>
          <div :class="foldIndex[index] === '' && 'close'">
            <Pic prop_src="down_arrow.png"></Pic>
          </div>
        </div>
        <div
          v-show="foldIndex[index] !== ''"
          v-for="item in x.secProductCategoryList"
          :key="item.secId"
          :class="
            searchoption.productLevel2CategoryId === item.secId && 'selectIndex'
          "
          @click="selectSec(item.secId)"
        >
          <Pic :prop_src="item.secIcon"></Pic>
          <span>{{ item.secName }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  computed: {
    //保存原始商品类别信息
    classifyTreeList() {
      return this.$store.state.classifyTreeList;
    },
    //选中的二级id
    selectSecId() {
      return this.$store.state.selectSecId;
    },
    //搜索选项
    searchoption() {
      return this.$store.state.searchoption;
    },
    //原分类选项中传递的数据
    classificationData() {
      return this.$store.state.classificationData;
    }
  },
  watch: {
    classificationData: function(val) {
      if (val && val.commodityList) {
        this.commodityList = val.commodityList;
      } else {
        this.commodityList = this.classifyTreeList;
      }
    }
  },
  props: ["searchFn"],
  data() {
    return {
      foldIndex: [],
      commodityList: this.$store.state.classifyTreeList,
      clickId: null
    };
  },
  methods: {
    //选择二级分类
    selectSec(secId) {
      this.$store.dispatch("selectSecId", secId);
      this.$store.dispatch("searchoption", {
        ...this.$store.state.searchoption,
        productLevel2CategoryId: secId,
        productAttributeIds: []
      });
      this.searchFn({ productLevel2CategoryId: secId });
    },
    //折叠
    foldHanler(index) {
      this.foldIndex[index] !== ""
        ? (this.foldIndex[index] = "")
        : (this.foldIndex[index] = index);
      this.foldIndex = [].concat(this.foldIndex);
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
