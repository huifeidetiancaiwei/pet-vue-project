<template>
  <div class="home">
    <NavBar></NavBar>
    <Search></Search>
    <ContentBox>
      <div class="wrapbox">
        <div class="pay_tips">
          <Pic prop_src="pay_1.png"></Pic>
          <div>
            <p class="marginBottom50">
              应付金额：￥
              <span class="fontSize30">{{ dataList.payMoney }}</span>
            </p>
            <p>恭喜，订单提交成功！</p>
            <p>订单号：{{ dataList.orderNo }}[查看]</p>
            <p class="selectedColor">
              订单中的商品，系统自动为您保留到{{
                dataList.expirationTime
              }}，请尽快完成付款
            </p>
            <p>
              近期网络诈骗案件频繁发生，但小宠打死都不会
              <span class="selectedColor"
              >因订单问题向您发送任何链接或获取验证码</span
              >，
            </p>
            <p>
              小主有任何疑问都可以致电
              <span class="selectedColor">4000888888</span>
              ，我们的客服小姐姐随时准备为小主服务的哦
            </p>
          </div>
        </div>
        <div>
          <div class="row_title">
            <div>付款方式</div>
          </div>
          <div class="row_btn_box" v-if="!qrCode">
            <div @click="aliPayHandler">
              <Pic prop_src="zhifubao_icon.jpg"></Pic>
              支付宝支付
            </div>
            <div @click="qrCodeUrl">
              <Pic prop_src="weixin_icon.jpg"></Pic>
              微信支付
            </div>
          </div>
          <div class="row_qrCode_box" v-if="aliPayPage">
            <div>
              <p>请打开支付宝</p>
              <p>扫描右侧二维码</p>
            </div>
            <div>
              <!--              嵌套支付宝支付页面-->
              <iframe :srcdoc="aliPayPage" 
                      width="600"
                      height="300"
                      style="overflow: hidden">
                
              </iframe>
            </div>
          </div>
          <div class="row_qrCode_box" v-if="qrCode">
            <div>
              <p>请打开微信</p>
              <p>扫描右侧二维码</p>
            </div>
            <div>
              <vue-qr :text="qrCode" :size="300"></vue-qr>
            </div>
            <Pic prop_src="weixin_pay.png"></Pic>
          </div>
        </div>
      </div>
    </ContentBox>
    <Footer></Footer>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import Search from "@/components/Search";
import Footer from "@/components/Footer";

import {orderDetail, queryOrderStatus, wechatCodeUrl, aliPay} from "@/http";
import VueQr from "vue-qr";

export default {
  components: {
    NavBar,
    Footer,
    Search,
    VueQr
  },
  data() {
    return {
      dataList: {},
      qrCode: "",
      // 支付宝返回的支付页面
      aliPayPage: ""
    };
  },
  created() {
    orderDetail({orderNo: this.$route.params.orderNo}).then(res => {
      this.dataList = res.data;
    });
  },
  methods: {
    //阿里支付请求
    aliPayHandler() {
      aliPay({orderNo: this.$route.params.orderNo})
          .then(res => {
            if (res.code === '200') {
              this.aliPayPage = res.data;
              console.log(this.aliPayPage)
              // 轮循订单状态
              // this.polling();
            }
          })
    },
    //获取微信支付二维码
    qrCodeUrl() {
      wechatCodeUrl({orderNo: this.$route.params.orderNo}).then(res => {
        if (res.code === '200') {
          this.qrCode = res.data.codeUrl;
          this.polling();
        }
      });
    },
    //轮询
    polling() {
      queryOrderStatus({orderNo: this.$route.params.orderNo}).then(res => {
        //支付状态 (支付状态：0->未支付；1->支付成功；2->支付失败)
        if (res.data.payStatus < 1) {
          setTimeout(() => this.polling(), 1000);
        } else {
          this.$router.push({
            name: "Result",
            params: {payStatus: res.data.payStatus}
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
