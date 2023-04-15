<template>
  <div>
    <div style="padding:20px;">
      <div class="item">
        <div class="show">
          <div class="picture" :style="styleObj"></div>
          <form id="tform" action title enctype="multipart/form-data">
            <div class="posBtn" v-show="hide">
              <span>&nbsp;+&nbsp;</span>
              <input
                type="file"
                id="upload"
                accept="image"
                onclick="this.form.reset();"
                @change="upload"
              />
            </div>
          </form>
        </div>
        <div class="BTN">
          <div class="button" @click="delSelfFn" v-if="headerImage">
            <Pic prop_src="delPic.png"></Pic>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { uploadFile } from "@/http";
export default {
  props: ["index", "delshow", "filename", "setRes", "delSelf", "uploadState"],
  data() {
    return {
      picValue: "",
      hide: true,
      url: "",
      headerImage: this.filename || "",
      domains: "",
      msg: "上传的图片大小不能超过5M",
      dialogVisible: false,
      styleObj: {},
      domain:
        process.env.NODE_ENV === "development"
          ? "http://81.68.239.184:8080/"
          : ""
    };
  },
  watch: {
    filename(val) {
      this.headerImage = val; // ②监听外部对props属性filename的变更，并同步到组件内的data属性myFilename中
      if (this.headerImage) {
        this.hide = false;
      } else {
        this.hide = true;
      }
    },
    headerImage() {
      if (this.headerImage) {
        this.styleObj.backgroundImage = `url(${this.headerImage})`;
        this.hide = false;
      } else {
        this.styleObj = {};
        this.hide = true;
      }
    }
  },
  methods: {
    upload(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgPreview(this.picValue);
      files = "";
      this.picValue = "";
    },
    imgPreview(file) {
      let self = this;
      if (/^image/.test(file.type)) {
        self.postImg(file);
      }
    },
    postImg(file) {
      this.uploadState(this.index, 1);
      uploadFile(file).then(res => {
        this.headerImage = res.data.filePath;
        this.setRes(this.index, res.data);
        this.uploadState(this.index, 0);
        this.hide = false;
      });
    },

    // 删除图片
    delPic() {
      this.picValue = "";
      this.headerImage = "";
      this.delSelf(this.index, "");
      this.hide = true;
    },
    // 删除自身元素
    delSelfFn() {
      this.index ? this.delSelf(this.index) : this.delPic();
    }
  }
};
</script>
<style scoped lang="less">
@import url("./index");
</style>
