<template>
  <div>
    <NavBar></NavBar>
    <Search :prop_searchVal="searchVal" :searchFn="getSearch"></Search>
    <div @mouseleave="leaveCb">
      <Navigation :hoverCb="hoverCb"></Navigation>
      <Classification
        v-show="showClassification"
        :treeList="newTreeList"
      ></Classification>
    </div>

    <Crumbs></Crumbs>
    <ContentBox>
      <div class="content">
        <div>
          <!-- 热门商品 -->
          <VerticalClassification
            :searchFn="getSearch"
          ></VerticalClassification>
        </div>
        <div class="right">
          <!-- 分类表格 -->
          <!-- 分类选项 -->
          <AllClassification :prop_searchFn="getSearch"></AllClassification>
          <!-- 商品盒子 -->
          <div class="bottom_box">
            <div class="filter_box">
              <div class="filter_left">
                <div
                  :class="searchoption.sort === 1 && 'selected'"
                  @click="filterHandler(1)"
                >
                  默认
                </div>
                <div
                  :class="searchoption.sort === 2 && 'selected'"
                  @click="filterHandler(2)"
                >
                  销量
                  <Pic prop_src="down_arrow.png"></Pic>
                </div>
                <div
                  :class="searchoption.sort === 3 && 'selected'"
                  @click="filterHandler(3)"
                >
                  评论
                  <Pic prop_src="down_arrow.png"></Pic>
                </div>
              </div>
              <div class="filter_right">
                <div>
                  共找到
                  <span>{{ this.pageOption.total }}</span> 件商品
                </div>
                <div>
                  {{ this.pageOption.pageNo }}/{{ this.pageOption.pages }}
                </div>
                <div
                  class="pointer"
                  :class="pageOption.pageNo === 1 && 'font_grey'"
                  @click="prevHandeler"
                >
                  上一页
                </div>
                <div
                  class="pointer"
                  :class="pageOption.pageNo === pageOption.pages && 'font_grey'"
                  @click="nextHandeler"
                >
                  下一页
                </div>
              </div>
            </div>
            <div class="goods_box">
              <GoodsItem
                v-for="item in dataList"
                :key="item.id"
                :item="item"
              ></GoodsItem>
            </div>
          </div>
          <!-- 分页 -->
          <Pagination
            :dataList="dataList"
            :pageOption="pageOption"
            :getSearch="getSearch"
          ></Pagination>
        </div>
      </div>
    </ContentBox>
    <Footer></Footer>
    <Popup v-if="showPop"></Popup>
  </div>
</template>
<script>
// 全局组件
import NavBar from "@/components/NavBar";
import Search from "@/components/Search";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Crumbs from "@/components/Crumbs";
import Pagination from "@/components/Pagination";
import Classification from "@/components/Classification";

// 页面下组件
import VerticalClassification from "./components/VerticalClassification";
import AllClassification from "./components/AllClassification";
import GoodsItem from "./components/GoodsItem";

import { productSearch } from "@/http";

export default {
  components: {
    NavBar,
    Search,
    Footer,
    Navigation,
    Crumbs,
    VerticalClassification,
    AllClassification,
    GoodsItem,
    Pagination,
    Classification
  },
  data() {
    return {
      searchVal: "", //keyword
      dataList: [], //商品数据
      pageOption: {
        // beginPos: 0,
        pageNo: 1,
        pages: 1,
        total: 1
      },
      // filters: 1, //1->默认；2->销量；3->评论
      // searchObj: {}, //搜索选项
      newTreeList: this.$store.state.processingTreeList, //处理后的类别数据
      showClassification: false
    };
  },
  computed: {
    //搜索选项
    searchoption() {
      return this.$store.state.searchoption;
    },
    showPop() {
      //展示弹出框
      return this.$store.state.showPop;
    }
  },
  created() {
    this.getSearch();
  },
  methods: {
    //分类展示
    hoverCb() {
      this.showClassification = true;
    },
    //分类隐藏
    leaveCb() {
      this.showClassification = false;
    },
    //商品筛选处理事件
    filterHandler(sort) {
      this.$store.dispatch("searchoption", {
        ...this.$store.state.searchoption,
        sort
      });
      this.getSearch();
    },
    //搜索接口
    getSearch() {
      //这里通过searchObj为品牌和商品属性重新赋值
      productSearch({
        ...this.searchoption,
        ...this.pageOption,
        pageSize: 10
      }).then(res => {
        let { total, pages, pageNo, beginPos, list } = res.data;
        this.dataList = list;
        this.pageOption = { total, pages, pageNo, beginPos };
      });
    },
    //翻页
    prevHandeler() {
      if (this.pageOption.pageNo - 1 > 0) {
        this.pageOption.pageNo--;
        this.getSearch();
      }
    },
    nextHandeler() {
      if (this.pageOption.pageNo < this.pageOption.pages) {
        this.pageOption.pageNo++;
        this.getSearch();
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
