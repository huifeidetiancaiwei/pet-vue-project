/**
 * 计时器
 * @param {Number} totalTime  起始时间(秒)
 * @param {*} fn 赋值方法
 * @param {*} endFn 结束动作
 */
export function countDown(totalTime, fn, endFn) {
  let time = null;
  time = setInterval(() => {
    totalTime--;
    fn(totalTime);
    if (!totalTime) {
      endFn();
      clearInterval(time);
    }
  }, 1000);
}

export function getUserData() {
  return {
    token: localStorage.token || undefined
  };
}

export function setUserData({ token }) {
  localStorage.token = token;
}

export function removeUserData() {
  localStorage.removeItem("token");
}

export function validateRequire(value, callback) {
  if (value === "") {
    callback("不能为空");
  } else {
    callback("");
  }
}

export function validatePhone(value, callback) {
  let reg = /(13[0-9]|14[579]|15[0-35-9]|16[6]|17[0135678]|18[0-9]|19[89])[0-9]{8}$/g;
  if (value === "") {
    callback("不能为空");
  } else if (!reg.test(value)) {
    callback("请输入正确手机号");
  } else if (value.length !== 11) {
    callback("请输入正确手机号");
  } else {
    callback("");
  }
}
/**
 * toFixed
 * @param {?number} d 需要toFixed的位数
 * @param {boolean} rounding 是否进行四舍五入
 */
export function toFixed() {
  Number.prototype.toFixed = function(d, rounding = true) {
    let s = this + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp(`^(-|\\+)?(\\d+(\\.\\d{0,${d + 1}})?)\\d*$`).test(s)) {
      let s = "0" + RegExp.$2,
        pm = RegExp.$1,
        a = RegExp.$3.length,
        b = true;
      if (a == d + 2) {
        a = s.match(/\d/g);
        if (rounding && parseInt(a[a.length - 1]) > 4) {
          for (let i = a.length - 2; i >= 0; i--) {
            a[i] = parseInt(a[i]) + 1;
            if (a[i] == 10) {
              a[i] = 0;
              b = i != 1;
            } else break;
          }
        }
        s = a
          .join("")
          .replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
      }

      if (b) s = s.substr(1);
      return (pm + s).replace(/\.$/, "");
    }
    //其他情况返回 本体
    return this + "";
  };
}
