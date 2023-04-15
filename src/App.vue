<template>
  <div id="app">
    <!-- nav bar -->
    <router-view />
  </div>
</template>
<script>
export default {};
</script>
<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @blackFont;
  font-size: 14px;
}
/* 清除内外边距 */
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, /* structural elements 结构元素 */
dl, dt, dd, ul, ol, li, /* list elements 列表元素 */
pre, /* text formatting elements 文本格式元素 */
fieldset, lengend, button, input, textarea, /* form elements 表单元素 */
th, td {
  /* table elements 表格元素 */
  margin: 0;
  padding: 0;
  vertical-align: middle;
}

input,
textarea,
select {
  border: none;
  outline: none;
}

img {
  vertical-align: text-top;
}

/**内容核心区域样式 */
.contentBox {
  display: flex;
  justify-content: space-between;
  & > :first-child,
  & > :last-child {
    flex: 1;
  }
  & > :nth-child(2) {
    width: 1200px;
  }
}

//禁止选择
.no_select {
  user-select: none;
}

//点击手势
.pointer {
  cursor: pointer;
  .no_select;
}
//禁止
.disabled {
  cursor: no-drop;
}
</style>
