<template>
  <form class="pop_content" ref="formEl" name="formEl">
    <div class="pop_top">
      <p>{{ prop_id ? "修改" : "添加" }}收货地址</p>
      <div @click="closePop">
        <Pic prop_src="close.png"></Pic>
      </div>
    </div>
    <div class="pop_line"></div>
    <div class="pop_content">
      <div>
        <span class="pop_label">收货人姓名：</span>
        <div class="inpput_box name">
          <input
            type="text"
            v-model="name"
            maxlength="15"
            @blur="checkVcode(name, 0)"
          />
        </div>
        <p>{{ errList[0] }}</p>
      </div>
      <div>
        <span class="pop_label">所在地区：</span>
        <div>
          <div class="inpput_box addres">
            <select v-model="option1">
              <option value="0" disabled>请选择</option>
              <template v-if="pcdListData">
                <option
                  v-for="option in pcdListData"
                  :value="option"
                  :key="option.id"
                  >{{ option.name }}</option
                >
              </template>
            </select>
          </div>
          <div class="inpput_box addres">
            <select v-model="option2">
              <option value="0" disabled>请选择</option>
              <template v-if="option1">
                <option
                  v-for="option in option1.pcdList"
                  :value="option"
                  :key="option.id"
                  >{{ option.name }}</option
                >
              </template>
            </select>
          </div>
          <div class="inpput_box addres">
            <select v-model="option3" @blur="checkVcode(option3, 1)">
              <option value disabled>请选择</option>
              <template v-if="option2">
                <option
                  v-for="option in option2.pcdList"
                  :value="option"
                  :key="option.id"
                  >{{ option.name }}</option
                >
              </template>
            </select>
          </div>
        </div>

        <p>{{ errList[1] }}</p>
      </div>
      <div>
        <span class="pop_label">详细地址：</span>
        <div class="inpput_box fullAddres">
          <input
            type="text"
            maxlength="50"
            v-model="detailAddress"
            @blur="checkVcode(detailAddress, 2)"
          />
        </div>
        <p>{{ errList[2] }}</p>
      </div>
      <div>
        <span class="pop_label">手机号码：</span>
        <div class="inpput_box phone">
          <input
            type="text"
            maxlength="11"
            v-model="phoneNumber"
            @blur="checkPhone"
          />
        </div>
        <p>{{ errList[3] }}</p>
      </div>
    </div>
    <div class="pop_bottom">
      <div>
        <CheckBox
          prop_name="pop_chb"
          list_index="0"
          prop_calss="checkboxBlue"
        ></CheckBox>
        <span>设为默认收获地址</span>
      </div>
      <div class="pop_save pointer" @click="saveAddres">保 存 收 货 地 址</div>
      <p class="errTips">{{ submitTips }}</p>
    </div>
  </form>
</template>
<script>
import CheckBox from "@/components/CheckBox";
import { validateRequire, validatePhone } from "@/assets/utils";
import { saveOrUpdate } from "@/http";
export default {
  components: { CheckBox },
  computed: {
    showPop() {
      //展示弹出框
      return this.$store.state.showPop;
    },
    pcdListData() {
      return this.$store.state.pcdList;
    }
  },
  props: {
    prop_id: {
      default: ""
    },
    prop_data: {},
    callBackFn: {
      type: Function
    }
  },
  data() {
    return {
      errList: [],
      option1: "0",
      option2: "0",
      option3: "",
      // id: this.prop_id || "", // id	整型	收货地址id（有则修改，无则新增）	否
      name: "", // name	字符串	收货人姓名	是
      phoneNumber: "", // phoneNumber	字符串	收货电话	是
      defaultStatus: "", // defaultStatus	整型	是否为默认收货地址：0->不是；1->是	是
      countyId: "", // countyId	整型	县id	是
      detailAddress: "", // detailAddress 字符串	详细地址(街道)	是
      submitTips: "", //提交错误提示
      checkList: {
        name: 0,
        option3: 1,
        detailAddress: 2,
        phoneNumber: 3
      }
    };
  },
  mounted() {
    if (this.prop_id) {
      this.option1 = this.editAddres(this.prop_data.provinceId);
      this.option2 = this.editAddres(
        this.prop_data.cityId,
        this.option1.pcdList
      );
      this.option3 = this.editAddres(
        this.prop_data.countyId,
        this.option2.pcdList
      );
      this.name = this.prop_data.userName;
      this.phoneNumber = this.prop_data.phoneNumber;
      this.detailAddress = this.prop_data.detailAddress;
      this.$refs.formEl.pop_chb.checked = !!this.prop_data.defaultStatus;
    }
  },
  methods: {
    //回显省市区
    editAddres(id, addres = this.pcdListData) {
      return addres.filter(item => {
        return item.id === id && item;
      })[0];
    },
    //提交提示
    tips(msg) {
      this.submitTips = msg;
      setTimeout(() => (this.submitTips = ""), 3000);
    },
    //保存收获地址
    saveAddres() {
      //校验
      for (let x in this.checkList) {
        this.checkVcode(this[x], this.checkList[x]);
      }
      //校验提示列表是否为空
      if (!this.errList.filter(item => !item).length) return;

      let obj = {
        userName: this.name,
        phoneNumber: this.phoneNumber,
        defaultStatus: this.$refs.formEl.pop_chb.checked ? 1 : 0,
        countyId: this.option3.id,
        detailAddress: this.detailAddress
      };
      this.prop_id && (obj.id = this.prop_id);
      saveOrUpdate(obj).then(res => {
        if (res.code == 200) {
          this.closePop();
          this.callBackFn();
        } else {
          this.tips(res.msg);
        }
      });
    },
    //关闭弹窗
    closePop() {
      this.$store.dispatch("showPop", false);
    },
    //手机号校验
    checkPhone() {
      validateRequire.call(this, this.phoneNumber, errMsg => {
        this.errList[3] = errMsg;
        this.errList = [].concat(this.errList);
      });
      validatePhone.call(this, this.phoneNumber, errMsg => {
        this.errList[3] = errMsg;
        this.errList = [].concat(this.errList);
      });
    },
    //非空校验
    checkVcode(key, index) {
      validateRequire.call(this, key, errMsg => {
        this.errList[index] = errMsg;
        this.errList = [].concat(this.errList);
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
