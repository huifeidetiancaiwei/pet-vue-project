<template>
  <div class="home">
    <NavBar></NavBar>
    <Search></Search>
    <ContentBox>
      <div class="wrapbox">
        <p @click="toCart">&lt;返回购物车</p>
        <!-- 收货人信息 -->
        <div>
          <div class="row_title">
            <div>收货人信息</div>
            <div class="pointer" @click="showAddressHandler('')">
              <Pic prop_src="account_plus.png"></Pic>新增收货地址
            </div>
          </div>

          <template v-for="(item, index) in addressData">
            <div
              class="address_item"
              :key="item.id"
              v-show="!index || showMore"
            >
              <div
                class="pointer select"
                :class="
                  (selectAddress
                    ? item.id === selectAddress
                    : item.defaultStatus !== selectAddress) && 'select_checked'
                "
                @click="clickAddress(item.id)"
              >
                {{ item.userName }}
              </div>
              <p>
                <span>
                  {{
                    item.province + item.city + item.county + item.detailAddress
                  }}
                </span>
                <span>{{ item.phoneNumber }}</span>
                <span class="default_option" v-if="item.defaultStatus"
                  >默认地址</span
                >
              </p>
              <div class="address_btn">
                <div class="pointer" @click="showAddressHandler(item.id, item)">
                  编辑
                </div>
                <div class="pointer" @click="removeAddress(item.id)">删除</div>
              </div>
            </div>
          </template>

          <div
            class="pointer open_icon"
            :class="showMore && 'close_icon'"
            @click="showMoreHandel"
          >
            {{ showMore ? "收起" : "展开" }}地址
          </div>
        </div>
        <!-- 付款方式 -->
        <div>
          <div class="row_title">
            <div>付款方式</div>
          </div>
          <div class="pointer select_checked">
            在线支付
            <Pic prop_src="account_help.png"></Pic>
          </div>
        </div>
        <!-- 商品清单 -->
        <div class="product_list">
          <div class="row_title">
            <div>商品清单</div>
          </div>
          <div class="item_th">
            <span>商品信息</span>
            <span>单价</span>
            <span>数量</span>
          </div>
          <div>
            <template v-for="item in preSubmitData.productList">
              <div class="product_item" :key="item.id">
                <div>
                  <Pic :prop_src="item.picUrl"></Pic>
                  <p>{{ item.title }}</p>
                </div>
                <span
                  >¥&nbsp;{{
                    item.unitPrice && item.unitPrice.toFixed(2)
                  }}</span
                >
                <span>{{ item.num }}</span>
              </div>
            </template>
          </div>
        </div>
        <!-- 结算信息 -->
        <div class="submit_box">
          <div class="row_title">
            <div>结算信息</div>
          </div>
          <div>
            <p>
              商品总额：
              <span>
                ¥&nbsp;{{
                  preSubmitData.totalMoney &&
                    preSubmitData.totalMoney.toFixed(2)
                }}
              </span>
            </p>
            <p class="open_icon">
              运费：
              <span class="line_through">
                ¥&nbsp;{{
                  preSubmitData.freight && preSubmitData.freight.toFixed(2)
                }}
              </span>
            </p>
            <div>
              <span>应付总额：</span>
              <span>
                ¥&nbsp;{{
                  preSubmitData.payMoney && preSubmitData.payMoney.toFixed(2)
                }}
              </span>
              <div class="pointer" @click="debouncedCreatOrder" :disabled="isSubmitting">
                {{ isSubmitting ? '提交中...' : '提交订单' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentBox>
    <Footer></Footer>
    <Popup v-if="showPop">
      <Address
        v-if="showAddress"
        :prop_id="addressId"
        :prop_data="prop_data"
        :callBackFn="getEeceiverAddressList"
        >{{ addressId }}</Address
      >
    </Popup>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import Search from "@/components/Search";
import Footer from "@/components/Footer";

//本地组件
import Address from "./components/Address";

// eslint-disable-next-line no-unused-vars
import _ from  'lodash'

import {
  pcdList,
  receiverAddressList,
  preSubmit,
  receiverAddressRemove,
  orderAdd
} from "@/http";


export default {
  components: {
    NavBar,
    Footer,
    Search,
    Address
  },
  computed: {
    showPop() {
      //展示弹出框
      return this.$store.state.showPop;
    },
    pcdListData() {
      return this.$store.state.pcdList;
    }
  },
  data() {
    return {
      showMore: false, //地址展开收起
      showAddress: false, //地址弹窗
      addressData: [], //地址
      preSubmitData: {
        productList:[]
      }, //商品,
      addressId: "", //编辑地址所用地址id
      selectAddress: 0, //选中的地址
      prop_data: [],
      isSubmitting: false // 提交状态
    };
  },
  created() {
    this.getCartList();
    this.getEeceiverAddressList();
  },
  methods: {
    //点击切换地址
    clickAddress(id) {
      this.selectAddress = id;
    },
    //删除当前地址
    removeAddress(id) {
      receiverAddressRemove({ addressId: id }).then(res => {
        if (res.code === '200') {
          this.getEeceiverAddressList();
        }
      });
    },
    //返回购物车
    toCart() {
      this.$router.push("/shoppingcart");
    },
    //获取收货地址
    getEeceiverAddressList() {
      receiverAddressList({ userId: this.$store.state.userInfo.id }).then(
        res => {
          this.addressData = res.data;
        }
      );
    },
    //获取购物商品
    getCartList() {
      preSubmit({ skuInfos: this.$route.params.skuInfos }).then(res => {
        if (!res.data) return;
        this.preSubmitData = { ...res.data, code: res.code };
        if (!this.pcdListData||!this.pcdListData.length) {
          pcdList.call(this).then(res => {
            this.$store.dispatch("pcdList", res.data);
          });
        }
      });
    },
    //新增修改地址弹窗
    showAddressHandler(id = "", item) {
      this.addressId = id;
      this.prop_data = item;
      this.showAddress = true;
      this.$store.dispatch("showPop", true);
    },
    //地址展开显示
    showMoreHandel() {
      this.showMore = !this.showMore;
    },
    //结算按钮
    creatOrder() {
      // 当点击结算按钮时，判断地址列表是否为空，如果为空则弹出对话框
      if (this.addressData.length < 1) {
        this.$toast("收货人地址不能为空")
      }
      // 禁用提交按钮
      this.isSubmitting = true;

      // skuInfos	数组	商品sku信息数组	是
      // receiverName	字符串	收件人名称	是
      // receiverPhone	字符串	收件人电话	是
      // receiverAddress	字符串	收件人地址	是
      let selectItem = this.addressData.filter(item => {
        return !this.selectAddress
          ? item.defaultStatus === 1
          : item.id === this.selectAddress;
      })[0];

      let obj = {
        skuInfos: this.$route.params.skuInfos,
        receiverName: selectItem.userName,
        receiverPhone: selectItem.phoneNumber,
        receiverAddress:
          selectItem.province +
          selectItem.city +
          selectItem.county +
          selectItem.detailAddress
      };
      orderAdd(obj).then(res => {
        if (res.code === '200') {
          this.$router.push("/payment/" + res.data.orderNo);
        }
      }).finally(() => {
        // 无论请求成功或失败都启动按钮
        this.isSubmitting = false;
      });
    }
  },
  mounted() {
    this.debouncedCreatOrder = _.debounce(this.creatOrder, 500)
  }
};
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
