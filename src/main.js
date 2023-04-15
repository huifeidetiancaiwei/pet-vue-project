import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { getUserData } from "@/assets/utils";
import ContentBox from "@/components/ContentBox";
import Pic from "@/components/Pic";
import Popup from "@/components/Popup";
import Login from "@/components/Login";
import Toast from "@/components/Toast";
import { getUserByToken } from "@/http";

Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
  let nextObj = {};
  store.dispatch("showPop", false);
  //如果不前往商品列表页,重置searchoption
  if (to.name !== "CommodityList") {
    store.dispatch("searchoption", {
      brandId: "",
      productLevel1CategoryId: "",
      productLevel2CategoryId: "",
      keyword: "",
      productAttributeIds: [],
      sort: 1
    });
  }
  //如果token为空
  if (!getUserData().token) {
    if (
      to.name === "ShoppingCart" ||
      to.name === "Account" ||
      to.name === "Payment"
    ) {
      store.dispatch("navBarShowPop", false);
      store.dispatch("showPop", true);
      nextObj = from;
    }
    //url带token的赋值
    if (to.name === "home") {
      if (to.query.token) {
        store.dispatch("token", to.query.token);

        nextObj = to;

        delete nextObj.query.token;
      }

      getUserByToken().then(res => {
        if (res.code == 200) {
          store.dispatch("userInfo", { ...res.data });
        }
      });
    }
  }
  next(nextObj);
});

Vue.component("ContentBox", ContentBox);
Vue.component("Pic", Pic);
Vue.component("Popup", Popup);
Vue.component("Login", Login);
Vue.prototype.$toast = Toast;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
