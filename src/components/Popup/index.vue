<template>
  <div id="alertModal">
    <div class="alert_mask" @click="closePop"></div>
    <div class="alert_container">
      <template v-if="!$slots.default">
        <Tips
          v-show="!showLogin && !navBarShowPop"
          :showLoginFn="showLoginFn"
        ></Tips>
        <Login v-show="showLogin || navBarShowPop"></Login>
      </template>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Tips from "../Tips";
export default {
  components: { Tips },
  computed: {
    navBarShowPop() {
      return this.$store.state.navBarShowPop;
    }
  },
  data() {
    return {
      showLogin: false
    };
  },
  methods: {
    showLoginFn() {
      this.showLogin = true;
    },
    //关闭弹窗
    closePop() {
      this.$store.dispatch("showPop", false);
    }
  },
  mounted() {
    document.body.appendChild(this.$el);
  },
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
