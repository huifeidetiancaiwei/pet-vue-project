<template>
  <div class="home">
    <NavBar></NavBar>
    <Search></Search>
    <ContentBox>
      <Empty v-if="!dataList.length"></Empty>
      <form ref="formEl" name="formEl" class="formEl" v-else>
        <template v-for="(item, index) in dataList">
          <Item
            :key="item.skuId"
            prop_class="box_setting"
            prop_name="chk"
            :prop_data="item"
            :list_index="index"
            :prop_del="del"
            :prop_changeNumber="changeNumber"
            :prop_checked="itemCheck"
          ></Item>
        </template>
        <div class="summary_box">
          <div>
            <div @click="allChecked">
              <CheckBox prop_name="allCheck"></CheckBox>
            </div>
            <p>全选</p>
            <div @click="delChecked" class="pointer">[删除选中商品]</div>
          </div>
          <div>
            <p>
              总价(不含运费):
              <span>￥&nbsp;{{ summary.toFixed(2) }}</span>
            </p>
            <div
              class="pointer"
              :class="summary > 0 ? '' : 'disabled'"
              @click="toAccount"
            >
              去结算
            </div>
          </div>
        </div>
        <div
          class="back_btn pointer"
          @click="
            () => {
              $router.push('/');
            }
          "
        >
          继续购物
        </div>
      </form>
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
import CheckBox from "@/components/CheckBox";

//本地组件
import Item from "./components/Item";
import Empty from "./components/Empty";

import { cartList, cartRemove, cartAdd } from "@/http";

export default {
  components: {
    NavBar,
    Footer,
    Search,
    Item,
    CheckBox,
    Empty
  },
  computed: {
    showPop() {
      //展示弹出框
      return this.$store.state.showPop;
    }
  },
  data() {
    return {
      checkedStatue: false, //全选状态
      dataList: [], //商品数据列表
      checkList: [], //已选中的下标
      summary: 0
    };
  },
  mounted() {
    this.getCartList(this.paramsChecked);
  },
  methods: {
    //默认选中上一页结算商品
    paramsChecked() {
      if (this.$route.params.skuId) {
        this.dataList.map((item, index) => {
          //筛选相同skuId,checked
          if (this.$route.params.skuId === item.skuId) {
            this.$nextTick(() => {
              this.checkboxHandler()[index].checked = true;
              this.itemCheck(index);
            });
          }
        });
      }
    },
    //去结算
    toAccount() {
      if (this.summaryPrice() > 0) {
        this.$router.push({
          name: "Account",
          params: { skuInfos: this.preSubmit() }
        });
      }
    },
    //汇总价格
    summaryPrice() {
      let summary = 0;
      //checkList是按照下标存入的值,数组较长;这种方式数组较短
      for (let x of this.checkboxHandler()) {
        if (x.checked) summary += this.checkList[x.value];
      }
      this.summary = summary;
      return summary;
    },
    //处理checkbox,避免出现无法遍历的情况
    checkboxHandler() {
      return this.$refs.formEl.chk.length > 1
        ? this.$refs.formEl.chk
        : [this.$refs.formEl.chk];
    },
    /**
     * @desc 全选
     * chk      单项checkbox的name
     * checked  全选checkbox的name
     */
    allChecked() {
      for (let i = 0; i < this.checkboxHandler().length; i++) {
        this.checkboxHandler()[i].checked = this.$refs.formEl.allCheck.checked;

        if (this.$refs.formEl.allCheck.checked) {
          //全选情况
          this.itemCheck(i);
        } else {
          //取消全选情况
          this.checkList.push = [];
        }
      }
      this.summaryPrice();
    },
    //单项选中
    itemCheck(list_index) {
      if (this.checkboxHandler()[list_index].checked) {
        //选中状态
        this.checkList[list_index] = this.dataList[list_index].price =
          this.dataList[list_index].num * this.dataList[list_index].unitPrice;
        //单项选择后激活全选状态 多项的情况
        if (
          this.checkList.filter(item => !!item).length ===
          this.checkboxHandler().length
        ) {
          this.$refs.formEl.allCheck.checked = true;
        }
      } else {
        //取消选中状态
        this.checkList[list_index] = 0;
        //checkList filter后数组为空,说明没有被选中的项
        if (!this.checkList.filter(item => !!item).length) {
          this.$refs.formEl.allCheck.checked = false;
        }
      }
      this.summaryPrice();
    },
    //获取购物车数据
    getCartList(fn) {
      cartList().then(res => {
        this.dataList = res.data;
        fn && fn();
      });
    },
    //找到所以已选项的sukid
    mapChecked() {
      let arr = [];
      for (let x of this.checkboxHandler()) {
        if (x.checked) {
          arr.push(this.dataList[x.value]);
        }
      }
      return arr;
    },
    //准备结算数据
    preSubmit() {
      let arr = [];
      for (let x of this.mapChecked()) {
        arr.push({ skuId: x.skuId, skuNum: x.num });
      }
      return arr;
    },
    //找到已选中的checkbox
    findChecked() {
      let arr = [];
      for (let x of this.mapChecked()) {
        arr.push(x.skuId);
      }
      return arr.join();
    },
    //删除
    del(list_index) {
      cartRemove({ skuIds: this.dataList[list_index].skuId }).then(() => {
        this.getCartList();
      });
    },
    //删除选中
    delChecked() {
      cartRemove({ skuIds: this.findChecked() }).then(() => {
        this.getCartList();
      });
    },
    //数量变更
    changeNumber(state, list_index) {
      let oldNum = this.dataList[list_index].num;
      if (!isNaN(state)) {
        this.dataList[list_index].num = state;
      } else if (state === "add") {
        this.dataList[list_index].num++;
      } else {
        if (oldNum >= 2) {
          this.dataList[list_index].num--;
        } else {
          this.$toast("购买数量不能少于1");
          return;
        }
      }
      this.checkList[list_index] = this.dataList[list_index].price =
        this.dataList[list_index].num * this.dataList[list_index].unitPrice;
      cartAdd({
        skuId: this.dataList[list_index].skuId,
        num: this.dataList[list_index].num - oldNum
      }).then(res => {
        //code 30002库存不足
        if (res.code == 30002) {
          this.$toast(res.msg);
          this.dataList[list_index].num = oldNum;
        }
      });
      this.summaryPrice();
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
