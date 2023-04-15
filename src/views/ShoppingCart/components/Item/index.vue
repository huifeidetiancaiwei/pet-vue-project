<template>
  <div class="item_box" :class="prop_class">
    <div @click="itemCheck(list_index)">
      <CheckBox :prop_name="prop_name" :list_index="list_index"></CheckBox>
    </div>
    <div
      @click="toDetail(prop_data.spuId)"
      class="pointer"
      style="height:inherit"
    >
      <Pic :prop_src="prop_data.picUrl"></Pic>
    </div>
    <p class="item_title pointer" @click="toDetail(prop_data.spuId)">
      {{ prop_data.title }}
    </p>
    <div>
      <div class="input_box">
        <span class="pointer no_select" @click="changeNumber('minus')">-</span>
        <input
          type="text"
          :value="prop_data.num"
          pattern="\d"
          min="1"
          @input="inputHandler"
          @blur="e => changeNumber(e.target.value)"
        />
        <span class="pointer no_select" @click="changeNumber('add')">+</span>
      </div>
      <p>{{ prop_data.stockMsg || "有货" }}</p>
    </div>
    <p class="item_price">
      ￥&nbsp;{{
        prop_data.price.toFixed(2) ||
          (prop_data.unitPrice * prop_data.num).toFixed(2)
      }}
    </p>
    <div class="pointer" @click="prop_del(list_index)">[删除]</div>
  </div>
</template>
<script>
import CheckBox from "@/components/CheckBox";
export default {
  components: { CheckBox },
  props: {
    prop_class: {
      type: String,
      default: ""
    },
    prop_name: {
      type: String,
      default: ""
    },
    prop_data: {
      default: ""
    },
    list_index: {
      default: ""
    },
    //选中
    prop_checked: {
      type: Function
    },
    //删除
    prop_del: {
      type: Function,
      default: () => {}
    },
    // 数字
    prop_changeNumber: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    inputHandler(e) {
      let val = e.target.value.replace(/\D/g, "");
      if (val * 1) {
        e.target.value = val;
      } else {
        this.$toast("购买数量不能少于1");
        e.target.value = 1;
      }
    },
    toDetail(id) {
      let routeUrl = this.$router.resolve({
        path: "/item/" + id
      });
      window.open(routeUrl.href, "_blank");
    },
    changeNumber(state) {
      this.prop_changeNumber(state, this.list_index);
    },
    itemCheck(index) {
      this.prop_checked(index);
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
