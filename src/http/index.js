import Instance from "./http";

/**用户 */
// 发送短信验证码接口
// export const sendSms = params => Instance.post("/api/ums/sms/sendSms", params);
export const sendSms = params => Instance.post("/api/ums/sms/sendSms", params);

//手机号登录+注册接口
export const login = params => Instance.post("/api/ums/user/login", params);

//通过token获取用户信息接口
export const getUserByToken = params =>
  Instance.get("/api/ums/user/getUserByToken", params);

//置换token接口
export const replaceToken = params =>
  Instance.get("/api/ums/user/replaceToken", params);
// .then(res => {
//   // if (res.code == 200) setUserData({ token: res.data.token });
// });

//注销接口
export const logout = params => Instance.get("/api/ums/user/logout", params);

//微信登陆
export const loginWechat = () => location.replace("/api/ums/user/weChat/login");

/** 商品分类 */
//查询所有商品分类列表接口
export const categoryList = function(params) {
  return Instance.get("/api/pms/product/category/list", params).then(res => {
    this.$store.commit("setClassifyTreeList", res.data);
    return Promise.resolve(res);
  });
};

/**商品属性 */
//根据商品二级分类ID查询商品属性列表接口
export const byCategoryIds = params =>
  Instance.postJson("/api/pms/product/attribute/byCategoryIds", params);

//查询所有商品属性列表接口
export const attributeList = params =>
  Instance.get("/api/pms/product/attribute/list", params);

//查询所有商品品牌列表接口
export const brandList = params =>
  Instance.get("/api/pms/product/brand/list", params);

/**商品评价 */
//发表评价接口
export const postComment = params =>
  Instance.post("/api/pms/comment/postComment", params);

//查询评价列表接口
export const commentList = params =>
  Instance.get("/api/pms/comment/commentList", params);

/**商品 */
// 商品搜索接口 && 首页商品列表接口 && 商品详情页热门商品排行接口
export const productSearch = params =>
  Instance.postJson("/api/pms/product/search", params);

//查看商品详情接口
export const productDetail = params =>
  Instance.get("/api/pms/product/detail", params);

/**购物车 */
//添加购物车接口
export const cartAdd = params => Instance.post("/api/oms/cart/add", params);

//移除购物车商品接口 --methods - delete
export const cartRemove = params =>
  Instance.post("/api/oms/cart/remove", params);

//查询用户的购物车信息接口
export const cartList = params =>
  Instance.get("/api/oms/cart/cartList", params);

//查询购物车中商品种类数量
export const cartCount = function(params) {
  return Instance.get("/api/oms/cart/cartCount", params).then(res => {
    let obj = {};
    if (this.$store.state.token) {
      obj = {
        ...this.$store.state.userInfo,
        ...res.data
      };
    }
    this.$store.dispatch("userInfo", obj);

    return Promise.resolve(res);
  });
};

/**收货地址 */
//添加、修改收货地址接口
export const saveOrUpdate = params =>
  Instance.post("/api/ums/receiverAddress/saveOrUpdate", params);

//删除收货地址接口--methods - delete
export const receiverAddressRemove = params =>
  Instance.post("/api/ums/receiverAddress/remove", params);

//查看收货地址接口
export const receiverAddressList = params =>
  Instance.get("/api/ums/receiverAddress/list", params);

// 省市区列表接口
export const pcdList = function(params) {
  return Instance.get("/api/ums/receiverAddress/pcdList", params).then(res => {
    this.$store.dispatch("setPCDList", res.data);
    return Promise.resolve(res);
  });
};

/**订单 */
//创建订单
export const orderAdd = params =>
  Instance.postJson("/api/oms/order/add", params);

//订单预提交信息接口
export const preSubmit = params =>
  Instance.postJson("/api/oms/order/preSubmit", params);

//查询订单详情接口
export const orderDetail = params =>
  Instance.get(`/api/oms/order/detail/${params.orderNo}`, params);

/**支付 */
//生成微信支付二维码
export const wechatCodeUrl = params =>
  Instance.get(`/api/oms/pay/wechat/codeUrl/${params.orderNo}`);

//微信支付状态轮询接口
export const queryOrderStatus = params =>
  Instance.get(`/api/oms/pay/queryOrderStatus/${params.orderNo}`);

//支付宝支付（同步请求）
export const aliPay = params =>
  location.replace(`/api/oms/pay/aliPay/pay?orderNo=${params.orderNo}`);
// Instance.post(`/api/oms/pay/aliPay/${params.orderNo}`);

/**文件上传 */
export const uploadFile = params =>
  Instance.postImg("/api/files/uploadFile", params);
