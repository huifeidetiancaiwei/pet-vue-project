<template>
  <div class="home">
    <NavBar></NavBar>
    <Search></Search>
    <Navigation></Navigation>
    <Classification v-if="newTreeList" :treeList="newTreeList"></Classification>
    <Banner></Banner>
    <ContentBox>
      <Floor :floor_num="1"></Floor>
    </ContentBox>
    <ContentBox>
      <Floor :floor_num="2"></Floor>
    </ContentBox>
    <ContentBox>
      <Floor :floor_num="3"></Floor>
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
import Classification from "@/components/Classification";

// 页面下组件
import Floor from "./components/Floor";
import Banner from "./components/Banner";

import { categoryList } from "@/http";

export default {
  computed: {
    showPop() {
      //展示弹出框
      return this.$store.state.showPop;
    }
  },
  components: {
    NavBar,
    Footer,
    Search,
    Floor,
    Banner,
    Navigation,
    Classification
  },
  data() {
    return {
      treeList: null,
      newTreeList: null
    };
  },
  created() {
    categoryList.call(this, "").then(res => {
      if (!res.data) return;
      this.treeList = res.data;
      this.newTreeList = this.$store.state.processingTreeList;
    });
  }
};
</script>
