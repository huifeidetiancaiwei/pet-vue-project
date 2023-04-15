<template>
  <div class="contentBox" :class="prop_class">
    <div :style="{ background: prop_color }"></div>
    <slot></slot>
    <div :style="{ background: prop_color }"></div>
  </div>
</template>
<script>
export default {
  name: "ContentBox",
  props: {
    prop_color: {
      type: String,
      default: ""
    },
    prop_class: {
      type: String,
      default: ""
    }
  }
};
</script>
