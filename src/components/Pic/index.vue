<template>
  <div :class="prop_class">
    <img :src="empty_src || reqireSrc" alt="pic" @error="handlerError" />
  </div>
</template>
<script>
export default {
  props: {
    prop_class: {
      type: String,
      default: "pic_default_class"
    },
    prop_src: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      empty_src: ""
    };
  },
  computed: {
    reqireSrc() {
      if (this.prop_src) {
        return /^http|https/.test(this.prop_src)
          ? this.prop_src
          : require(`@/assets/images/${this.prop_src}`);
      } else {
        return "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
      }
    }
  },
  methods: {
    handlerError() {
      this.empty_src =
        "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
