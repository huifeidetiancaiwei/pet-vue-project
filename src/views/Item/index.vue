<template>
  <div>
    <NavBar></NavBar>
    <Search></Search>
    <div @mouseleave="leaveCb">
      <Navigation :hoverCb="hoverCb"></Navigation>
      <Classification
        v-show="showClassification"
        :treeList="newTreeList"
      ></Classification>
    </div>
    <Crumbs v-if="categories.length" :prop_data="categories"></Crumbs>
    <ContentBox>
      <div class="content">
        <!-- 顶部商品价格 -->
        <div class="top">
          <div class="top_left">
            <Swiper :prop_item="skuList[spec_select]"></Swiper>
          </div>
          <div class="top_right">
            <div>
              <p>
                {{
                  skuList[spec_select]
                    ? skuList[spec_select].title || spu.name
                    : ""
                }}
              </p>
              <p>{{ spu.subTitle }}</p>
              <p>
                价格：
                <span>
                  <span>￥</span>
                  {{
                    skuList[spec_select]
                      ? skuList[spec_select].price.toFixed(2) ||
                        spu.defaultPrice
                      : ""
                  }}
                </span>
              </p>
              <p>
                正在促销：
                <span>折扣</span>
                <span>周三“狠减单”!</span>
                <span class="pointer">点击参与>></span>
              </p>
            </div>
            <div>
              <p>
                <span>
                  已售：
                  <span>{{ spu.sale }}</span>
                  {{
                    skuList[spec_select]
                      ? skuList[spec_select].unit || "袋"
                      : ""
                  }}
                </span>
                <span>
                  评价：
                  <span>{{ spu.commentAmount }}</span>
                </span>
              </p>
              <div>
                <div><Pic prop_src="qualityassurance.png"></Pic>正品保证</div>
                <div><Pic prop_src="freeshipping.png"></Pic>99远包邮</div>
                <div><Pic prop_src="thirtydays.png"></Pic>30天退货</div>
              </div>
            </div>
            <div class>
              <div>
                <span>规格：</span>
                <div
                  v-for="(item, index) in specFilter(spu.productSpecification)"
                  :key="'spec' + index"
                  @click="specsClick(skuList[spec_select].stock, index)"
                  :class="[
                    index === spec_select ? 'spec_selected' : '',
                    skuList && skuList[index] && !skuList[index].stock
                      ? 'bgGrey pointer disabled'
                      : 'pointer'
                  ]"
                >
                  {{ item }}
                </div>
              </div>
              <div>
                <span>我要买：</span>
                <div class="input_box">
                  <span class="pointer" @click="() => buyNum > 1 && buyNum--"
                    >-</span
                  >
                  <input
                    type="text"
                    :value="buyNum"
                    :min="1"
                    @input="buyNumHandle"
                  />
                  <span
                    class="pointer"
                    @click="
                      () => buyNum < skuList[spec_select].stock && buyNum++
                    "
                    >+</span
                  >
                </div>
                <span>&nbsp;&nbsp;袋</span>
              </div>
              <div class="pointer btn" @click="cartAddHandle">加入购物车</div>
            </div>
          </div>
        </div>
        <!-- 下方商品详情 -->
        <div class="bottom">
          <div class="bottom_left">
            <div>
              <div class="hot">热门排行</div>
              <div>
                <div
                  v-for="(item, index) in hotList"
                  :key="'hotList' + index"
                  class="pointer hot_item"
                  @click="
                    () => {
                      replaceItemHandler(item.id);
                    }
                  "
                >
                  <Pic :prop_src="item.defaultPicUrl"></Pic>
                  <div>
                    <p>{{ item.name }}</p>
                    <p>￥{{ item.defaultPrice.toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bottom_right">
            <div class="tab">
              <span
                class="pointer"
                @click="() => (showDetail = true)"
                :class="showDetail ? 'tab_selected' : ''"
                >商品详情</span
              >
              <span
                class="pointer"
                :class="!showDetail ? 'tab_selected' : ''"
                @click="() => (showDetail = false)"
                >评价({{ spu.commentAmount }})</span
              >
            </div>
            <!-- 商品详情与评价盒子 -->
            <div class="detail_box">
              <div v-show="showDetail" class="detail_item">
                <div v-for="item in spu.productDetailPicList" :key="item.picId">
                  <Pic :prop_src="item.picUrl"></Pic>
                </div>
              </div>
              <div v-show="!showDetail">
                <!-- 发表评论与评星盒子 -->
                <div class="commit_box">
                  <div v-show="!postCommitShow">
                    <div>
                      <p>{{ spu.commentTotalScore }}分</p>
                      <Star
                        v-if="spu.commentTotalScore"
                        :prop_num="spu.commentTotalScore"
                      ></Star>
                    </div>
                    <div class="pointer commit_btn" @click="showCommit">
                      发表评论
                    </div>
                  </div>
                  <div v-show="postCommitShow">
                    <p class="commit_title">其他买家，需要您的建议哦~</p>
                    <div class="commit_table_box">
                      <div class="commit_table">
                        <!-- 评价行 -->
                        <div>
                          <div class="row_left">
                            <p>评价</p>
                            <p>商品</p>
                          </div>
                          <div class="row_right">
                            <textarea
                              class="contenteditable"
                              placeholder="可以在这里分享您的使用感受哟~~"
                              v-model="textareaVal"
                              maxlength="400"
                            ></textarea>
                          </div>
                        </div>
                        <!-- 上传图片行 -->
                        <div>
                          <div class="row_left">晒图片</div>
                          <div class="row_right">
                            <template v-for="(item, index) in fileList">
                              <PicUpload
                                :key="index"
                                :index="index"
                                :filename="item"
                                :setRes="setRes"
                                :delSelf="delSelf"
                                :uploadState="upLoadingHandler"
                              ></PicUpload>
                            </template>

                            <span>{{ fileList.length - 1 }}/5</span>
                          </div>
                        </div>
                      </div>
                      <!-- 评分 -->
                      <div class="starBox">
                        <span>
                          <span>商品</span>
                          <span>评分</span>
                        </span>
                        <Star :prop_setVal="setStarVal"></Star>
                      </div>
                    </div>
                    <!-- 提交评论 -->
                    <div class="commit_submit">
                      <span>{{ commitTips }}</span>
                      <div class="pointer commit_btn" @click="commitSubmit">
                        提交评论
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 用户评价盒子 -->
                <div class="evaluation_box">
                  <div class="filter_box">
                    <span
                      :class="!isPic ? 'selected' : ''"
                      class="pointer"
                      @click="commentFilter(null)"
                      >全部评价</span
                    >
                    <span
                      :class="isPic ? 'selected' : ''"
                      class="pointer"
                      @click="commentFilter(1)"
                      >有图评价</span
                    >
                  </div>
                  <template v-for="item in commentDataList">
                    <div :key="'comment' + item.commentId">
                      <Evaluation :prop_data="item"></Evaluation>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <Pagination
              v-show="!showDetail"
              :pageOption="pageOption"
              :getSearch="getCommentList"
            ></Pagination>
          </div>
        </div>
      </div>
    </ContentBox>
    <Footer></Footer>
    <Popup v-if="showPop">
      <PopAdd v-if="showPopAdd" :accountFn="toCart"></PopAdd>
    </Popup>
  </div>
</template>
<script>
// 全局组件
import NavBar from "@/components/NavBar";
import Search from "@/components/Search";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Classification from "@/components/Classification";
import Crumbs from "@/components/Crumbs";
import Pagination from "@/components/Pagination";

//本地组件
import Swiper from "./components/Swiper";
import Evaluation from "./components/Evaluation";
import Star from "./components/Star";
import PopAdd from "./components/PopAdd";
import PicUpload from "./components/PicUpload";

import {
  productDetail,
  cartAdd,
  productSearch,
  commentList,
  postComment
} from "@/http";
export default {
  name: "home",
  computed: {
    showPop() {
      //展示弹出框
      return this.$store.state.showPop;
    }
  },
  components: {
    NavBar,
    Search,
    Footer,
    Navigation,
    Crumbs,
    Pagination,
    Swiper,
    Evaluation,
    Star,
    PopAdd,
    PicUpload,
    Classification
  },
  data() {
    return {
      categories: [], //面包屑数据?
      skuList: [], //选择规格后的信息
      spu: {}, //商品信息
      spec_select: 0,
      hotList: [], //热门商品
      commentDataList: [], //评论
      isPic: null, //查看有图无图评论
      showDetail: true, //显示商品详情还是评论
      buyNum: 1, //购买数量
      postCommitShow: false, //发表评论展示
      divVal: "", //富文本内容
      starValue: 5, //评分
      showPopAdd: false, //加入购物车的弹窗
      //图片list
      fileList: [""],
      fileListIds: [""],
      textareaVal: "", //富文本值
      replaceItem: this.$route.params.id, //替换本页显示的商品
      commitTips: "", //提交评论提示
      showClassification: false, //分类展示控制
      newTreeList: this.$store.state.processingTreeList, //处理后的类别数据
      pageOption: {
        //分页
        // beginPos: 0,
        pageNo: 1,
        pages: 1,
        total: 1
      },
      upLoading: [] //上传状态-1:上传中0:非上传中
    };
  },
  created() {
    this.createdAjax();
  },
  methods: {
    //选择规格点击
    specsClick(stock, index) {
      this.skuList[index].stock ? (this.spec_select = index) : "";
    },
    //分类展示
    hoverCb() {
      this.showClassification = true;
    },
    //分类隐藏
    leaveCb() {
      this.showClassification = false;
    },
    //进入页面请求
    createdAjax() {
      productDetail({ spuId: this.replaceItem }).then(res => {
        this.categories = res.data.categories;
        this.skuList = res.data.skuList;
        this.spu = res.data.spu;
      });
      //热门商品
      productSearch({ srot: 2 }).then(res => {
        this.hotList = res.data.list;
      });
      this.getCommentList();
    },
    //左侧热门商品点击
    replaceItemHandler(id) {
      //另一种vue-router可传参方法
      let routeUrl = this.$router.resolve({
        path: "/item/" + id
      });
      window.open(routeUrl.href, "_blank");
      this.replaceItem = id;
      this.createdAjax();
    },
    //图片删除自身
    delSelf(index, res) {
      if (index === 4) {
        //如果是最后一项=>替换图片
        this.fileList[index] = res;
        this.fileListIds[index] = res;
      } else {
        //删除图片
        this.fileList.splice(index, 1);
        this.fileListIds.splice(index, 1);
      }
      //重新赋值,更新
      this.fileList = [].concat(this.fileList);
      this.fileListIds = [].concat(this.fileListIds);
    },
    // 图片获取方法
    setRes(index, res) {
      //赋值
      this.fileList[index] = res.filePath;
      this.fileListIds[index] = res.id;
      //小于5添加新的上传盒子
      this.fileList.length < 5 && this.fileList.push("");
      this.fileListIds.length < 5 && this.fileListIds.push("");

      //重新赋值,更新
      this.fileList = [].concat(this.fileList);
      this.fileListIds = [].concat(this.fileListIds);
    },
    //星星评分
    setStarVal(val) {
      this.starValue = val;
    },
    //展示发表评论按钮
    showCommit() {
      if (!this.$store.state.token) {
        //标识不是添加购物车
        this.showPopAdd = false;
        //弹窗需登录的提示
        this.$store.dispatch("navBarShowPop", false);
        //显示弹窗
        this.$store.dispatch("showPop", true);
      } else {
        //显示品论文本框
        this.postCommitShow = true;
      }
    },
    //发表评论清空
    resetCommit() {
      //清空文字,重置星星,图片数据清空
      this.textareaVal = "";
      this.starValue = 5;
      this.fileListIds = [""];
      this.fileList = [""];
    },
    //提交评论提示
    tips(msg) {
      this.commitTips = msg;
      setTimeout(() => (this.commitTips = ""), 3000);
    },
    //提交评论
    commitSubmit() {
      if (!this.textareaVal) {
        this.tips("请输入您的评论");
        return;
      }
      //查看是否图片还在上传状态
      if (this.upLoading.filter(num => num > 0).length) {
        this.tips("图片你还在上传中,请稍后");
        return;
      }
      postComment({
        spuId: this.replaceItem,
        content: this.textareaVal,
        star: this.starValue,
        imgIds: this.fileListIds.join()
      }).then(res => {
        if (res.code == 200) {
          this.postCommitShow = false;
          this.commentFilter();
          this.resetCommit();
        } else if (res.code == 401) {
          this.$store.dispatch("showPop", true);
        } else if (res.code == 21002) {
          this.tips(res.msg);
        } else {
          this.tips(res.msg);
        }
      });
    },
    //评论筛选
    commentFilter(isPic = null) {
      this.isPic = isPic;
      //重置分页
      this.pageOption = {
        pageNo: 1,
        pages: 1,
        total: 1
      };
      this.getCommentList();
    },
    getCommentList() {
      commentList({
        spuId: this.replaceItem,
        isPic: this.isPic, //	整型	方式：0:无图评价；1: 有图评价；null: 全部评价	否，不传时，查询全部
        ...this.pageOption
      }).then(res => {
        if (res.code == 200) {
          let { total, pages, pageNo, beginPos, list } = res.data;
          this.pageOption = { total, pages, pageNo, beginPos };
          this.commentDataList = list || [];
        }
      });
    },
    //商品规格数据转换
    specFilter(value = "") {
      let arr = value
        .slice(7, value.length - 2)
        .replace(/"/g, "")
        .split(",");
      return arr;
    },
    //加入购物车按钮
    cartAddHandle() {
      cartAdd({
        skuId: this.skuList[this.spec_select].id,
        num: this.buyNum
      }).then(res => {
        if (res.code == 200) {
          this.$store.dispatch("showPop", true);
          this.showPopAdd = true;
        } else if (res.code == 401) {
          //弹窗需登录的提示
          this.$store.dispatch("navBarShowPop", false);
          //显示弹窗
          this.$store.dispatch("showPop", true);
        }
      });
    },
    //toCart
    toCart() {
      this.$router.push({
        name: "ShoppingCart",
        params: { skuId: this.skuList[this.spec_select].id }
      });
    },
    //购买数量控制
    buyNumHandle(e) {
      e.target.value = e.target.value.replace(/[^0-9]/gi, "");
      //数量不能超过库存控制
      if (e.target.value > this.skuList[this.spec_select].stock) {
        this.buyNum = e.target.value = this.skuList[this.spec_select].stock;
      } else if (e.target.value <= 1) {
        this.buyNum = e.target.value = 1;
      } else {
        this.buyNum = e.target.value;
      }
    },
    //上传状态控制
    upLoadingHandler(index, state) {
      this.upLoading[index] = state;
      this.upLoading = [].concat(this.upLoading);
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
