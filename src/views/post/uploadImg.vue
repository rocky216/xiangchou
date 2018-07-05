<template lang="html">
<div class="uploadImg">
  <div class="croperBox">
    <vueCropper
      ref="cropper"
      :img="option.img"
      :outputSize="option.size"
      :outputType="option.outputType"
      :autoCrop="option.autoCrop"
      :fixedBox="option.fixedBox"
    ></vueCropper>
  </div>
  <div class="operation">
    <Button @click="getCropData" type="primary" size="small">
      <i class="fa fa-check"></i>
    </Button>
    <Button @click="rotate(1)" type="primary" size="small">
      <i class="fa fa-repeat"></i>
    </Button>
    <Button @click="rotate(2)" type="primary" size="small">
      <i class="fa fa-rotate-left"></i>
    </Button>
    <Button @click="scale(1)" type="primary" size="small">
      <i class="fa fa-search-plus"></i>
    </Button>
    <Button @click="scale(-1)" type="primary" size="small">
      <i class="fa fa-search-minus"></i>
    </Button>
    <Button @click="cancelHandle" type="primary" size="small">
      <i class="fa fa-close"></i>
    </Button>
  </div>
</div>
</template>

<script>
import vueCropper from 'vue-cropper';
import {Button} from "mint-ui"

export default {
  components: {
    vueCropper,
    Button
  },
  props: ["cancel"],
  data(){
    return {
      option: {
        img: '/images/aa.png',
        size: 0.1,
        outputType: 'jpg||png||jpeg',
        full: false,
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 300,
        fixedBox: true
      }
    }
  },
  methods: {
    cancelHandle(){
      this.$emit("cancel")
    },
    getImg(img){
      this.option.img = img
    },
    getCropData(){
      this.$refs.cropper.getCropData((data) => {
        this.$emit("ok", data)
      })
    },
    rotate(value){
      value==1?this.$refs.cropper.rotateRight():this.$refs.cropper.rotateLeft()
    },
    scale(value){
      this.$refs.cropper.changeScale(value)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../asset/less/common.less";
.uploadImg {
  width: 100%;
  height: 100%;
  position: fixed;
  left:0;
  top:0;
  background-color: @whiteColor;
  z-index: 20;
  .operation {
    margin-top: 0.3rem;
    button {
      margin-left: 0.3rem;
    }
  }
}
.croperBox {
  width: 10rem;
  height: 12rem;
}

</style>
