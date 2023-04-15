<template>
  <div class="checkbox" :class="prop_calss">
    <input type="checkbox" :name="prop_name" :value="list_index" />
  </div>
</template>
<script>
export default {
  props: {
    prop_calss: {
      type: String,
      default: ""
    },
    prop_name: {
      type: String,
      default: ""
    },
    list_index: {
      default: ""
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index");
</style>
