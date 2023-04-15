<template>
  <div>
    <div class="warpBox no_select" :class="hidden ? 'hidden' : ''">
      <div
        class="prev"
        :class="pageOption.pageNo == 1 && 'hidden'"
        @click="prevHandeler"
      >
        上一页
      </div>
      <span
        v-for="(i, index) in showPageBtn"
        :key="index"
        :class="{ current: i === pageOption.pageNo }"
        class="pointer"
        @click="pageClick(i)"
      >
        <a v-if="i" class="notPointer">{{ i }}</a>
        <a v-else>···</a>
      </span>
      <div
        class="next"
        :class="pageOption.pageNo === pageOption.pages && 'hidden'"
        @click="nextHandeler"
      >
        下一页
      </div>
      <div class="count">共 &nbsp; {{ pageOption.pages }} &nbsp; 页</div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    pageOption: {
      type: Object,
      default: () => ({
        pageNo: 1,
        pages: 1,
        total: 1
      })
    },
    pageData: {
      type: Function,
      default: () => () => {}
    },
    hidden: {
      type: Boolean,
      default: false
    },
    getSearch: {
      default: () => () => {}
    }
  },
  computed: {
    currentPageText() {
      //小于一
      if (this.pageOption.pageNo < 1) {
        return 1;
        //大于总页数
      } else if (this.pageOption.pageNo >= this.page) {
        return this.pageOption.page;
      } else {
        return this.pageOption.pageNo;
      }
    },
    //分页展示
    showPageBtn() {
      const pageNum = this.pageOption.pages; //总页数
      const index = this.pageOption.pageNo; //当前页
      //生成数组中的0是用来展示...的
      //总页数小于等于五
      if (pageNum <= 5) return [...new Array(pageNum)].map((v, i) => i + 1);
      //当前页小于等于2
      if (index <= 2) return [1, 2, 3, 0, pageNum];
      //当前页大于等于总页数
      if (index >= pageNum - 1)
        return [1, 0, pageNum - 2, pageNum - 1, pageNum];
      //当前页等3
      if (index === 3) return [1, 2, 3, 4, 0, pageNum];
      //当前页等于总页数减2
      if (index === pageNum - 2)
        return [1, 0, pageNum - 3, pageNum - 2, pageNum - 1, pageNum];
      //默认情况
      return [1, 0, index - 1, index, index + 1, 0, pageNum];
    }
  },
  methods: {
    setPageData(fn) {
      fn && fn();
      //输出当前数据
      this.pageData({
        pages: this.pageOption.pages,
        count: this.pageOption.pageNo,
        total: this.pageOption.total
      });
      this.getSearch();
    },
    prevHandeler() {
      this.setPageData(() => {
        this.pageOption.pageNo - 1 > 0 && this.pageOption.pageNo--;
      });
    },
    nextHandeler() {
      this.setPageData(() => {
        this.pageOption.pageNo < this.pageOption.pages &&
          this.pageOption.pageNo++;
      });
    },
    pageClick(pageNo) {
      this.setPageData(() => {
        this.pageOption.pageNo = pageNo;
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
