<template>
  <div>
    <!-- 品牌表格选择 -->
    <div class="brand-box">
      <div>品牌</div>
      <div class="table" :class="showMore ? 'showMore' : 'hidden'">
        <template v-for="item in brandData">
          <div
            :key="item.id"
            :id="'brand-' + item.id"
            :class="searchoption.brandId === item.id ? 'brand_selected' : ''"
            @click="brandSelect(item.id)"
          >
            {{ item.name }}
          </div>
        </template>
      </div>
      <div
        class="pointer tableShowMore"
        :class="showMore ? '收起' : '更多'"
        @click="clickShowMore"
      >
        <span>{{ showMore ? "收起" : "更多" }}</span>
        <div>
          <Pic prop_src="down_arrow.png"></Pic>
        </div>
      </div>
    </div>
    <!-- 商品细分种类选择 -->
    <div class="row_option">
      <div
        v-for="(x, x_index) in attributeData"
        :key="x.keyId"
        v-show="x_index < (rowShowMore ? attributeData.length : 5)"
      >
        <span class="keyName">{{ x.keyName }}</span>
        <div>
          <span
            class="pointer"
            v-for="(item, index) in x.productAttributeValueDtoList"
            :Data-type="item.valueId"
            :key="item.valueId"
            :class="
              item.valueId === attributeSelect[x_index + 1 + '' + index] ||
              searchoption.productAttributeIds.includes(item.valueId)
                ? 'row_select'
                : ''
            "
            @click="attributeSelectHandler(x_index + 1, index, item.valueId)"
            >{{ item.valueName }}</span
          >
        </div>
        <span
          v-if="x_index === 0"
          class="pointer rowShowMore"
          :class="rowShowMore && 'rowShowClose'"
          @click="() => (rowShowMore = !rowShowMore)"
          >{{ rowShowMore ? "收起" : "更多" }}</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import { attributeList, brandList, byCategoryIds } from "@/http";
export default {
  props: ["prop_searchFn"],
  computed: {
    classificationData() {
      return this.$store.state.classificationData;
    },
    //搜索选项
    searchoption() {
      return this.$store.state.searchoption;
    }
  },
  watch: {
    //计算属性是惰性的,所以在这里加上监听
    searchoption: {
      handler: function(newVal) {
        this.getAttributeList([newVal.productLevel2CategoryId]);
      },
      immediate: false, //刷新加载 立马触发一次handler
      deep: true // 可以深度检测到 person 对象的属性值的变化
    }
  },
  data() {
    return {
      rowShowMore: false, //商品属性的收起展开控制
      showMore: false, //商品品牌的收起展开控制
      attributeData: [], //商品属性数据
      brandData: [], //品牌属性数据
      attributeSelect: [] //商品属性已选数组
    };
  },
  created() {
    //获取品牌数据
    brandList().then(res => {
      this.brandData = [{ id: 0, name: "全部" }].concat(res.data);
    });
    this.getAttributeList();
  },

  methods: {
    //商品属性数据处理
    attributeListParams() {
      let { commodityList } = this.classificationData || {};
      //判断commodityList
      if (commodityList) {
        let { secProductCategoryList } = commodityList;
        //如果secName已经存在(说明这个数据是经过我改造过的),直接返回productLevel2CategoryId
        if (this.searchoption.productLevel2CategoryId)
          return [this.searchoption.productLevel2CategoryId];

        let secIds = secProductCategoryList.map(item => {
          return item.secId;
        });
        return secIds;
      }
    },
    //获取商品属性数据
    getAttributeList() {
      if (
        this.searchoption.productLevel1CategoryId ||
        this.searchoption.productLevel2CategoryId
      ) {
        byCategoryIds(this.attributeListParams()).then(res => {
          this.attributeData = res.data;
        });
      } else {
        attributeList().then(res => {
          this.attributeData = res.data;
        });
      }
    },
    objectHandles() {
      let obj = {};
      this.attributeSelect.length &&
        this.$store.dispatch("searchoption", {
          ...this.$store.state.searchoption,
          productAttributeIds: this.attributeSelect.filter(id => id)
        });
      return obj;
    },
    //商品属性选中
    attributeSelectHandler(x_index, index, valueId) {
      let arr = this.attributeSelect;
      let ind = x_index + "" + index;
      arr[ind] ? (arr[ind] = "") : (arr[ind] = valueId);
      this.attributeSelect = [].concat(arr);
      this.prop_searchFn(this.objectHandles());
    },
    //品牌选中
    brandSelect(brandId) {
      this.$store.dispatch("searchoption", {
        ...this.$store.state.searchoption,
        brandId
      });
      this.prop_searchFn(this.objectHandles());
    },
    //点击更多
    clickShowMore() {
      this.showMore = !this.showMore;
      //回到顶部
      if (!this.showMore) {
        document.querySelector(".table").scrollTo(0, 0);
      }
    }
  }
};
</script>
<style lang="less" scoped>
/**公共类 */
.boxSetting {
  display: flex;
  justify-content: space-between;
  margin: 0 40px 0;
}

@import url("./brand_box.less");
@import url("./row_option.less");
</style>
