import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";
import CommodityList from "./views/CommodityList";
import Item from "./views/Item";
import ShoppingCart from "./views/ShoppingCart";
import Account from "./views/Account";
import Payment from "./views/Payment";
import Result from "./views/Result";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/commoditylist",
      name: "CommodityList",
      component: CommodityList
    },
    {
      path: "/item/:id",
      name: "Item",
      component: Item
    },
    {
      path: "/shoppingcart",
      name: "ShoppingCart",
      component: ShoppingCart
    },
    {
      path: "/account",
      name: "Account",
      component: Account
    },
    {
      path: "/payment/:orderNo",
      name: "Payment",
      component: Payment
    },
    {
      path: "/result/:payStatus",
      name: "Result",
      component: Result
    }
  ]
});
