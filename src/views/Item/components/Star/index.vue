<template>
  <div class="star_box" :class="prop_class">
    <div
      v-for="(item, index) in starList"
      :key="'star' + index"
      @mouseover="starHover(index)"
    >
      <Pic :prop_src="item"></Pic>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    prop_class: {
      type: String,
      default: ""
    },
    prop_num: {
      default: 1
    },
    prop_setVal: {
      default: ""
    }
  },
  data() {
    return {
      srcList: ["empty_star.png", "helf_star.png", "full_star.png"],
      num: 1
    };
  },
  computed: {
    starList() {
      let arr = [];
      //全,半,空图片
      for (let x = 1; x < 6; ++x) {
        if (this.num.toFixed() < x) {
          arr.push(this.srcList[0]);
        } else if (this.num.toFixed() >= x) {
          arr.push(this.srcList[2]);
        } else {
          arr.push(this.srcList[1]);
        }
      }

      return arr;
    }
  },
  created() {
    this.num = this.prop_setVal ? 5 : this.prop_num;
  },
  methods: {
    starHover(ind) {
      if (this.prop_setVal) {
        let index = ind + 1;
        this.num = index;
        this.prop_setVal(index);
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
