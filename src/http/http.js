import axios from "axios";
import qs from "qs";
import store from "../store";
import { getUserData } from "../assets/utils";

let timestamp = new Date().getTime();

let instance = axios.create({
  headers: {
    common: {
      "source-type": 1,
      "time-stamp": timestamp
    }
  }
});

instance.interceptors.request.use(
  config => {
    // 获取token，配置请求头
    const TOKEN = getUserData().token;
    if (TOKEN) {
      // 配置请求头 token
      config.headers["token"] = TOKEN;
      config.headers["Access-Control-Allow-Origin"] = "*";
      config.headers["Access-Control-Allow-Headers"] = "X-Custom-Header";
    }
    return config;
  },
  error => {
    // 对请求错误做些什么，处理这个错误
    // 可以直接处理或者展示出去,toast show()
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    const { status } = response.data;
    // 判断状态码401或者其它条件
    if (Object.is(status, 401)) {
      // token过期后处理
    }
    let res = response.data ? response.data : response;
    //返回401情况/也就是token失效情况
    if (res.code == 401) {
      store.dispatch("token", "");
      store.dispatch("userInfo", {});
    }
    return res;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

class http {
  static get(url, params) {
    return new instance.get(url, { params });
  }
  static post(url, params) {
    // console.log(params)
    return new instance.post(url, qs.stringify(params), {
      headers: { "content-type": "application/x-www-form-urlencoded" }
    });
  }
  static postJson(url, params) {
    // console.log(params)
    return new instance.post(url, JSON.stringify(params), {
      headers: { "content-type": "application/json" }
    });
  }
  static postImg(url, params) {
    const data = new FormData();
    data.append("file", params);
    data.append("type", 2);
    return new instance.post(url, data, {
      headers: { "content-type": "multipart/form-data" }
    });
  }
}

export default http;
