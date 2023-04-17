<template>
    <div class="home">
        <NavBar/>
        <Search/>
        <Navigation/>
        <Classification v-if="newTreeList" :treeList="newTreeList"/>
        <Banner/>
        <ContentBox>
            <Floor :floor_num="1"/>
        </ContentBox>
        <ContentBox>
            <Floor :floor_num="2"/>
        </ContentBox>
        <ContentBox>
            <Floor :floor_num="3"/>
        </ContentBox>
        <Footer/>
        <Popup v-if="showPop"/>
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

import {categoryList} from "@/http";

export default {
    name: 'Home',
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
